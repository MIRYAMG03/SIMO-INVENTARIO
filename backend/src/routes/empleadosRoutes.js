const express = require('express');
const router = express.Router();

const { obtenerEmpleados } = require('../controllers/empleadosController');

router.get('/', obtenerEmpleados);

module.exports = router;