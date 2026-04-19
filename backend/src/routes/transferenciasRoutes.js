const express = require('express');
const router = express.Router();

const { transferirEquipos } = require('../controllers/transferenciasController');

router.post('/', transferirEquipos);

module.exports = router;