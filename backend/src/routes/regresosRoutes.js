const express = require('express');
const router = express.Router();

const { regresarEquiposAlmacen } = require('../controllers/regresosController');

router.post('/', regresarEquiposAlmacen);

module.exports = router;