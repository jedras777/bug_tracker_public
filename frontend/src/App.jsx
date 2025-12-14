// src/App.jsx
import { useState } from 'react';
import { apiRequest } from './api/client';
import { IssuesView } from './components/IssuesView';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken') || null
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest('/api/token/', {
        method: 'POST',
        body: { username, password },
      });

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setAccessToken(data.access);
      setPassword('');
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        setError('Nieprawidłowy login lub hasło');
      } else {
        setError('Coś poszło nie tak. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
  }

  const loginFieldStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    boxSizing: 'border-box',
    display: 'block',
  };

  // === EKRAN LOGOWANIA ===
  if (!accessToken) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffe0d5',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px 28px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
            boxSizing: 'border-box',
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: '8px',
              fontSize: '32px',
              fontWeight: 700,
            }}
          >
            Bug Tracker
          </h1>
          <p
            style={{
              marginTop: 0,
              marginBottom: '24px',
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            Zaloguj się, aby zarządzać projektami i zgłoszeniami.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 4,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                style={loginFieldStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 4,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={loginFieldStyle}
              />
            </div>

            {error && (
              <div
                style={{
                  color: '#b91c1c',
                  backgroundColor: '#fee2e2',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '14px',
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                boxShadow: '0 8px 18px rgba(37,99,235,0.45)',
              }}
            >
              {loading ? 'Logowanie...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === WIDOK PO ZALOGOWANIU ===
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffe0d5',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto', // -> centrum
          backgroundColor: '#f3f4f6',
          borderRadius: '20px',
          padding: '24px 28px 32px',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
            Bug Tracker
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: '1px solid #2563eb',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </header>

        <IssuesView />
      </div>
    </div>
  );
}

export default App;
