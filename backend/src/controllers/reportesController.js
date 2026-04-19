const db = require('../db/connection');

const obtenerReporteValorizado = (req, res) => {
    const sql = `
        SELECT
            ubicacion,
            COUNT(*) AS total_equipos,
            IFNULL(SUM(precio), 0) AS valor_inventario
        FROM equipos
        WHERE estatus <> 'vendido'
        GROUP BY ubicacion
        ORDER BY ubicacion ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener reporte valorizado:", err);
            return res.status(500).json({ error: "Error al obtener reporte valorizado" });
        }

        res.json(results);
    });
};

module.exports = { obtenerReporteValorizado };