const express = require('express');
const router = express.Router();

const { moverEquipos } = require('../controllers/movimientosController');

router.post('/salida', moverEquipos);

module.exports = router;