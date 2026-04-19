const express = require('express');
const router = express.Router();

const { obtenerReporteValorizado } = require('../controllers/reportesController');

router.get('/valorizado', obtenerReporteValorizado);

module.exports = router;