const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();


const authRoute = require('./routes/authRoute');
const vehiculosRoute = require('./routes/vehiculosRoute');
const pool = require('./config/db');

require('dotenv').config();

const PORT = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRETKEY;

app.use(express.json());
app.use(cors());


app.use('/api/', authRoute);
app.use('/api/',vehiculosRoute)



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});