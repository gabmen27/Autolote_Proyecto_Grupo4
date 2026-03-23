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

router.post('/registrar/vehiculo', authMiddleware, (res,req)=>{

    const {marca,modelo,anio,precio,disponibilidad} = req.body;

    if (!marca || !modelo || !anio || precio==undefined || !disponibilidad) {
       return res.status(400).json({status:400,message:'Todos los campos son obligatorios...'});
    }
      if (producto.precio_compra<=0) {
    return res.status(400).json({ status: 400, message: "El precio debe ser mayor a 0" });
  }

    const sql = 'ISERT INTO Vehiculos (Marca, Modelo, Anio, Precio, Disponibilidad) VALUES(?,?,?,?,?)'

    pool.query(sql,[marca,modelo,anio,precio,disponibilidad],(error,results)=>{

        if(error){
            return res.status(500).json({status:500, message:'Error en la consulta SQL...'});
        }

        return res.status(201).json(status:201,message:'Vehiculo agregado al inventario');
    });
})

router.put('/modificar/vehiculo/:id',authMiddleware, (res,req)=>{
    
});

module.exports = router;