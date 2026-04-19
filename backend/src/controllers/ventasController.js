const db = require('../db/connection');

const registrarVenta = (req, res) => {
    const { imei, empleado, precio_venta, comision_venta } = req.body;

    if (!imei) {
        return res.status(400).json({ error: "IMEI requerido" });
    }

    if (!empleado) {
        return res.status(400).json({ error: "Empleado requerido" });
    }

    db.query(
        "SELECT * FROM equipos WHERE imei = ?",
        [imei],
        (err, results) => {
            if (err) {
                console.error("ERROR SELECT:", err);
                return res.status(500).json({ error: "Error BD al buscar equipo" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "IMEI no existe" });
            }

            const equipo = results[0];

            if (equipo.estatus === "vendido") {
                return res.status(400).json({ error: "Equipo ya vendido" });
            }

            const origen = equipo.ubicacion || "almacen";

            db.query(
                `UPDATE equipos 
                 SET estatus = 'vendido',
                     ubicacion = 'vendido',
                     empleado = ?,
                     precio_venta = ?,
                     comision_venta = ?,
                     fecha_venta = NOW()
                 WHERE imei = ?`,
                [empleado, precio_venta || null, comision_venta || null, imei],
                (errUpdate) => {
                    if (errUpdate) {
                        console.error("ERROR UPDATE:", errUpdate);
                        return res.status(500).json({ error: "Error al actualizar equipo" });
                    }

                    db.query(
                        `INSERT INTO movimientos (imei, tipo_movimiento, origen, destino)
                         VALUES (?, 'venta', ?, 'vendido')`,
                        [imei, origen],
                        (errMov) => {
                            if (errMov) {
                                console.error("ERROR MOVIMIENTO:", errMov);
                            }

                            return res.json({
                                mensaje: "Venta registrada correctamente"
                            });
                        }
                    );
                }
            );
        }
    );
};

module.exports = { registrarVenta };