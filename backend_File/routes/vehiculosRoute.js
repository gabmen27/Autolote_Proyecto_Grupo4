const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/vehiculos',(req,res)=>{

    const sql = 'SELECT * From Vehiculos';

    pool.query(sql,(error,results)=>{

        if(error){
            return res.status(500).json({status:500, message:'Error en la consulta SQL...'});
        }

        return res.status(200).json({status:200, message: 'Success', data:results});
    });
});

router.get('/filtrar/marca/:marca', (req, res) => {
    const marca = req.params.marca;
    const sql = 'SELECT * FROM Vehiculos WHERE Marca = ?';

    pool.query(sql, [marca], (error, results) => {
        if (error) return res.status(500).json({ status: 500, message: 'Error en la consulta' });
        res.status(200).json({ status: 200, data: results });
    });
});

router.get('/filtrar/estado/:estado', (req, res) => {
    const estado = req.params.estado;
    const sql = 'SELECT * FROM Vehiculos WHERE Disponibilidad = ?';

    pool.query(sql, [estado], (error, results) => {
        if (error) return res.status(500).json({ status: 500, message: 'Error en la consulta' });
        res.status(200).json({ status: 200, data: results });
    });
});

router.get('/filtrar/precio/:preciomax', (req, res) => {
    const precioMax = parseFloat(req.params.preciomax);

    
    if (isNaN(precioMax)) {
        return res.status(400).json({ status: 400, message: 'El precio debe ser un número válido' });
    }

    const sql = 'SELECT * FROM Vehiculos WHERE Precio <= ? ORDER BY Precio';

    pool.query(sql, [precioMax], (error, results) => {
        if (error) {
            return res.status(500).json({ status: 500, message: 'Error al filtrar por precio' });
        }
        
        res.status(200).json({
            status: 200,
            resultados: results.length,
            data: results
        });
    });
});

router.post('/registrar/vehiculo', authMiddleware, (req,res)=>{

    const {marca,modelo,anio,precio,disponibilidad} = req.body;

    if (!marca || !modelo || !anio || precio==undefined || !disponibilidad) {
       return res.status(400).json({status:400,message:'Todos los campos son obligatorios...'});
    }
    if (precio<=0) {
        return res.status(400).json({ status: 400, message: "El precio debe ser mayor a 0" });
    }

    const sql = 'INSERT INTO Vehiculos (Marca, Modelo, Anio, Precio, Disponibilidad) VALUES(?,?,?,?,?)'

    pool.query(sql,[marca,modelo,anio,precio,disponibilidad],(error,results)=>{

        if(error){
            return res.status(500).json({status:500, message:'Error en la consulta SQL...'});
        }

        return res.status(201).json({status:201,message:'Vehiculo agregado al inventario'});
    });
});

router.put('/modificar/vehiculo/:id',authMiddleware, (req,res)=>{
    const id = parseInt(req.params.id);
    const {marca,modelo,anio,precio,disponibilidad} = req.body;

    if (!marca || !modelo || !anio || precio==undefined || !disponibilidad) {
       return res.status(400).json({status:400,message:'Todos los campos son obligatorios...'});
    }
    if (precio<=0) {
        return res.status(400).json({ status: 400, message: "El precio debe ser mayor a 0" });
    }

  const sql = `UPDATE Vehiculos SET 
                Marca = ?, 
                Modelo = ?, 
                Anio = ?, 
                Precio = ?, 
                Disponibilidad = ? 
                WHERE Id = ?`;

    pool.query(sql,[marca,modelo,anio,precio,disponibilidad,id],(error,results)=>{

        if(error){
            return res.status(500).json({status:500, message:'Error en la consulta SQL...'});
        }

        if(results.affectedRows === 0){
            return res.status(400).json({status:400,message:'No se encontro nungun vehiculo con ese ID...'})
        }

        return res.status(200).json({status:200, message:'Vehiculo actualizado...' })
    });
});

router.delete('/eliminar/vehiculo/:id',(req,res)=>{
     const id = parseInt(req.params.id);

    const sql = 'DELETE From Vehiculos WHERE Id=?';

    pool.query(sql,[id],(error,results)=>{

         if (error) {
            return res.status(500).json({ status: 500, message: "Error en la consulta SQL..." });
         } else if (results.affectedRows === 0) {
           return res.status(404).json({ status: 400, message: "Producto no encontrado..." });
         } else {
           return res.status(200).json({ status: 200, message: "Producto eliminado exitosamente" });
         }

    });
});

module.exports = router;