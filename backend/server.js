const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos PostgreSQL
// Soporta tanto DATABASE_URL (para Blitz Cloud) como variables individuales (para Docker Compose)
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

// Middleware para verificar JWT y proteger rutas
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado: Debe iniciar sesión' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_fallback', (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: 'Sesión inválida o expirada' });
    }
    req.usuario = usuario;
    next();
  });
};

// Endpoint de Login con consultas parametrizadas
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  try {
    // Consulta parametrizada ($1) para prevenir inyecciones SQL
    const resultado = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = resultado.rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT con payload mínimo
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, nombre: usuario.nombre_completo },
      process.env.JWT_SECRET || 'jwt_secret_fallback',
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      usuario: {
        username: usuario.username,
        nombre: usuario.nombre_completo,
      },
    });
  } catch (error) {
    console.error('Error durante autenticación:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint protegido para obtener datos de bienvenida
app.get('/api/bienvenida', autenticarToken, (req, res) => {
  res.json({
    mensaje: `Bienvenido, ${req.usuario.nombre}`,
    usuario: req.usuario,
  });
});

// Servir la aplicación React compilada en producción
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});