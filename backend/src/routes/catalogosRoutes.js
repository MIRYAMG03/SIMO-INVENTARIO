const express = require('express');
const router = express.Router();

const {
    obtenerMarcas,
    agregarMarca,
    obtenerModelos,
    obtenerTodosLosModelos,
    agregarModelo,
    obtenerProveedores,
    agregarProveedor
} = require('../controllers/catalogosController');

// MARCAS
router.get('/marcas', obtenerMarcas);
router.post('/marcas', agregarMarca);

// MODELOS
router.get('/modelos', obtenerTodosLosModelos);
router.get('/modelos/:marcaId', obtenerModelos);
router.post('/modelos', agregarModelo);

// PROVEEDORES
router.get('/proveedores', obtenerProveedores);
router.post('/proveedores', agregarProveedor);

module.exports = router;