# API Client 사용법

## ⚠️ 중요: API Client 위치 변경

**apiClient는 `config/api.js`로 이동되었습니다.**

- 더 고급 기능 제공 (토큰 갱신, 재시도 로직, 디버그 로그)
- 중앙화된 설정 관리
- Supabase 전환 가이드 포함

## 사용법

```jsx
import apiClient from '../config/api.js'; // 새로운 경로

const fetchUserInfo = async () => {
  try {
    const data = await apiClient.get('/user/profile');
    console.log('사용자 정보:', data);
  } catch (error) {
    console.error('요청 실패:', error.message);
  }
};
```

## 기존 설명 (참고용)

apiClient는 axios를 기반으로 구성된 커스텀 API 클라이언트로, 공통 요청 설정, 인증 토큰 자동 주입, 응답 처리, 네트워크 오류 재시도 등의 기능을 통합 제공합니다.

이 클라이언트를 사용하면 API 요청 로직을 일관성 있게 구성하고, 중복된 처리 로직을 줄이며 유지 보수성을 높일 수 있습니다.

**기본 설정:**

- baseURL: 환경변수(VITE_API_BASE_URL)에서 불러옴.

- timeout: 10초 (10,000ms) 응답 제한 시간 설정.

- Content-Type: 기본 요청 헤더로 application/json 설정.

**요청 인터셉터:**

- 요청 전 localStorage에서 token을 가져와 Authorization: Bearer {token} 헤더 자동 추가.

- 인증이 필요한 모든 API 요청에서 중복 코드 없이 사용 가능.

**응답 인터셉터:**

- 응답이 성공하면 response.data만 반환.

- 실패 응답일 경우 상태 코드 및 메시지를 기반으로 적절한 예외 처리:

- 401 (Unauthorized): 토큰 삭제 후 /login으로 이동.

- 네트워크 오류: 3회까지 자동 재시도. 이후에도 실패하면 사용자에게 에러 메시지 제공.

**재시도 로직:**

- 연결 끊김 또는 타임아웃(ECONNABORTED, Network Error) 발생 시 최대 3회까지 재요청.

- 재시도 간 1초씩 지연(RETRY_DELAY \* retryCount).

### 사용 시나리오

- 인증 기반 API 호출

- 서버 응답을 표준화하여 처리할 때

- 네트워크 불안정 상황에서도 견고한 요청 로직이 필요할 때

### 장점

- 공통화: 모든 API 요청에서 동일한 설정 및 에러 처리를 사용하므로 코드 중복 최소화.

- 보안성: 토큰 자동 주입 및 만료 시 자동 로그아웃 처리로 보안 강화.

- 확장성: 글로벌 에러 처리, 다국어 메시지, 로깅 시스템 등과 쉽게 통합 가능.

- 신뢰성: 재시도 기능을 통해 일시적인 네트워크 오류에도 안정적인 서비스 제공.

### 주의사항

- 토큰 관리: 토큰 갱신(Refresh Token) 기능이 필요할 경우 추가 구현이 필요함. (useAuth에서 처리 예정)

- 에러 메시지 표준화: 서버에서 응답하는 에러 메시지 구조가 일관되어야 정확한 메시지 추출 가능.

- 서버 에러 처리: 특정 에러 코드(예: 403, 500 등)에 대한 추가 로직은 필요에 따라 구현.

### TIP

- useLoading과 함께 사용하여 API 호출 중 로딩 스피너 구현 가능.

- 전역 상태 라이브러리(Zustand, Recoil 등)와 결합 시 사용자 정보 및 토큰 상태를 효율적으로 관리 가능.

- apiClient.post(...) 등 모든 HTTP 메서드 사용 가능 (get, post, put, delete 등).

## 예시 코드

```jsx
import apiClient from '../config/api';

const fetchUserInfo = async () => {
  try {
    const data = await apiClient.get('/user/profile');
    console.log('사용자 정보:', data);
  } catch (error) {
    console.error('요청 실패:', error.message);
  }
};
```

---
