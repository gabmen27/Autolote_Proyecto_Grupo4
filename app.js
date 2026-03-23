const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const ventasRoute = require('./routes/ventasRoute');

app.use('/api/', ventasRoute);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});