CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Usuarios de prueba con contraseñas hasheadas mediante bcrypt (costo 10)
-- Usuario 1: admin / Password: AdminPass123!
-- Usuario 2: joel / Password: UserPass123!
INSERT INTO usuarios (username, nombre_completo, password_hash)
VALUES (
        'admin',
        'Administrador del Sistema',
        '$2b$10$3m2h6tq3gA.lvUbHV/Nm/.xHX9wMbB2UNWiXouEuL5MN3nOOPFwli'
    ),
    (
        'joel',
        'Joel Mendoza',
        '$2b$10$jK/3YEjtWSctrG5Ik2sBOeEFUt16lgp/CcI4AVtCHJor9YXVvzu8.'
    ) ON CONFLICT (username) DO NOTHING;