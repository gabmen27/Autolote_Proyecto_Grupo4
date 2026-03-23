const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(403).json({ status: 403, message: 'Correo y contraseña son requeridos..' });
    }

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';

    pool.query(sql, [correo], async (error, results) => {
        if (error) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL..' });
        }

        if (results.length === 0) {
            return res.status(401).json({ status: 401, message: 'Credenciales invalidas..' });
        }

        let user = results[0];

        const isMatch = password === user.password_hash;

        if (!isMatch) {
            return res.status(401).json({ status: 401, message: 'Credenciales invalidas..' });
        }

        const token = jwt.sign(
            { id_usuario: user.id_usuario, correo: user.correo, rol: user.rol },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            status: 200,
            message: 'Inicio de sesión exitoso..',
            token: token
        });
    });
});

module.exports = router;