const db = require('../db/connection');

const moverEquipos = (req, res) => {
    const { imeis, destino } = req.body;

    if (!destino) {
        return res.status(400).json({ error: "Destino obligatorio" });
    }

    if (!imeis || !Array.isArray(imeis) || imeis.length === 0) {
        return res.status(400).json({ error: "No hay IMEIs" });
    }

    let errores = [];
    let movidos = [];
    let procesados = 0;
    const fechaMovimiento = new Date();

    imeis.forEach((imei) => {
        db.query(
            `SELECT * FROM equipos WHERE imei = ? AND ubicacion = 'almacen'`,
            [imei],
            (err, results) => {
                if (err) {
                    console.error("ERROR SELECT:", err);
                    errores.push({ imei, error: "Error BD" });
                    procesados++;

                    if (procesados === imeis.length) {
                        return res.json({
                            mensaje: "Proceso terminado",
                            errores,
                            movidos,
                            fecha: fechaMovimiento
                        });
                    }
                    return;
                }

                if (results.length === 0) {
                    errores.push({ imei, error: "No existe o no está en almacén" });
                    procesados++;

                    if (procesados === imeis.length) {
                        return res.json({
                            mensaje: "Proceso terminado",
                            errores,
                            movidos,
                            fecha: fechaMovimiento
                        });
                    }
                    return;
                }

                const equipo = results[0];

                db.query(
                    `UPDATE equipos 
                     SET ubicacion = ?, estatus = 'en_tienda'
                     WHERE imei = ?`,
                    [destino, imei],
                    (errUpdate) => {
                        if (errUpdate) {
                            console.error("ERROR UPDATE:", errUpdate);
                            errores.push({ imei, error: "Error al actualizar equipo" });
                            procesados++;

                            if (procesados === imeis.length) {
                                return res.json({
                                    mensaje: "Proceso terminado",
                                    errores,
                                    movidos,
                                    fecha: fechaMovimiento
                                });
                            }
                            return;
                        }

                        db.query(
                            `INSERT INTO movimientos (imei, tipo_movimiento, origen, destino)
                             VALUES (?, 'salida', 'almacen', ?)`,
                            [imei, destino],
                            (errMov) => {
                                if (errMov) {
                                    console.error("ERROR MOVIMIENTO:", errMov);
                                    errores.push({ imei, error: "Movido pero sin movimiento registrado" });
                                }

                                movidos.push({
                                    equipo: `${equipo.marca || ""} ${equipo.modelo || ""}`.trim() || equipo.tipo || "Equipo",
                                    imei: equipo.imei,
                                    numero_pedido: equipo.numero_pedido || "-",
                                    precio: equipo.precio || 0,
                                    ram: equipo.ram || "-",
                                    rom: equipo.rom || "-",
                                    color: equipo.color || "-"
                                });

                                procesados++;

                                if (procesados === imeis.length) {
                                    return res.json({
                                        mensaje: "Proceso terminado",
                                        errores,
                                        movidos,
                                        fecha: fechaMovimiento,
                                        destino
                                    });
                                }
                            }
                        );
                    }
                );
            }
        );
    });
};

module.exports = { moverEquipos };