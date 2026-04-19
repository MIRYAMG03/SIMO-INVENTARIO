const db = require('../db/connection');

const obtenerInventarioPorSucursal = (req, res) => {
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
        WHERE ubicacion IS NOT NULL
        ORDER BY ubicacion ASC, created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener inventario por sucursal:", err);
            return res.status(500).json({ error: "Error al obtener inventario por sucursal" });
        }

        res.json(results);
    });
};

module.exports = { obtenerInventarioPorSucursal };