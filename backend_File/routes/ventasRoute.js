const express = require('express');
const pool = require('../config/db');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/ventas', AuthMiddleware, (req, res) => {
    const sql = `SELECT 
                    v.Id AS id_venta, 
                    c.Nombre AS cliente, 
                    ve.Marca AS marca, 
                    ve.Modelo AS modelo, 
                    u.Username AS vendedor, 
                    v.FechaVenta AS fecha_venta, 
                    v.PrecioTotal AS total,
                    v.Impuestos AS impuestos
                 FROM Ventas v
                 INNER JOIN Clientes c ON v.ClienteId = c.Id
                 INNER JOIN Vehiculos ve ON v.VehiculoId = ve.Id
                 INNER JOIN Usuarios u ON v.VendedorId = u.Id
                 ORDER BY v.FechaVenta DESC`;

    pool.query(sql, (error, results) => {
        if (error) {
            console.error('Error SQL detallado:', error.sqlMessage);
            return res.status(500).json({ 
                status: 500, 
                message: 'Error al obtener el listado de ventas',
                error: error.sqlMessage 
            });
        }
        return res.status(200).json({ status: 200, message: 'Success', data: results });
    });
});


router.post('/registrar/ventas', AuthMiddleware, (req, res) => {
    
    const { clienteId, vehiculoId, vendedorId, precioTotal, impuestos } = req.body;

    if (!clienteId || !vehiculoId || !vendedorId || !precioTotal || impuestos === undefined) {
        return res.status(400).json({ status: 400, message: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO Ventas (ClienteId, VehiculoId, VendedorId, PrecioTotal, Impuestos) VALUES (?, ?, ?, ?, ?)';

    pool.query(sql, [clienteId, vehiculoId, vendedorId, precioTotal, impuestos], (error, results) => {
        if (error) {
            console.log(error);
            console.error('Error al insertar venta:', error.sqlMessage);
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
        }

        return res.status(201).json({
            status: 201,
            message: 'Venta registrada correctamente',
            data: { id: results.insertId }
        });
    });
});


router.delete('/ventas/:id', AuthMiddleware, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Ventas WHERE Id = ?';

    pool.query(sql, [id], (error, results) => {
        if (error) return res.status(500).json({ status: 500, message: 'Error al eliminar' });
        if (results.affectedRows === 0) return res.status(404).json({ status: 404, message: 'Venta no encontrada' });
        
        return res.status(200).json({ status: 200, message: 'Venta eliminada exitosamente' });
    });
});

module.exports = router;