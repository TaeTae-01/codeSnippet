# 🚀 Supabase Config 템플릿 - 완전한 가이드

> **즉시 사용 가능한 Supabase 통합 설정**
> 이 config 디렉토리를 복사하고 환경변수만 설정하면 5분 만에 Supabase를 사용할 수 있습니다.

## ⚡ **5분 만에 시작하기**

### 🔥 **즉시 사용법**

1. **이 config 디렉토리 전체를 새 프로젝트에 복사**
2. **프로젝트 루트에 `.env.template`을 `.env`로 복사**
3. **Supabase 프로젝트 생성 후 URL과 Key만 입력**
4. **바로 사용 시작!**

```bash
# 1. 환경변수 설정
cp .env.template .env

# 2. .env 파일에서 이 2줄만 수정 (필수)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 3. 의존성 설치
npm install @supabase/supabase-js

# 4. 즉시 사용 가능!
npm run dev
```

### 🎯 **즉시 사용 가능한 기능들**

```javascript
import apiClient from "./config/api";
import { SUPABASE_REFERENCES, ERROR_MESSAGES } from "./config/constants";

// 🔐 인증 (JWT 자동 관리)
await apiClient.auth.signIn("user@example.com", "password");
await apiClient.auth.signOut();

// 🗃️ 데이터베이스 (자동 에러 처리)
const users = await apiClient.from("users").select("*");
const newUser = await apiClient.from("users").insert({ name: "John" });

// ⚡ 실시간 기능 (WebSocket 자동 관리)
import { realtime } from "./config/supabase";
realtime.subscribe("messages", callback, "INSERT");
```

---

## 📌 **템플릿 구성**

이 문서는 `config/api.js`를 통해 Supabase 클라이언트를 관리하고, `config/constants.js`로 테이블 참조, 에러 메시지, 상태 코드를 정의하는 방법을 설명합니다. 해커톤 및 공모전(10~14일 시간 제약)에 최적화되어 팀원들이 빠르게 Supabase 환경을 구축하고 인증부터 실시간 기능까지 활용할 수 있도록 설계되었습니다.

### **템플릿 특징**

- ✅ **복사 & 붙여넫기만으로 즉시 사용 가능**
- ✅ **환경변수 2개만 설정하면 완료**
- ✅ **기존 Axios 패턴과 100% 호환**
- ✅ **프로덕션 수준의 에러 처리와 재시도 로직**

### **파일 구성**

```
config/                                   # 📁 이 디렉토리를 통째로 복사
├── api.js                               # Supabase API 클라이언트 (228줄)
├── constants.js                         # Supabase 상수 정의 (196줄)
├── supabase.js                          # 공식 Supabase 클라이언트 (201줄)
└── API_유틸리티_가이드.md                # 완전한 사용 가이드 (이 파일)

.env.template                            # 환경변수 템플릿
```

## 🎯 **핵심 기능**

### **Supabase 완전 통합**

- **Auth**: 로그인/로그아웃/회원가입/OAuth - JWT 자동 관리
- **Database**: CRUD + RPC 함수 - PostgreSQL 직접 접근
- **Storage**: 파일 업로드/다운로드 - CDN 자동 최적화
- **Realtime**: 실시간 구독 - WebSocket 자동 관리

### **개발자 친화적**

- **에러 처리**: PostgreSQL 에러 → 한국어 메시지 자동 변환
- **재시도 로직**: 네트워크 실패 시 지수 백오프로 자동 재시도
- **타입 안전성**: TypeScript 완전 지원
- **디버그 모드**: 상세한 로그와 에러 추적

## 🔧 **Supabase 프로젝트 설정**

### 1. **Supabase 프로젝트 생성**

1. [supabase.com](https://supabase.com)에서 **"New Project"** 클릭
2. **Organization** 선택 (또는 새로 생성)
3. **Project Name** 입력 (예: `my-app`)
4. **Database Password** 설정 (강력한 비밀번호 권장)
5. **Region** 선택 (한국의 경우 `Northeast Asia (Seoul)` 권장)
6. **Create new project** 클릭

### 2. **API 키 가져오기**

1. 프로젝트 생성 완료 후 **Settings → API** 이동
2. 다음 2개 값을 복사:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIs...` (매우 긴 문자열)

### 3. **환경변수 설정**

```bash
# .env 파일 생성 (프로젝트 루트)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

## 📚 **실제 사용 예시**

### **예시 1: 사용자 인증 시스템**

```jsx
// src/components/Auth.jsx
import { useState } from "react";
import apiClient from "../config/api";
import { ERROR_MESSAGES } from "../config/constants";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const data = await apiClient.auth.signIn(email, password);
      setUser(data.user);
      alert(`환영합니다, ${data.user.email}!`);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await apiClient.auth.signOut();
    setUser(null);
    alert("로그아웃 완료");
  };

  if (user) {
    return (
      <div>
        <h2>안녕하세요, {user.email}!</h2>
        <button onClick={handleSignOut}>로그아웃</button>
      </div>
    );
  }

  return (
    <div>
      <h2>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
};

export default Auth;
```

### **예시 2: 데이터베이스 CRUD**

```jsx
// src/components/UserManager.jsx
import { useState, useEffect } from "react";
import apiClient from "../config/api";
import { SUPABASE_REFERENCES, ERROR_MESSAGES } from "../config/constants";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [loading, setLoading] = useState(false);

  // 사용자 목록 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiClient
          .from(SUPABASE_REFERENCES.TABLES.USERS)
          .select("id, name, email, created_at")
          .order("created_at", { ascending: false });
        setUsers(data);
      } catch (error) {
        console.error("사용자 목록 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 새 사용자 추가
  const addUser = async () => {
    if (!newUserName.trim()) return;

    try {
      const data = await apiClient
        .from(SUPABASE_REFERENCES.TABLES.USERS)
        .insert([{ name: newUserName, email: `${newUserName}@example.com` }]);

      setUsers([...data, ...users]);
      setNewUserName("");
      alert("사용자 추가 완료!");
    } catch (error) {
      alert(`추가 실패: ${error.message}`);
    }
  };

  // 사용자 삭제
  const deleteUser = async (userId) => {
    try {
      await apiClient
        .from(SUPABASE_REFERENCES.TABLES.USERS)
        .delete()
        .eq("id", userId);

      setUsers(users.filter((user) => user.id !== userId));
      alert("삭제 완료!");
    } catch (error) {
      alert(`삭제 실패: ${error.message}`);
    }
  };

  if (loading) return <div>사용자 목록 로딩 중...</div>;

  return (
    <div>
      <h2>사용자 관리</h2>

      {/* 사용자 추가 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="새 사용자 이름"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={addUser}>추가</button>
      </div>

      {/* 사용자 목록 */}
      <div>
        {users.length === 0 ? (
          <p>사용자가 없습니다.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{user.name}</strong> ({user.email})
                <small>
                  {" "}
                  - {new Date(user.created_at).toLocaleDateString()}
                </small>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                style={{ color: "red" }}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManager;
```

### **예시 3: 실시간 채팅**

```jsx
// src/components/RealtimeChat.jsx
import { useState, useEffect, useRef } from "react";
import { realtime } from "../config/supabase";
import apiClient from "../config/api";
import { SUPABASE_REFERENCES } from "../config/constants";

const RealtimeChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await apiClient.session.getUser();
        setUser(userData);
      } catch (error) {
        console.log("사용자 정보 없음");
      }
    };
    getUser();
  }, []);

  // 기존 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await apiClient
          .from(SUPABASE_REFERENCES.TABLES.MESSAGES)
          .select("*")
          .order("created_at", { ascending: true })
          .limit(50);
        setMessages(data);
      } catch (error) {
        console.error("메시지 로딩 실패:", error);
      }
    };

    loadMessages();
  }, []);

  // 실시간 메시지 구독
  useEffect(() => {
    const subscription = realtime.subscribe(
      SUPABASE_REFERENCES.TABLES.MESSAGES,
      (payload) => {
        if (payload.eventType === "INSERT") {
          setMessages((prev) => [...prev, payload.new]);
        }
      },
      "INSERT"
    );

    return () => {
      realtime.unsubscribe(subscription);
    };
  }, []);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await apiClient.from(SUPABASE_REFERENCES.TABLES.MESSAGES).insert([
        {
          content: newMessage,
          user_id: user.id,
          user_email: user.email,
        },
      ]);

      setNewMessage("");
    } catch (error) {
      alert(`메시지 전송 실패: ${error.message}`);
    }
  };

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div style={{ height: "400px", display: "flex", flexDirection: "column" }}>
      <h3>실시간 채팅</h3>

      {/* 메시지 목록 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "8px",
              padding: "5px",
              backgroundColor:
                message.user_id === user.id ? "#e3f2fd" : "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <small>
              <strong>{message.user_email}</strong>
            </small>
            <div>{message.content}</div>
            <small style={{ color: "#666" }}>
              {new Date(message.created_at).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, marginRight: "5px" }}
          placeholder="메시지를 입력하세요..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default RealtimeChat;
```

## 🛠️ **고급 설정**

### **Vite 설정 (vite.config.js)**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@utils": "/utils",
    },
  },
  optimizeDeps: {
    include: ["@supabase/supabase-js"],
  },
});
```

### **Package.json 스크립트**

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.53.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🚨 **자주 발생하는 문제 해결**

### **1. "Invalid API key" 에러**

```javascript
// ❌ 문제: 잘못된 ANON KEY
VITE_SUPABASE_ANON_KEY=wrong-key

// ✅ 해결: Supabase Dashboard → Settings → API에서 정확한 키 복사
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. "Row Level Security policy violation" 에러**

```sql
-- Supabase Dashboard → SQL Editor에서 실행
-- 예시: users 테이블 접근 허용 정책
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
FOR INSERT WITH CHECK (auth.uid() = id);
```

### **3. "Email not confirmed" 에러**

1. **Supabase Dashboard → Authentication → Users** 이동
2. 해당 사용자 찾기
3. **"Confirm user"** 버튼 클릭
4. 또는 **Settings → Authentication → Email** 에서 이메일 확인 비활성화

### **4. CORS 에러 (배포 시)**

1. **Supabase Dashboard → Settings → API** 이동
2. **CORS origins**에 배포 도메인 추가
   ```
   https://your-app.vercel.app
   https://your-domain.com
   ```

### **5. 테이블이 존재하지 않음**

```sql
-- Supabase Dashboard → SQL Editor에서 테이블 생성
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  user_id uuid REFERENCES users(id),
  user_email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 📋 **체크리스트**

### **필수 단계**

- [ ] `npm install @supabase/supabase-js` 설치
- [ ] Supabase 프로젝트 생성
- [ ] `.env` 파일에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 설정
- [ ] config 디렉토리를 프로젝트에 복사
- [ ] 첫 번째 컴포넌트에서 인증 테스트

### **추가 설정 (필요시)**

- [ ] 테이블 생성 및 RLS 정책 설정
- [ ] OAuth 제공자 설정 (구글, 카카오 등)
- [ ] Storage 버킷 생성
- [ ] Realtime 구독 설정
- [ ] 프로덕션 환경 배포 및 도메인 설정

## 🌟 **템플릿 장점**

### **개발 속도 향상**

- ⚡ **5분 설정**: 환경변수 2개만 설정하면 완료
- 🔄 **재사용 가능**: 여러 프로젝트에 동일한 구조 적용
- 📚 **완전한 문서**: 예시 코드와 해결책 포함
- 🎯 **해커톤 최적화**: 10-14일 프로젝트에 최적화

### **프로덕션 수준 품질**

- 🛡️ **자동 에러 처리**: PostgreSQL 에러 → 한국어 메시지
- 🔄 **자동 재시도**: 네트워크 실패 시 지수 백오프
- 🔒 **보안**: JWT 자동 갱신, RLS 정책 지원
- 📊 **모니터링**: 디버그 모드와 상세 로깅

### **팀 협업 친화적**

- 📖 **통일된 패턴**: 모든 팀원이 동일한 API 패턴 사용
- 🚀 **빠른 온보딩**: 새 팀원도 이 가이드로 즉시 시작
- 🔧 **유지보수 용이**: 중앙화된 설정과 에러 처리
