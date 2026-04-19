const express = require('express');
const router = express.Router();

const { obtenerInventarioPorSucursal } = require('../controllers/inventarioSucursalController');

router.get('/sucursal', obtenerInventarioPorSucursal);

module.exports = router;