import axios from "axios";

// 재시도 설정
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 1000; // 1초

// 기본 API 요청 설정
const apiClient = axios.create({
  // 환경변수에서 API 기본 URL 설정
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // 요청 타임아웃 설정 (10초)
  timeout: 10000,
  headers: {
    // 기본 Content-Type 설정
    "Content-Type": "application/json",
  },
});

// 재시도 로직을 위한 헬퍼 함수
const retryRequest = async (error) => {
  const config = error.config;
  
  // 재시도 횟수 초기화
  if (!config.retryCount) {
    config.retryCount = 0;
  }
  
  // 최대 재시도 횟수 초과 시 에러 반환
  if (config.retryCount >= MAX_RETRY_COUNT) {
    return Promise.reject(error);
  }
  
  // 재시도 횟수 증가
  config.retryCount += 1;
  
  // 재시도 딜레이
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * config.retryCount));
  
  // 요청 재시도
  return apiClient.request(config);
};

// 요청 인터셉터: 모든 요청에 공통 헤더 추가
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 AccessToken 가져오기
    const token = localStorage.getItem("token");
    // 토큰이 존재하면 Authorization 헤더에 Bearer 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 에러 발생 시 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 데이터와 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답의 데이터만 반환
    return response.data;
  },
  async (error) => {
    // 네트워크 에러 처리
    if (!error.response) {
      // 네트워크 연결 실패 시 재시도
      if (error.code === "ECONNABORTED" || error.message === "Network Error") {
        try {
          return await retryRequest(error);
        } catch (retryError) {
          console.error("Network error after retries:", retryError);
          throw new Error("네트워크 연결을 확인해주세요.");
        }
      }
    }
    
    // 401 Unauthorized 에러 시 토큰 제거 및 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    // 서버 에러 메시지 추출
    const errorMessage = error.response?.data?.message || error.message || "알 수 없는 오류가 발생했습니다.";
    
    // 에러를 호출한 곳으로 전달
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
