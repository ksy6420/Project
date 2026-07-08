import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
export interface User {
  userId: string;
  userName: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = 'http://localhost:3000/api/v2'; // API 서버의 기본 URL

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        throw new Error('리프레시 세션 만료');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
    } catch {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }, []);

  // 1. 앱 기동(마운트) 즉시 실행되는 Silent Refresh (세션 유지 보장)
  useEffect(() => {
    const restoreSession = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (!storedRefreshToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        });

        if (!response.ok) {
          throw new Error('리프레시 세션 만료');
        }

        const data = await response.json();

        setAccessToken(data.accessToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // 4분마다 silent refresh로 accessToken 갱신
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(refreshAccessToken, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, refreshAccessToken]);

  // 2. 백엔드 API 서버를 타겟으로 실 데이터 연동 및 토큰 세트 저장
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '인증 정보가 올바르지 않습니다.');
        }

        // 인가용 엑세스 토큰은 리액트에 안전히 탑재
        setAccessToken(data.accessToken);

        // 갱신용 리프레시 토큰은 로컬스토리지에 안전히 영구화
        localStorage.setItem('refreshToken', data.refreshToken);

        const loggedInUser: User = {
          userId: data.user.userId,
          userName: data.user.userName,
          email: email,
      avatarUrl: undefined,
        };

        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '인증 처리에 실패했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 3. 로그아웃 API 연동 및 브라우저 자격증명 영구 파괴
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (user?.userId) {
        // 백엔드의 세션 무력화 API 호출
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.userId }),
        });
      }
    } catch (err) {
      console.error('[Backend Logout Communication Error]:', err);
    } finally {
      // API 연결 실패 여부와 무관하게 사용자 브라우저의 인증은 무조건 즉각 초기화 (UX 방어 정책)
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setLoading(false);
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, accessToken, loading, error, login, logout }),
    [user, accessToken, loading, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
