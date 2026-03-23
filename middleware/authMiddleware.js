const jwt = require('jsonwebtoken');

require('dotenv').config();

const AuthMiddleware = (req,res,next) => { 
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({status:401,messgae:'No autorizado, el token es obligatorio...'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRETKEY,(error, user)=>{
        if(error){
            return res.status(401).json({status:401,message:'No autorizado, token invalido..'});
        }
    });

    next();
}

module.exports = AuthMiddleware;