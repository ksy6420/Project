import { LoginForm } from '../components/organisms/LoginForm';

export function LoginPage() {
  return (
    <div className="login-wrapper min-height-screen bg-[#0B0F19]">
      <div className="ambient-glow" />

      <div className="login-container">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '1.875rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.05em',
              }}
            >
              AbsueIPDB
            </span>
          </div>
        </div>

        <LoginForm />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            alignItems: 'center',
            margin: '1.5rem 0',
          }}
        >
          <div style={{ flexGrow: 1, borderTop: '1px solid #1F2937' }} />
        </div>
      </div>
    </div>
  );
}
