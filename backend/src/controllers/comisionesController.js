const db = require('../db/connection');

const obtenerReporteComisiones = (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    let sql = `
        SELECT
            id,
            imei,
            marca,
            modelo,
            empleado,
            precio_venta,
            comision_venta,
            fecha_venta
        FROM equipos
        WHERE estatus = 'vendido'
          AND empleado IS NOT NULL
    `;

    const params = [];

    if (fechaInicio && fechaFin) {
        sql += " AND DATE(fecha_venta) BETWEEN ? AND ?";
        params.push(fechaInicio, fechaFin);
    } else if (fechaInicio) {
        sql += " AND DATE(fecha_venta) >= ?";
        params.push(fechaInicio);
    } else if (fechaFin) {
        sql += " AND DATE(fecha_venta) <= ?";
        params.push(fechaFin);
    }

    sql += " ORDER BY empleado ASC, fecha_venta DESC";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error reporte comisiones:", err);
            return res.status(500).json({ error: "Error al obtener reporte de comisiones" });
        }

        res.json(results);
    });
};

module.exports = { obtenerReporteComisiones };