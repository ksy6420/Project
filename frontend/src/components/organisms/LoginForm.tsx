import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'start',
            gap: '0.65rem',
            color: '#FCA5A5',
            fontSize: '0.75rem',
            textAlign: 'left',
          }}
        >
          <AlertCircle
            size={16}
            style={{ color: '#EF4444', flexShrink: 0, marginTop: '0.1rem' }}
          />
          <span>{error}</span>
        </div>
      )}

      <InputField
        label="이메일 주소"
        icon={Mail}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        required
      />

      <InputField
        label="비밀번호"
        icon={Lock}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <div className="login-utility-row">
        <label className="login-remember-me">
          <input type="checkbox" />
          <span>로그인 유지</span>
        </label>
        <a href="#forgot" className="login-forgot-link">
          비밀번호를 잊으셨나요?
        </a>
      </div>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? '인증 처리 중...' : '로그인'}
      </Button>
    </form>
  );
}
