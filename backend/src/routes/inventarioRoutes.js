const express = require('express');
const router = express.Router();

const { obtenerInventarioGeneral } = require('../controllers/inventarioController');

router.get('/general', obtenerInventarioGeneral);

module.exports = router;