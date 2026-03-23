const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const AuthMiddleware = require('../middleware/authMiddleware');

require('dotenv').config();

const router = express.Router();

router.post('/login',(req,res)=>{

    const {username, password} = req.body;

    if(!username || !password){
        return res.status(500).json({status:500,messge:'Error el la consulta sql..'});
    }

    const sql = 'SELECT Username, Password FROM Usuarios WHERE Username = ? AND Estado = 1'

    pool.query(sql,[username, password],async (error,results)=>{
        if(error){
            console.log('EL ERROR REAL ES:', error);
            return res.status(500).json({status:500,messge:'Error el la consulta sql..'});
            
        }

        if(results.length === 0){
            return res.status(401).json({status:401,messge:'Credenciales invalidas..'});
        }

        let user = results[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if(!isMatch){
            return res.status(401).json({status:401,message:'Credenciales invalidas'});
        }

        const token = jwt.sign({username: user.Username},process.env.JWT_SECRETKEY,{expiresIn:'1h'});

        return res.status(200).json({status:200,message:'Inicio de sesion exitoso...', token:token});
    });
});


router.get('/usuarios', AuthMiddleware, (req,res)=>{
    const sql = "select Id as code, username, 'correo@dominio.com' as email FROM  Usuarios";

    pool.query(sql,(error,results)=>{
        if(error){
                return res.status(500).json({status:500, message:'Ocurrio un error en la consulta..'});
        }

        return res.status(200).json({status:200,message:'Success', sta:results});
    });
});

router.get('/gethash/:texto', async (req,res)=>{

    const texto = req.params.texto;

    const SaltRound = 10;
    const hash = await bcrypt.hash(texto,SaltRound);
    
    res.send(hash);
});

//Este metodo es para registrar un usuario nuevo
router.post('/usuario/registro', async (req, res) => {
    const { username, password, email, rol } = req.body;

    if (!username || !password || !email || !rol) {
        return res.status(400).json({ status: 400, message: 'Ocurrio un error en la consulta SQL...' });
    }

    const SaltRound = 10;
    const hash = await bcrypt.hash(password, SaltRound);

    const sql = 'INSERT INTO Usuarios (Username, Password, Correo, Rol, Estado) VALUES(?, ?, ?, ?, 1)';

  
    pool.query(sql, [username, hash, email, rol], (error, results) => {
        
        if (error) {
            return res.status(500).json({status: 500, message: 'No se pudo guardar en la base de datos.' });
        }

        return res.status(201).json({status: 201,message: 'Usuario creado con éxito', data:results});
    });
});

module.exports = router;

