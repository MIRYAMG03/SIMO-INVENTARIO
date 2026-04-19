const express = require('express');
const router = express.Router();

const { registrarLote } = require('../controllers/equiposController');

// ✅ ESTA LÍNEA ES LA QUE TE FALTA
router.post('/lote', registrarLote);

// 🔍 Validar IMEI
router.get('/validar/:imei', (req, res) => {
    const db = require('../db/connection');
    const { imei } = req.params;

    db.query(
        "SELECT * FROM equipos WHERE imei = ? AND ubicacion = 'almacen'",
        [imei],
        (err, results) => {
            if (err) return res.status(500).send("Error BD");

            if (results.length === 0) {
                return res.json({ valido: false });
            }

            res.json({ valido: true });
        }
    );
});

module.exports = router;