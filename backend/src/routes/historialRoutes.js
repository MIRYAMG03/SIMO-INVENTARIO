const express = require('express');
const router = express.Router();

const { obtenerHistorialPorIMEI } = require('../controllers/historialController');

router.get('/:imei', obtenerHistorialPorIMEI);

module.exports = router;