import { useState, useEffect, useRef } from "react";
import apiClient from "../services/apiClient"; // apiClient가 존재하는 경로로 수정해서 사용하기

// API 호출을 관리하는 커스텀 훅
// @param {string} url - API 엔드포인트 URL
// @param {object} options - 추가 요청 옵션
// @returns {{data: any, loading: boolean, error: any, refetch: function}} 데이터, 로딩 상태, 에러, 재요청 함수
export const useApi = (url, options = {}) => {
  // 데이터 상태 관리
  const [data, setData] = useState(null);
  // 로딩 상태 관리 (useLoading 훅 조합 가능)
  const [loading, setLoading] = useState(true);
  // 에러 상태 관리
  const [error, setError] = useState(null);
  // 컴포넌트 마운트 상태 추적
  const isMounted = useRef(true);

  // API 호출 함수
  const fetchData = async () => {
    try {
      // 로딩 시작
      setLoading(true);
      setError(null);
      // apiClient로 데이터 페칭
      const response = await apiClient.get(url, options);
      // 컴포넌트가 마운트된 상태일 때만 상태 업데이트
      if (isMounted.current) {
        setData(response);
      }
    } catch (err) {
      // 컴포넌트가 마운트된 상태일 때만 에러 업데이트
      if (isMounted.current) {
        setError(err);
      }
    } finally {
      // 로딩 상태 해제
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // API 호출 및 상태 업데이트
  useEffect(() => {
    fetchData();
  }, [url, JSON.stringify(options)]); // URL과 options 변경 시 재요청

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 수동 재요청 함수
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useApi;
