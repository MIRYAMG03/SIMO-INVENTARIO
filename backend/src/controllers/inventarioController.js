const db = require('../db/connection');

const obtenerInventarioGeneral = (req, res) => {
    const sql = `
        SELECT 
            imei,
            marca,
            modelo,
            ram,
            rom,
            color,
            tipo,
            proveedor,
            numero_pedido,
            precio,
            estatus,
            ubicacion,
            created_at
        FROM equipos
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("ERROR REAL SQL:", err);
            return res.status(500).json({ error: "Error al obtener inventario" });
        }

        res.json(results);
    });
};

module.exports = { obtenerInventarioGeneral };