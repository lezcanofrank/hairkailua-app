import React, { useState } from 'react';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const USERNAME = 'lezcanofrank';
  const PASSWORD = 'Francito';

  const handleLogin = () => {
    if (username === USERNAME && password === PASSWORD) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Helvetica Neue, sans-serif',
      backgroundColor: '#f8fafc'
    }}>
      <h2 style={{ marginBottom: 20 }}>Login to Hair Kailua Ticket Logger</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc', width: 250 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc', width: 250 }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          width: 250
        }}
      >
        Login
      </button>
      {error && <p style={{ color: 'crimson', marginTop: 10 }}>{error}</p>}
    </div>
  );
}

export default Login;
