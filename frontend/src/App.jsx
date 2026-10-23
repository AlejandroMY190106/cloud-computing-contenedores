import React, { useState, useEffect } from 'react';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Validar sesión si ya existe un token
  useEffect(() => {
    if (token) {
      cargarBienvenida(token);
    }
  }, [token]);

  const cargarBienvenida = async (jwtToken) => {
    try {
      const res = await fetch('/api/bienvenida', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarioInfo(data);
        setError('');
      } else {
        cerrarSesion();
      }
    } catch {
      cerrarSesion();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciales inválidas');
        return;
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsername('');
      setPassword('');
    } catch {
      setError('Error al conectar con el servidor');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken('');
    setUsuarioInfo(null);
  };

  const contenedorEstilo = {
    fontFamily: 'system-ui, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    margin: 0,
  };

  const tarjetaEstilo = {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '380px',
  };

  // Si está autenticado, muestra la página de bienvenida protegida
  if (usuarioInfo) {
    return (
      <div style={contenedorEstilo}>
        <div style={tarjetaEstilo}>
          <h2 style={{ color: '#0f172a' }}>{usuarioInfo.mensaje}</h2>
          <p style={{ color: '#64748b' }}>
            Usuario autenticado: <strong>{usuarioInfo.usuario.username}</strong>
          </p>
          <button
            onClick={cerrarSesion}
            style={{
              width: '100%',
              padding: '0.6rem',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Vista no autenticada: Formulario de inicio de sesión
  return (
    <div style={contenedorEstilo}>
      <div style={tarjetaEstilo}>
        <h2 style={{ textAlign: 'center', color: '#0f172a' }}>Iniciar Sesión</h2>
        {error && (
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.6rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}