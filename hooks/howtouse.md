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

  - API 호출: apiClient.get 같은 비동기 요청의 로딩 상태 관리.
  - 파일 업로드: 파일 업로드 프로세스 중 로딩 상태 표시.
  - 데이터 처리: 복잡한 데이터 처리(예: 대량 데이터 필터링) 중 로딩 상태 관리.

- 장점:

  - 재사용성: 여러 컴포넌트에서 동일한 로딩 상태 관리 로직 공유.
  - 단순화: 컴포넌트 내부 로딩 상태 관리 코드 제거로 가독성 향상.
  - 사용자 경험: LoadingSpinner와 결합하여 직관적인 UI 제공.
  - 테스트 용이성: 독립적인 훅으로 단위 테스트(Vitest 등) 작성 용이.

- 주의사항:

  - 에러 처리: startLoading은 에러를 호출한 곳으로 전달하므로, try-catch로 처리.
  - 의존성 관리: useCallback의 의존성 배열이 비어 있으므로, 외부 의존성 추가 시 업데이트.

- TIP:
  - LoadingSpinner와 결합하여 빠르게 로딩 UI 구현.
  - 다양한 비동기 작업(API 호출, 파일 업로드 등)에 적용하여 유연성 확보.
  - 팀원들에게 훅 사용법 공유로 일관된 로딩 상태 관리.
