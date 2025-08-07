import { createClient } from "@supabase/supabase-js";
import { env, log } from "../utils/env.js";

// Supabase 환경 변수 검증
if (!env.supabaseUrl || !env.supabaseKey) {
  throw new Error(
    "Supabase URL and Anon Key are required. Please check your environment variables:\n" +
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

// Supabase 클라이언트 생성
export const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce", // PKCE flow for enhanced security
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-client-info": `${env.appName}@${env.appVersion}`,
    },
  },
});

// 개발 모드에서 Auth 상태 변경 로깅
if (env.isDevelopment || env.features.enableDebugMode) {
  supabase.auth.onAuthStateChange((event, session) => {
    log.debug(`[Supabase Auth] ${event}`, {
      userId: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.role,
      timestamp: new Date().toISOString(),
    });
  });
}

// 연결 상태 확인 헬퍼 함수
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from("_supabase_health_check")
      .select("*")
      .limit(1);
    
    if (error && error.code !== "PGRST116") {
      // PGRST116은 테이블이 없을 때 발생하는 정상적인 에러
      throw error;
    }
    
    log.info("[Supabase] Connection successful");
    return true;
  } catch (error) {
    log.error("[Supabase] Connection failed:", error.message);
    return false;
  }
};

// Auth 헬퍼 함수들
export const auth = {
  // 현재 사용자 세션 가져오기
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // 현재 사용자 정보 가져오기
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // 로그인 상태 확인
  async isAuthenticated() {
    const session = await this.getSession();
    return !!session?.access_token;
  },

  // 로그인
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // 회원가입
  async signUp(email, password, options = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });
    if (error) throw error;
    return data;
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 비밀번호 재설정 이메일 전송
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  // OAuth 로그인 (카카오, 구글 등)
  async signInWithOAuth(provider, options = {}) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...options
      }
    });
    if (error) throw error;
    return data;
  }
};

// Database 헬퍼 함수들
export const db = {
  // 테이블에서 데이터 조회
  from(table) {
    return supabase.from(table);
  },

  // RPC 함수 호출
  rpc(functionName, params = {}) {
    return supabase.rpc(functionName, params);
  }
};

// Storage 헬퍼 함수들
export const storage = {
  // 버킷에서 파일 업로드
  async upload(bucket, path, file, options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, options);
    if (error) throw error;
    return data;
  },

  // 파일 다운로드 URL 생성
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // 파일 삭제
  async remove(bucket, paths) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths);
    if (error) throw error;
    return data;
  }
};

// Realtime 구독 헬퍼
export const realtime = {
  // 테이블 변경사항 구독
  subscribe(table, callback, filter = "*") {
    return supabase
      .channel(`public:${table}`)
      .on("postgres_changes", {
        event: filter,
        schema: "public",
        table
      }, callback)
      .subscribe();
  },

  // 구독 해제
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  }
};

// 기본 export (기존 코드와의 호환성)
export default supabase;