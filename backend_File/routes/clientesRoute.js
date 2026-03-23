const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// 1. Obtener todos los clientes (Protegido)
router.get('/clientes', authMiddleware, (req, res) => {
    const sql = 'SELECT Id AS id, Nombre AS nombre, Apellido AS apellido, Correo AS correo, Telefono AS telefono, Direccion AS direccion FROM Clientes';

    pool.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ status: 500, message: 'Error al obtener clientes' });
        }
        return res.status(200).json({ status: 200, message: 'Success', data: results });
    });
});

// 2. Registrar un nuevo cliente (Ahora Protegido con Middleware)
router.post('/registrar/cliente', authMiddleware, (req, res) => {
    const { nombre, apellido, correo, telefono, direccion } = req.body;

    // Validación de campos obligatorios según tu SQL
    if (!nombre || !apellido || !correo) {
        return res.status(400).json({ status: 400, message: 'Nombre, Apellido y Correo son obligatorios' });
    }

    const sql = 'INSERT INTO Clientes (Nombre, Apellido, Correo, Telefono, Direccion) VALUES (?, ?, ?, ?, ?)';

    pool.query(sql, [nombre, apellido, correo, telefono, direccion], (error, results) => {
        if (error) {
            // Manejo de error por correo duplicado (Unique en SQL)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ status: 400, message: 'El correo ya está registrado' });
            }
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL al registrar cliente' });
        }
        return res.status(201).json({ status: 201, message: 'Cliente registrado con éxito', data: { id: results.insertId } });
    });
});

// 3. Registrar una Consulta o Prueba de Manejo (Público)
// Nota: Esta se suele dejar pública para que clientes nuevos puedan contactar sin login
router.post('/registrar/consulta', (req, res) => {
    const { clienteId, vehiculoId, mensaje } = req.body;

    if (!clienteId || !vehiculoId || !mensaje) {
        return res.status(400).json({ status: 400, message: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO Consultas (ClienteId, VehiculoId, Mensaje) VALUES (?, ?, ?)';

    pool.query(sql, [clienteId, vehiculoId, mensaje], (error, results) => {
        if (error) {
            return res.status(500).json({ status: 500, message: 'Error al registrar la consulta' });
        }
        return res.status(201).json({ status: 201, message: 'Consulta enviada correctamente' });
    });
});

// 4. Obtener historial de consultas (Protegido)
router.get('/consultas/cliente/:id', authMiddleware, (req, res) => {
    const clienteId = req.params.id;

    const sql = `
        SELECT 
            c.Id AS consultaId, 
            v.Marca AS marca, 
            v.Modelo AS modelo, 
            c.Mensaje AS mensaje, 
            c.FechaConsulta AS fecha 
        FROM Consultas c
        JOIN Vehiculos v ON c.VehiculoId = v.Id
        WHERE c.ClienteId = ? 
        ORDER BY c.FechaConsulta DESC`;

    pool.query(sql, [clienteId], (error, results) => {
        if (error) {
            return res.status(500).json({ status: 500, message: 'Error al obtener historial' });
        }
        return res.status(200).json({ status: 200, message: 'Success', data: results });
    });
});

// 5. Eliminar un cliente (Protegido con Middleware)
router.delete('/eliminar/cliente/:id', authMiddleware, (req, res) => {
    const id = parseInt(req.params.id);

    const sql = 'DELETE FROM Clientes WHERE Id = ?';

    pool.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Cliente no encontrado' });
        }
        return res.status(200).json({ status: 200, message: 'Cliente eliminado correctamente' });
    });
});

module.exports = router;
