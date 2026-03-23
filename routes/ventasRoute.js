const express = require('express');
const pool = require('../config/db');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET - Listar todas las ventas
router.get('/ventas', AuthMiddleware, (req, res) => {
    const sql = `SELECT v.id_venta, c.nombre AS cliente, ve.marca, ve.modelo, u.nombre AS vendedor, v.fecha_venta, v.total
                 FROM ventas v
                 INNER JOIN clientes c ON v.id_cliente = c.id_cliente
                 INNER JOIN vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
                 INNER JOIN usuarios u ON v.id_vendedor = u.id_usuario`;

    pool.query(sql, (error, results) => {
        if (error) {
            console.log('Existe un error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL..' });
        }

        return res.status(200).json({ status: 200, message: 'Success', data: results });
    });
});

// GET - Obtener una venta por ID
router.get('/ventas/:id', AuthMiddleware, (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM ventas WHERE id_venta = ?';

    pool.query(sql, [id], (error, results) => {
        if (error) {
            console.log('Existe un error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL..' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 404, message: 'Venta no encontrada..' });
        }

        return res.status(200).json({ status: 200, message: 'Success', data: results });
    });
});

// POST - Crear venta
router.post('/ventas', AuthMiddleware, (req, res) => {
    const venta = req.body;

    if (!venta.id_cliente || !venta.id_vehiculo || !venta.id_vendedor || !venta.fecha_venta || !venta.total) {
        return res.status(400).json({ status: 400, message: 'Todos los campos son obligatorios..' });
    }

    const sql = 'INSERT INTO ventas (id_cliente, id_vehiculo, id_vendedor, fecha_venta, total) VALUES (?, ?, ?, ?, ?)';

    pool.query(sql, [venta.id_cliente, venta.id_vehiculo, venta.id_vendedor, venta.fecha_venta, venta.total], (error, results) => {
        if (error) {
            console.log('Existe un error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL..' });
        }

        venta.id_venta = results.insertId;

        return res.status(200).json({
            status: 200,
            message: 'Venta registrada correctamente..',
            data: venta
        });
    });
});

// PUT - Actualizar venta
router.put('/ventas/:id', AuthMiddleware, (req, res) => {
    const id = req.params.id;
    const venta = req.body;

    if (!venta.id_cliente || !venta.id_vehiculo || !venta.id_vendedor || !venta.fecha_venta || !venta.total) {
        return res.status(400).json({ status: 400, message: 'Todos los campos son obligatorios..' });
    }

    const sql = 'UPDATE ventas SET id_cliente = ?, id_vehiculo = ?, id_vendedor = ?, fecha_venta = ?, total = ? WHERE id_venta = ?';

    pool.query(sql, [venta.id_cliente, venta.id_vehiculo, venta.id_vendedor, venta.fecha_venta, venta.total, id], (error, results) => {
        if (error) {
            console.log('Existe un error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL..' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Venta no encontrada..' });
        }

        return res.status(200).json({ status: 200, message: 'Venta actualizada correctamente..' });
    });
});

// DELETE - Eliminar venta
router.delete('/ventas/:id', AuthMiddleware, (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM ventas WHERE id_venta = ?';

    pool.query(sql, [id], (error, results) => {
        if (error) {
            console.log('Existe un error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL..' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Venta no encontrada..' });
        }

        return res.status(200).json({ status: 200, message: 'Venta eliminada correctamente..' });
    });
});

module.exports = router;