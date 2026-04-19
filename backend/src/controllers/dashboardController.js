const db = require('../db/connection');

const obtenerDashboard = (req, res) => {
    const queries = {
        totalEquipos: "SELECT COUNT(*) AS total FROM equipos",
        enAlmacen: "SELECT COUNT(*) AS total FROM equipos WHERE ubicacion = 'almacen'",
        enSucursales: "SELECT COUNT(*) AS total FROM equipos WHERE ubicacion <> 'almacen' AND ubicacion <> 'vendido'",
        vendidos: "SELECT COUNT(*) AS total FROM equipos WHERE estatus = 'vendido'",
        totalVentas: "SELECT IFNULL(SUM(precio_venta), 0) AS total FROM equipos WHERE estatus = 'vendido'",
        totalComisiones: "SELECT IFNULL(SUM(comision_venta), 0) AS total FROM equipos WHERE estatus = 'vendido'"
    };

    db.query(queries.totalEquipos, (err1, r1) => {
        if (err1) {
            console.error("Error totalEquipos:", err1);
            return res.status(500).json({ error: "Error dashboard totalEquipos" });
        }

        db.query(queries.enAlmacen, (err2, r2) => {
            if (err2) {
                console.error("Error enAlmacen:", err2);
                return res.status(500).json({ error: "Error dashboard enAlmacen" });
            }

            db.query(queries.enSucursales, (err3, r3) => {
                if (err3) {
                    console.error("Error enSucursales:", err3);
                    return res.status(500).json({ error: "Error dashboard enSucursales" });
                }

                db.query(queries.vendidos, (err4, r4) => {
                    if (err4) {
                        console.error("Error vendidos:", err4);
                        return res.status(500).json({ error: "Error dashboard vendidos" });
                    }

                    db.query(queries.totalVentas, (err5, r5) => {
                        if (err5) {
                            console.error("Error totalVentas:", err5);
                            return res.status(500).json({ error: "Error dashboard totalVentas" });
                        }

                        db.query(queries.totalComisiones, (err6, r6) => {
                            if (err6) {
                                console.error("Error totalComisiones:", err6);
                                return res.status(500).json({ error: "Error dashboard totalComisiones" });
                            }

                            res.json({
                                totalEquipos: r1[0].total,
                                enAlmacen: r2[0].total,
                                enSucursales: r3[0].total,
                                vendidos: r4[0].total,
                                totalVentas: Number(r5[0].total),
                                totalComisiones: Number(r6[0].total)
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = { obtenerDashboard };