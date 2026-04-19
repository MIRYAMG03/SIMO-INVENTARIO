const db = require('../db/connection');

const transferirEquipos = (req, res) => {
    const { origen, destino, imeis } = req.body;

    if (!origen || !destino) {
        return res.status(400).json({ error: "Origen y destino son obligatorios" });
    }

    if (origen === destino) {
        return res.status(400).json({ error: "La sucursal origen y destino no pueden ser la misma" });
    }

    if (!imeis || !Array.isArray(imeis) || imeis.length === 0) {
        return res.status(400).json({ error: "No hay IMEIs para transferir" });
    }

    let errores = [];
    let procesados = 0;

    imeis.forEach((imei) => {
        db.query(
            "SELECT * FROM equipos WHERE imei = ?",
            [imei],
            (err, results) => {
                if (err) {
                    console.error("ERROR SELECT:", err);
                    errores.push({ imei, error: "Error al buscar equipo" });
                    procesados++;

                    if (procesados === imeis.length) {
                        return res.json({ mensaje: "Proceso terminado", errores });
                    }
                    return;
                }

                if (results.length === 0) {
                    errores.push({ imei, error: "IMEI no existe" });
                    procesados++;

                    if (procesados === imeis.length) {
                        return res.json({ mensaje: "Proceso terminado", errores });
                    }
                    return;
                }

                const equipo = results[0];

                if ((equipo.estatus || "").toLowerCase() === "vendido") {
                    errores.push({ imei, error: "Equipo vendido, no se puede transferir" });
                    procesados++;

                    if (procesados === imeis.length) {
                        return res.json({ mensaje: "Proceso terminado", errores });
                    }
                    return;
                }

                if ((equipo.ubicacion || "") !== origen) {
                    errores.push({ imei, error: "El equipo no está en la sucursal origen" });
                    procesados++;

                    if (procesados === imeis.length) {
                        return res.json({ mensaje: "Proceso terminado", errores });
                    }
                    return;
                }

                db.query(
                    "UPDATE equipos SET ubicacion = ?, estatus = 'en_tienda' WHERE imei = ?",
                    [destino, imei],
                    (errUpdate) => {
                        if (errUpdate) {
                            console.error("ERROR UPDATE:", errUpdate);
                            errores.push({ imei, error: "Error al actualizar equipo" });
                            procesados++;

                            if (procesados === imeis.length) {
                                return res.json({ mensaje: "Proceso terminado", errores });
                            }
                            return;
                        }

                        db.query(
                            `INSERT INTO movimientos (imei, tipo_movimiento, origen, destino)
                             VALUES (?, 'transferencia', ?, ?)`,
                            [imei, origen, destino],
                            (errMov) => {
                                if (errMov) {
                                    console.error("ERROR MOVIMIENTO:", errMov);
                                    errores.push({ imei, error: "Transferido pero sin movimiento registrado" });
                                }

                                procesados++;

                                if (procesados === imeis.length) {
                                    return res.json({
                                        mensaje: "Proceso terminado",
                                        errores
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

module.exports = { transferirEquipos };