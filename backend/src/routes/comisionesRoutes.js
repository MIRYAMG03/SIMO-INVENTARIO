const express = require('express');
const router = express.Router();

const { obtenerReporteComisiones } = require('../controllers/comisionesController');

router.get('/', obtenerReporteComisiones);

module.exports = router;