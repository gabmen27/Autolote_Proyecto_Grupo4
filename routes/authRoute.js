const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const AuthMiddleware = require('../middleware/authMiddleware');

require('dotenv').config();

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: 'Username y password son requeridos..'
        });
    }

    const sql = 'SELECT Username, Password FROM Usuarios WHERE Username = ? AND Estado = 1';

    pool.query(sql, [username], async (error, results) => {
        if (error) {
            console.log('EL ERROR REAL ES:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL..'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                status: 401,
                message: 'Credenciales invalidas..'
            });
        }

        let user = results[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: 'Credenciales invalidas..'
            });
        }

        const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRETKEY;

        const token = jwt.sign(
            { username: user.Username },
            secretKey,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            status: 200,
            message: 'Inicio de sesion exitoso..',
            token: token
        });
    });
});

router.get('/usuarios', AuthMiddleware, (req, res) => {
    const sql = "SELECT Id as code, Username as username, 'correo@dominio.com' as email FROM Usuarios";

    pool.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({
                status: 500,
                message: 'Ocurrio un error en la consulta..'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: results
        });
    });
});

router.get('/gethash/:texto', async (req, res) => {
    const texto = req.params.texto;
    const SaltRound = 10;
    const hash = await bcrypt.hash(texto, SaltRound);

    res.send(hash);
});

router.post('/usuario/registro', async (req, res) => {
    const { username, password, email, rol } = req.body;

    if (!username || !password || !email || !rol) {
        return res.status(400).json({
            status: 400,
            message: 'Todos los campos son obligatorios..'
        });
    }

    const SaltRound = 10;
    const hash = await bcrypt.hash(password, SaltRound);

    const sql = 'INSERT INTO Usuarios (Username, Password, Correo, Rol, Estado) VALUES (?, ?, ?, ?, 1)';

    pool.query(sql, [username, hash, email, rol], (error, results) => {
        if (error) {
            return res.status(500).json({
                status: 500,
                message: 'No se pudo guardar en la base de datos..'
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Usuario creado con exito..',
            data: results
        });
    });
});

module.exports = router;