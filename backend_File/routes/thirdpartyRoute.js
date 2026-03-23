const express = require('express');
const axios = require('axios');
const AuthMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

router.get('/thirdparty/products', AuthMiddleware, async (req, res) => {
  const baseUrl = process.env.THIRD_PARTY_API_BASE_URL;

  if (!baseUrl) {
    return res.status(500).json({ status: 500, message: 'Variable de entorno THIRD_PARTY_API_BASE_URL no configurada.' });
  }

  try {
    const response = await axios.get(baseUrl);
    return res.status(200).json({ status: 200, data: response.data });
  } catch (error) {
    console.error('Error consumo API de terceros:', error.toString());
    return res.status(502).json({
      status: 502,
      message: 'Error al consumir API de terceros.',
      details: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;
