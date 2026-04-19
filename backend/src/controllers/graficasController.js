const db = require('../db/connection');

const obtenerVentasPorEmpleado = (req, res) => {
    const sql = `
        SELECT 
            empleado,
            COUNT(*) AS total_equipos,
            IFNULL(SUM(precio_venta), 0) AS total_vendido
        FROM equipos
        WHERE estatus = 'vendido'
          AND empleado IS NOT NULL
        GROUP BY empleado
        ORDER BY total_vendido DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener gráfica de ventas por empleado:", err);
            return res.status(500).json({ error: "Error al obtener gráfica de ventas por empleado" });
        }

        res.json(results);
    });
};

const obtenerVentasPorDia = (req, res) => {
    const sql = `
        SELECT 
            DATE(fecha_venta) AS fecha,
            IFNULL(SUM(precio_venta), 0) AS total_vendido
        FROM equipos
        WHERE estatus = 'vendido'
          AND fecha_venta IS NOT NULL
        GROUP BY DATE(fecha_venta)
        ORDER BY fecha ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener gráfica de ventas por día:", err);
            return res.status(500).json({ error: "Error al obtener gráfica de ventas por día" });
        }

        res.json(results);
    });
};

module.exports = {
    obtenerVentasPorEmpleado,
    obtenerVentasPorDia
};