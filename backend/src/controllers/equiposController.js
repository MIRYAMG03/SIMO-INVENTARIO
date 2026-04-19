const db = require('../db/connection');

const registrarLote = (req, res) => {
    const { marca_id, modelo_id, tipo, proveedor, numero_pedido, precio, ram, rom, color, imeis } = req.body;

    if (!imeis || imeis.length === 0) {
        return res.status(400).json({ error: "No hay IMEIs" });
    }

    let errores = [];
    let procesados = 0;

    db.query("SELECT nombre FROM marcas WHERE id = ?", [marca_id], (errMarca, marcaResult) => {
        if (errMarca || marcaResult.length === 0) {
            return res.status(500).json({ error: "Error al obtener marca" });
        }

        db.query("SELECT nombre FROM modelos WHERE id = ?", [modelo_id], (errModelo, modeloResult) => {
            if (errModelo || modeloResult.length === 0) {
                return res.status(500).json({ error: "Error al obtener modelo" });
            }

            const marca = marcaResult[0].nombre;
            const modelo = modeloResult[0].nombre;

            imeis.forEach((imei) => {
                db.query(
                    "SELECT * FROM equipos WHERE imei = ?",
                    [imei],
                    (err, results) => {
                        if (err) {
                            errores.push({ imei, error: "Error BD" });
                        } else if (results.length > 0) {
                            errores.push({ imei, error: "IMEI DUPLICADO - YA REGISTRADO" });
                        } else {
                            db.query(
                                `INSERT INTO equipos 
                                (imei, marca, modelo, tipo, proveedor, numero_pedido, precio, ram, rom, color, estatus, ubicacion, marca_id, modelo_id)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'almacen', 'almacen', ?, ?)`,
                                [
                                  imei,
                                  marca,
                                  modelo,
                                  tipo,
                                  proveedor,
                                  numero_pedido,
                                  precio,
                                  ram || null,
                                  rom || null,
                                  color || null,
                                  marca_id,
                                  modelo_id
                                ]
                            );
                        }

                        procesados++;

                        if (procesados === imeis.length) {
                            res.json({
                                mensaje: 'Proceso terminado',
                                errores
                            });
                        }
                    }
                );
            });
        });
    });
};

module.exports = { registrarLote };