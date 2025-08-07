// 앱 전역 설정
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || "My App",
  VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true",
  ENV: import.meta.env.MODE,
  // Supabase 설정
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Supabase 세션 스토리지 키 (자동 관리됨)
export const STORAGE_KEYS = {
  // Supabase는 세션을 자동으로 관리하므로 직접 토큰 저장 불필요
  // 하지만 앱별 설정 저장용으로 사용 가능
  USER_PREFERENCES: "supabase.user.preferences",
  APP_SETTINGS: "supabase.app.settings",
  THEME: "supabase.app.theme",
  LANGUAGE: "supabase.app.language",
  // Supabase Auth 내부적으로 사용하는 키들 (참고용)
  // SUPABASE_AUTH_TOKEN: "supabase.auth.token", // 자동 관리됨
  // SUPABASE_AUTH_EXPIRES: "supabase.auth.expires", // 자동 관리됨
};

// Supabase 클라이언트 설정
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  // Supabase 특정 설정
  AUTH: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce", // PKCE 플로우 사용 (보안 강화)
  },
  REALTIME: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // 데이터베이스 쿼리 기본 설정
  DB: {
    schema: "public",
    table: {
      defaultSelect: "*",
      defaultLimit: 100,
    },
  },
};

// Supabase 테이블 및 함수 참조
// REST API 엔드포인트 대신 Supabase 메서드 사용
export const SUPABASE_REFERENCES = {
  // 테이블 이름
  TABLES: {
    USERS: "users",
    PROFILES: "profiles",
    POSTS: "posts",
    COMMENTS: "comments",
    // 필요에 따라 테이블 추가
  },
  
  // RPC 함수 (PostgreSQL 함수)
  RPC_FUNCTIONS: {
    GET_USER_PROFILE: "get_user_profile",
    UPDATE_USER_PROFILE: "update_user_profile",
    GET_USER_POSTS: "get_user_posts",
    // 커스텀 함수들 정의
  },
  
  // Auth 관련 (Supabase Auth 내장 메서드 사용)
  AUTH_METHODS: {
    SIGN_UP: "signUp",
    SIGN_IN: "signInWithPassword",
    SIGN_OUT: "signOut",
    RESET_PASSWORD: "resetPasswordForEmail",
    UPDATE_USER: "updateUser",
    GET_USER: "getUser",
    GET_SESSION: "getSession",
    REFRESH_SESSION: "refreshSession",
  },
  
  // 스토리지 버킷
  STORAGE_BUCKETS: {
    AVATARS: "avatars",
    DOCUMENTS: "documents",
    IMAGES: "images",
  },
};

// Supabase 에러 메시지
export const ERROR_MESSAGES = {
  // Supabase Auth 에러
  AUTHENTICATION_FAILED: "인증에 실패했습니다.",
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 잘못되었습니다.",
  EMAIL_NOT_CONFIRMED: "이메일 인증이 필요합니다.",
  EMAIL_ALREADY_CONFIRMED: "이미 인증된 이메일입니다.",
  EMAIL_ALREADY_REGISTERED: "이미 등록된 이메일입니다.",
  WEAK_PASSWORD: "비밀번호가 너무 약합니다. 6자 이상 입력해주세요.",
  PASSWORD_NOT_MATCH: "비밀번호가 일치하지 않습니다.",
  SIGNUP_DISABLED: "회원가입이 비활성화되어 있습니다.",
  EMAIL_RATE_LIMIT_EXCEEDED: "이메일 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
  
  // Supabase Database 에러 (PostgreSQL)
  RESOURCE_NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  DUPLICATE_KEY: "중복된 데이터입니다.",
  FOREIGN_KEY_VIOLATION: "참조 무결성 제약 위반입니다.",
  CHECK_VIOLATION: "데이터 검증 제약 위반입니다.",
  NOT_NULL_VIOLATION: "필수 값이 누락되었습니다.",
  
  // Supabase API 에러
  API_KEY_INVALID: "잘못된 API 키입니다.",
  SERVICE_UNAVAILABLE: "서비스를 사용할 수 없습니다.",
  RATE_LIMIT_EXCEEDED: "요청 한도를 초과했습니다.",
  
  // 네트워크 및 일반 에러
  NETWORK: "네트워크 연결을 확인해주세요.",
  SERVER: "서버 오류가 발생했습니다.",
  VALIDATION: "입력값을 확인해주세요.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  
  // RLS (Row Level Security) 에러
  RLS_POLICY_VIOLATION: "데이터 접근 권한이 없습니다.",
  
  // Storage 에러
  STORAGE_FILE_NOT_FOUND: "파일을 찾을 수 없습니다.",
  STORAGE_QUOTA_EXCEEDED: "저장 용량을 초과했습니다.",
  STORAGE_INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다.",
  
  // 기존 호환성 유지
  DUPLICATE_EMAIL: "이미 사용 중인 이메일입니다.",
  LOGIN_FAILED: "로그인에 실패했습니다.",
  LOGOUT_FAILED: "로그아웃 중 오류가 발생했습니다.",
  USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
};

// Supabase 응답 상태 (HTTP 기반이지만 Supabase 특화)
export const SUPABASE_STATUS = {
  // 성공 상태
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // 클라이언트 에러
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 서버 에러
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Supabase 에러 코드 매핑
export const SUPABASE_ERROR_CODES = {
  // PostgreSQL 에러 코드
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  CHECK_VIOLATION: "23514",
  NOT_NULL_VIOLATION: "23502",
  
  // Supabase Auth 에러 코드
  INVALID_CREDENTIALS: "invalid_credentials",
  EMAIL_NOT_CONFIRMED: "email_not_confirmed",
  SIGNUP_DISABLED: "signup_disabled",
  WEAK_PASSWORD: "weak_password",
  
  // PostgREST 에러 코드
  PGRST_NO_ROWS: "PGRST116",
  PGRST_AMBIGUOUS: "PGRST200",
  PGRST_INVALID_RANGE: "PGRST103",
};

// Realtime 이벤트 타입
export const REALTIME_EVENTS = {
  INSERT: "INSERT",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ALL: "*",
};

// Auth 이벤트 타입
export const AUTH_EVENTS = {
  SIGNED_IN: "SIGNED_IN",
  SIGNED_OUT: "SIGNED_OUT",
  TOKEN_REFRESHED: "TOKEN_REFRESHED",
  USER_UPDATED: "USER_UPDATED",
  PASSWORD_RECOVERY: "PASSWORD_RECOVERY",
};