const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
require('dotenv').config();

const app = express();


const authRoute = require('./routes/authRoute');
const vehiculosRoute = require('./routes/vehiculosRoute');
const thirdpartyRoute = require('./routes/thirdpartyRoute');
const ventasRoute = require('./routes/ventasRoute');
const clientesRoute = require('./routes/clientesRoute');

app.use(express.json());
app.use(cors());

app.use('/api/', authRoute);
app.use('/api/', vehiculosRoute);
app.use('/api/', thirdpartyRoute);
app.use('/api/', ventasRoute); 
app.use('/api/', clientesRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});