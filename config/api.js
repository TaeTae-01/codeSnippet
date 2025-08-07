import { createClient } from "@supabase/supabase-js";
import { API_CONFIG, ERROR_MESSAGES } from "./constants.js";
import { env, log } from "../utils/env.js";

// Supabase 클라이언트 생성
const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Supabase 에러 처리 헬퍼 함수
const handleSupabaseError = (error, operation = "operation") => {
  if (env.features.enableDebugMode) {
    log.error(`Supabase ${operation} error:`, error);
  }

  // Supabase 특정 에러 코드 처리
  switch (error?.code) {
  case "PGRST116":
    throw new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  case "23505":
    throw new Error(ERROR_MESSAGES.DUPLICATE_EMAIL);
  case "invalid_credentials":
    throw new Error(ERROR_MESSAGES.AUTHENTICATION_FAILED);
  case "email_not_confirmed":
    throw new Error("이메일 인증이 필요합니다.");
  case "signup_disabled":
    throw new Error("회원가입이 비활성화되어 있습니다.");
  default:
    throw new Error(error?.message || ERROR_MESSAGES.SERVER);
  }
};

// 재시도 로직을 위한 헬퍼 함수 (Supabase용)
const retrySupabaseOperation = async (operation, retryCount = 0) => {
  try {
    return await operation();
  } catch (error) {
    if (retryCount >= API_CONFIG.RETRY_COUNT) {
      throw error;
    }

    // 네트워크 에러나 서버 에러인 경우에만 재시도
    if (error.message?.includes("network") || error.message?.includes("fetch")) {
      await new Promise((resolve) => 
        setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
      );
      return retrySupabaseOperation(operation, retryCount + 1);
    }

    throw error;
  }
};

// 세션 관리 헬퍼
const sessionManager = {
  // 현재 세션 가져오기
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) handleSupabaseError(error, "get session");
      return session;
    } catch (error) {
      handleSupabaseError(error, "get session");
    }
  },

  // 세션 새로고침
  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) handleSupabaseError(error, "refresh session");
      return session;
    } catch (error) {
      handleSupabaseError(error, "refresh session");
    }
  },

  // 인증 상태 확인
  async isAuthenticated() {
    const session = await this.getSession();
    return !!session?.access_token;
  },

  // 사용자 정보 가져오기
  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) handleSupabaseError(error, "get user");
      return user;
    } catch (error) {
      handleSupabaseError(error, "get user");
    }
  }
};

// 인증 상태 변경 리스너 설정
supabase.auth.onAuthStateChange(async (event, session) => {
  if (env.features.enableDebugMode) {
    log.debug(`Auth state changed: ${event}`, session?.user?.email);
  }

  switch (event) {
  case "SIGNED_IN":
    if (env.features.enableDebugMode) {
      log.debug("User signed in:", session?.user?.email);
    }
    break;
  case "SIGNED_OUT":
    if (env.features.enableDebugMode) {
      log.debug("User signed out");
    }
    break;
  case "TOKEN_REFRESHED":
    if (env.features.enableDebugMode) {
      log.debug("Token refreshed");
    }
    break;
  case "USER_UPDATED":
    if (env.features.enableDebugMode) {
      log.debug("User updated");
    }
    break;
  }
});

// API 클라이언트 래퍼 (기존 코드와의 호환성 유지)
const apiClient = {
  // 인증 관련 메서드
  auth: {
    async signUp(email, password, options = {}) {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options
        });
        if (error) handleSupabaseError(error, "sign up");
        return data;
      });
    },

    async signIn(email, password) {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) handleSupabaseError(error, "sign in");
        return data;
      });
    },

    async signOut() {
      return retrySupabaseOperation(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) handleSupabaseError(error, "sign out");
      });
    },

    async resetPassword(email) {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) handleSupabaseError(error, "reset password");
        return data;
      });
    }
  },

  // 데이터베이스 작업
  from: (table) => ({
    async select(columns = "*") {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.from(table).select(columns);
        if (error) handleSupabaseError(error, `select from ${table}`);
        return data;
      });
    },

    async insert(values) {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.from(table).insert(values).select();
        if (error) handleSupabaseError(error, `insert into ${table}`);
        return data;
      });
    },

    async update(values) {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.from(table).update(values).select();
        if (error) handleSupabaseError(error, `update ${table}`);
        return data;
      });
    },

    async delete() {
      return retrySupabaseOperation(async () => {
        const { data, error } = await supabase.from(table).delete().select();
        if (error) handleSupabaseError(error, `delete from ${table}`);
        return data;
      });
    }
  }),

  // RPC 함수 호출
  async rpc(functionName, params = {}) {
    return retrySupabaseOperation(async () => {
      const { data, error } = await supabase.rpc(functionName, params);
      if (error) handleSupabaseError(error, `RPC ${functionName}`);
      return data;
    });
  },

  // 세션 관리
  session: sessionManager,

  // 원본 Supabase 클라이언트 접근
  _supabase: supabase
};

export default apiClient;