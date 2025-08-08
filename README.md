# 🚀 Supabase + React + Vite 템플릿

> **즉시 사용 가능한 완전한 인증 시스템**  
> 환경변수 2개만 설정하면 5분 만에 프로덕션 수준의 Supabase 앱을 구축할 수 있습니다.

이 템플릿은 Supabase 기반의 현대적 웹 애플리케이션 개발을 위한 완전한 스타터 키트입니다. 해커톤, 공모전, MVP 개발에 최적화되어 있으며, 복잡한 설정 없이 바로 비즈니스 로직에 집중할 수 있도록 설계되었습니다.

## ⚡ 5분 만에 시작하기

```bash
# 1. 프로젝트 설치
npm install

# 2. 환경변수 설정 (필수)
cp .env.template .env
# .env 파일에서 Supabase URL과 Key만 수정

# 3. 프로젝트 설정 및 .gitignore 추가 (필수)
# settings/프로젝트_설정_가이드.md를 확인하고
# .gitignore 파일을 생성한 후 가이드의 내용을 복사/붙여넣기

# 4. 즉시 사용 시작!
npm run dev
```

## 🚨 **시작 전 필수 설정**

**반드시 프로젝트를 시작하기 전에 다음 단계를 완료해주세요:**

1. **📋 프로젝트 설정 가이드 확인**: [`settings/프로젝트_설정_가이드.md`](./settings/프로젝트_설정_가이드.md)를 읽어주세요
2. **📂 .gitignore 파일 생성**: 루트 디렉토리에 `.gitignore` 파일을 생성하고, 가이드의 **".gitignore"** 섹션 내용을 복사해서 붙여넣어주세요
3. **🔧 환경변수 설정**: `env/.env.example`을 참고하여 `.env` 파일을 설정해주세요

> 💡 **왜 .gitignore를 직접 만드나요?**  
> 이 프로젝트는 코드 스니팻 라이브러리로, 모든 파일이 학습 목적으로 공유되어야 합니다. 실제 프로젝트 시작 시에는 민감한 정보(.env 등)를 보호하기 위해 .gitignore를 추가해야 합니다.

## 🎯 **핵심 기능**

### ✅ **완전한 Supabase 통합**
- **🔐 Auth**: 로그인/로그아웃/회원가입/OAuth - JWT 자동 관리
- **🗃️ Database**: CRUD + RPC 함수 - PostgreSQL 직접 접근  
- **📦 Storage**: 파일 업로드/다운로드 - CDN 자동 최적화
- **⚡ Realtime**: 실시간 구독 - WebSocket 자동 관리

### ✅ **프로덕션 준비 완료**
- **에러 처리**: PostgreSQL 에러 → 한국어 메시지 자동 변환
- **재시도 로직**: 네트워크 실패 시 지수 백오프로 자동 재시도  
- **보안 기능**: PKCE 플로우, RLS 정책, 토큰 자동 관리
- **모니터링**: 디버그 모드와 상세 로깅

### ✅ **개발자 친화적**
- **경로 별칭**: `@components`, `@utils` 자동 매핑
- **코드 품질**: ESLint + Prettier + 환경별 설정
- **테스트 환경**: Vitest + Testing Library 완전 설정
- **Docker 배포**: 멀티스테이지 빌드 + Nginx 최적화

## 📂 **프로젝트 구조**

```
project/
├── config/                    # 🔥 Supabase 통합 핵심
│   ├── api.js                # API 클라이언트 (에러처리+재시도)
│   ├── constants.js          # 상수 및 에러 메시지  
│   ├── supabase.js          # Supabase 클라이언트 설정
│   └── API_유틸리티_가이드.md # 완전한 사용 가이드 (590줄)
├── hooks/                    # React 커스텀 훅
│   ├── useApi.js            # 자동 API 요청 관리
│   ├── useLoading.js        # 로딩 상태 관리
│   └── 커스텀_훅_가이드.md    # 훅 사용법 가이드
├── utils/                    # 유틸리티 함수
│   ├── env.js               # 환경변수 관리
│   └── validation.js        # 데이터 검증
├── .env.template            # 환경변수 템플릿
├── TEST_REPORT.md           # 포괄적 테스트 리포트 (100% 통과)
├── Dockerfile               # 프로덕션 배포 설정
├── 테스트_설정_가이드.md      # 현대적 테스트 전략
└── 프로젝트_설정_가이드.md    # 완전한 프로젝트 설정 가이드
```

## 🔧 **Supabase 설정**

### 1. Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. Settings → API에서 URL과 Anon Key 복사

### 2. 환경변수 설정
```bash
# .env 파일 수정 (필수)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### 3. 데이터베이스 설정 (선택사항)
```sql
-- Supabase SQL Editor에서 실행
-- 사용자 프로필 테이블 + RLS 정책 + 자동 트리거
CREATE TABLE profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text
);

-- RLS 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles  
  FOR UPDATE USING (auth.uid() = id);
```

## 🚀 **즉시 사용 예시**

### 인증 시스템
```jsx
import { auth } from './config/supabase.js';

// 회원가입
await auth.signUp(email, password, { 
  data: { full_name: "사용자명" } 
});

// 로그인
await auth.signIn(email, password);

// 현재 사용자
const user = await auth.getUser();

// 로그아웃
await auth.signOut();
```

### 데이터베이스 CRUD
```jsx
import { db } from './config/supabase.js';

// 조회
const users = await db.from('profiles').select('*');

// 생성
const newUser = await db.from('profiles').insert({
  username: 'john_doe',
  full_name: 'John Doe'
});

// 수정  
await db.from('profiles')
  .update({ full_name: 'Updated Name' })
  .eq('id', userId);
```

### 실시간 기능
```jsx
import { realtime } from './config/supabase.js';

// 실시간 구독
const subscription = realtime.subscribe(
  'profiles', 
  (payload) => {
    console.log('변경 감지:', payload.new);
  }
);

// 구독 해제
realtime.unsubscribe(subscription);
```

## 📋 **개발 스크립트**

```bash
# 개발 서버 시작
npm run dev

# 코드 품질 관리
npm run lint          # ESLint 검사
npm run format        # Prettier 포맷팅
npm run lint:prod     # 프로덕션 수준 검사

# 테스트 실행
npm test              # 테스트 실행
npm run test:ui       # 브라우저에서 테스트 결과 확인
npm run test:coverage # 커버리지 확인

# 빌드 및 배포
npm run build         # 프로덕션 빌드
npm run preview       # 빌드 결과 미리보기
```

## 🐳 **Docker 배포**

```bash
# Docker 이미지 빌드
docker build -t my-supabase-app .

# 로컬에서 실행
docker run -d -p 80:80 my-supabase-app

# http://localhost에서 확인
```

## 🎯 **사용 시나리오**

### 🏆 **해커톤/공모전 (10-14일)**
- **5분 설정**: 환경변수만 설정하면 인증 시스템 완성
- **비즈니스 로직 집중**: 복잡한 백엔드 구축 없이 프론트엔드에 집중
- **실시간 기능**: 채팅, 알림 등을 쉽게 구현

### 🚀 **MVP 개발**
- **프로덕션 수준**: 실제 서비스에서 사용 가능한 보안과 성능
- **확장 가능**: 사용자 증가에 따른 자동 스케일링
- **비용 효율적**: Supabase 무료 티어로 시작

### 🏢 **기업 프로젝트**
- **보안**: RLS 정책, JWT 토큰, PKCE 플로우
- **모니터링**: 상세한 로깅과 에러 추적
- **유지보수**: 체계적인 코드 구조와 문서화

## 📚 **문서 가이드**

- **[🔧 프로젝트 설정 가이드](./프로젝트_설정_가이드.md)**: Vite, ESLint, Docker 등 전체 설정
- **[📡 API 유틸리티 가이드](./config/API_유틸리티_가이드.md)**: Supabase 사용법과 예시 (590줄)  
- **[🧪 테스트 설정 가이드](./테스트_설정_가이드.md)**: 현대적 테스트 전략 (우아한형제들+토스)
- **[🪝 커스텀 훅 가이드](./hooks/커스텀_훅_가이드.md)**: useApi, useLoading 활용법
- **[📋 테스트 리포트](./TEST_REPORT.md)**: 100% 테스트 통과 검증 결과

## 🎉 **검증된 품질**

**✅ 100% 테스트 통과** (11/11 테스트)
- 회원가입/로그인/로그아웃 완전 검증
- 실제 Supabase 환경에서 테스트 완료  
- 프로덕션 수준의 에러 처리 확인

**✅ 프로덕션 준비 완료**
- 자동 토큰 갱신 및 세션 관리
- PostgreSQL RLS 정책 적용
- 한국어 에러 메시지 지원

**✅ 개발자 경험 최적화**
- VSCode 설정 및 확장 프로그램 포함
- 실시간 테스트 피드백 환경
- 포괄적인 문서화 (총 1500+ 줄)

## 💡 **다음 단계**

1. **빠른 시작**: `.env.template`을 복사하여 Supabase 설정
2. **기능 확장**: `config/API_유틸리티_가이드.md`에서 고급 사용법 학습
3. **테스트 작성**: `테스트_설정_가이드.md`로 품질 관리 시작
4. **배포**: Docker로 프로덕션 배포

---

**🚀 지금 바로 시작해보세요!** 5분 만에 완전한 Supabase 앱을 구축할 수 있습니다.
