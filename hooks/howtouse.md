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

# useApi 커스텀 훅

## 주요 기능 및 설명

useApi는 API 요청을 간단하게 처리할 수 있도록 만든 커스텀 훅으로, 자동 요청/응답 관리, 로딩 및 에러 상태 관리, 수동 재요청(refetch) 기능을 제공한다.
이 훅은 비동기 요청이 필요한 컴포넌트에서 반복되는 로직을 줄이고, 코드 가독성과 유지 보수성을 향상시키는 데 유용합니다.

**자동 요청 실행:**

- 컴포넌트가 마운트되면 apiClient를 통해 자동으로 요청 실행.

- url 또는 options가 변경되면 자동으로 다시 요청.

**상태 관리:**

- data: 성공 시 받은 응답 데이터.

- loading: 요청 중 true.

- error: 요청 실패 시 에러 객체 저장.

**재요청 기능:**

- refetch() 함수를 통해 수동으로 API 요청을 다시 실행할 수 있음.

- 메모리 누수 방지

- 컴포넌트 언마운트 후에도 setState가 발생하지 않도록 useRef로 마운트 상태 추적.

### 사용 시나리오

- 페이지 진입 시 자동으로 데이터 로드가 필요한 경우

- 실시간 데이터 갱신을 위해 수동 재요청 기능이 필요한 경우

- 리스트, 상세 페이지 등 다양한 API 요청 UI 컴포넌트에 반복 사용

### 장점

- 자동화: 마운트 시 자동 요청, 상태 자동 관리로 개발 속도 향상.

- 재사용성: 여러 API 요청 컴포넌트에 동일한 훅 재사용 가능.

- 간결성: 로딩/에러/데이터 상태를 훅 내부에서 일괄 처리.

- 안정성: 컴포넌트가 언마운트되었을 때 setState 방지 처리 포함.

### 주의사항

- GET 요청 전용: 현재 구현은 apiClient.get()만 사용. 다른 메서드(POST, PUT 등)는 별도 구현 필요.

- 의존성 주의: options가 객체일 경우 참조 주소가 변경되어 의도치 않게 useEffect가 재실행될 수 있으므로, JSON.stringify(options)로 처리 중.

- 에러 처리: 반환된 error는 try-catch가 아닌 UI에서 조건문으로 처리해야 함.

### TIP

- useLoading 또는 useErrorBoundary 등과 조합하면 더 정교한 상태 관리 가능.

- react-query와 같은 라이브러리 도입 전, 경량화된 자체 API 요청 시스템으로 활용하기 좋음.

- refetch를 버튼, 타이머 등 다양한 트리거와 결합해 유저 경험 개선 가능.
