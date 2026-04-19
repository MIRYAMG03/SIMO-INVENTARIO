const express = require('express');
const router = express.Router();

const {
    obtenerVentasPorEmpleado,
    obtenerVentasPorDia
} = require('../controllers/graficasController');

router.get('/ventas-empleado', obtenerVentasPorEmpleado);
router.get('/ventas-dia', obtenerVentasPorDia);

module.exports = router;