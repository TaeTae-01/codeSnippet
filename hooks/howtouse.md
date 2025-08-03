# useLoading 커스텀 훅

## 주요 기능 및 설명

useLoading 훅은 외부에서 전달받은 비동기 작업(Promise)을 실행하며 로딩 상태를 자동으로 관리합니다.
비동기 작업의 성공/실패와 관계없이 로딩 상태를 일관되게 처리하며, UI와 로직을 분리해 코드의 재사용성과 가독성을 높일 수 있습니다.

### 사용 시나리오

- API 호출: apiClient.get() 등의 비동기 요청 처리 시 로딩 상태 관리.

- 파일 업로드: 대용량 파일 업로드 시 진행 상황 표시.

- 복잡한 데이터 처리: 데이터 필터링, 정렬, 연산 처리 등 처리 중 로딩 표시.

### 장점

- 재사용성: 여러 컴포넌트에서 동일한 로딩 관리 로직을 공유 가능.

- 단순화: try/catch + 로딩 상태 업데이트를 한 줄로 간결하게 처리.

- UI 분리: 비동기 작업과 UI 렌더링을 명확히 분리해 구조적 설계 가능.

- 테스트 용이성: 독립적인 훅으로 단위 테스트 작성에 유리.

### 주의사항

- 에러 처리 필수: startLoading은 에러를 내부에서 처리하지 않고 그대로 던지므로, 호출부에서 try-catch로 처리해야 함.

- useCallback 최적화: startLoading은 useCallback으로 메모이제이션되어 있어 의존성 관리 주의.

### TIP

- LoadingSpinner 컴포넌트와 결합하면 빠르게 UX 개선 가능.

- 여러 API 요청을 병렬 또는 순차 처리할 때도 startLoading으로 감싸 사용 가능.

- 로딩 상태에 따라 버튼 비활성화, 스켈레톤 UI 등을 쉽게 구현 가능.

- 팀원들에게 useLoading 사용을 가이드하면 일관된 사용자 경험 제공 가능.

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

---
