const express = require('express');
const axios = require('axios');
const path = require('path');
const AuthMiddleware = require('../middleware/authMiddleware');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const router = express.Router();

router.get('/tipo-cambio', AuthMiddleware, async (req, res) => {
  const apiKey = process.env.EXCHANGE_RATE_KEY;
  const apiBase = process.env.EXCHANGE_RATE_API_BASE_URL;

  if (!apiKey || !apiBase) {
    return res.status(500).json({
      status: 500,
      message: 'Variables de entorno EXCHANGE_RATE_KEY o EXCHANGE_RATE_API_BASE_URL no configuradas.',
    });
  }

  try {
    const url = `${apiBase}${apiKey}/latest/USD`;
    const response = await axios.get(url);

    if (!response.data || !response.data.conversion_rates) {
      return res.status(502).json({
        status: 502,
        message: 'Respuesta inválida de ExchangeRate-API.',
        details: response.data,
      });
    }

    const conversionRates = response.data.conversion_rates;
    const hnlRate = conversionRates.HNL;

    console.log('ExchangeRate API conversion_rates:', conversionRates);

    if (!hnlRate) {
      return res.status(404).json({
        status: 404,
        message: 'Tipo de cambio HNL no disponible en la respuesta de ExchangeRate-API.',
        conversion_rates: conversionRates,
      });
    }

    const formatted = {
      USD: conversionRates.USD || 1,
      HNL: hnlRate,
      EUR: conversionRates.EUR,
      GTQ: conversionRates.GTQ,
      conversion_rates: conversionRates
    };

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error consumo ExchangeRate-API:', error.toString());
    return res.status(502).json({
      status: 502,
      message: 'Error al consumir ExchangeRate-API.',
      details: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;
