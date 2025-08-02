# useLoading 커스텀 훅

useLoading 훅은 비동기 작업(예: API 호출, 파일 업로드)의 로딩 상태를 관리하는 데 사용된다.
이 훅은 로딩 상태(isLoading)와 비동기 작업을 실행하는 함수(startLoading)를 반환하며, 컴포넌트에서 간단히 호출하여 로딩 상태를 처리할 수 있습니다.
빠르게 로딩 UI(예: 로딩 스피너)를 구현하고, 코드 재사용성을 높이는 데 유용하다.

## 예시 코드

```jsx
import React from 'react';
import useLoading from '../hooks/useLoading';
import apiClient from '../services/apiClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyComponent = () => {
  // useLoading 훅에서 로딩 상태와 비동기 실행 함수 가져오기
  const [isLoading, startLoading] = useLoading();

  const handleFetchData = async () => {
    try {
      // apiClient를 사용해 데이터 페칭, startLoading으로 로딩 상태 관리
      const data = await startLoading(apiClient.get('/some-endpoint'));
      console.log('Data fetched:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      {isLoading ? (
        // 로딩 중일 때 스피너 표시
        <LoadingSpinner message="데이터를 불러오는 중..." />
      ) : (
        // 로딩 완료 시 버튼 표시
        <button onClick={handleFetchData}>데이터 가져오기</button>
      )}
    </div>
  );
};

export default MyComponent;
```

loading에 따라 로딩 스피너를 보여주는 곳에 사용할 수 있다.

- 사용 시나리오:
  - API 호출: apiClient.get 같은 비동기 요청의 로딩 상태를 관리.
  - 파일 업로드: 파일 업로드 프로세스의 로딩 상태를 표시.
  - 데이터 처리: 복잡한 데이터 처리 작업(예: 대량 데이터 필터링) 중 로딩 상태를 관리.
