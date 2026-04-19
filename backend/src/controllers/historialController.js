const db = require('../db/connection');

const obtenerHistorialPorIMEI = (req, res) => {
    const { imei } = req.params;

    const sqlEquipo = `
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
            created_at,
            empleado,
            precio_venta,
            comision_venta,
            fecha_venta
        FROM equipos
        WHERE imei = ?
    `;

    const sqlMovimientos = `
        SELECT 
            id,
            imei,
            tipo_movimiento,
            origen,
            destino,
            fecha
        FROM movimientos
        WHERE imei = ?
        ORDER BY fecha ASC
    `;

    db.query(sqlEquipo, [imei], (errEquipo, equipoResult) => {
        if (errEquipo) {
            console.error("Error al obtener equipo:", errEquipo);
            return res.status(500).json({ error: "Error al obtener equipo" });
        }

        if (equipoResult.length === 0) {
            return res.status(404).json({ error: "IMEI no encontrado" });
        }

        const equipo = equipoResult[0];

        db.query(sqlMovimientos, [imei], (errMov, movimientosResult) => {
            if (errMov) {
                console.error("Error al obtener movimientos:", errMov);
                return res.status(500).json({ error: "Error al obtener movimientos" });
            }

            const kardex = [];

            // Entrada inicial a almacén
            if (equipo.created_at) {
                kardex.push({
                    tipo: "entrada",
                    descripcion: "Entrada a almacén",
                    origen: "-",
                    destino: "almacen",
                    fecha: equipo.created_at
                });
            }

            // Movimientos registrados
            movimientosResult.forEach((mov) => {
                let descripcion = "Movimiento";

                if (mov.tipo_movimiento === "salida") {
                    descripcion = "Salida a sucursal";
                } else if (mov.tipo_movimiento === "transferencia") {
                    descripcion = "Transferencia entre sucursales";
                } else if (mov.tipo_movimiento === "regreso") {
                    descripcion = "Regreso a almacén";
                } else if (mov.tipo_movimiento === "venta") {
                    descripcion = "Venta";
                }

                kardex.push({
                    tipo: mov.tipo_movimiento,
                    descripcion,
                    origen: mov.origen || "-",
                    destino: mov.destino || "-",
                    fecha: mov.fecha
                });
            });

            // Venta desde la tabla equipos, por si quieres más detalle
            if (equipo.fecha_venta) {
                kardex.push({
                    tipo: "venta_final",
                    descripcion: `Venta registrada${equipo.empleado ? ` por ${equipo.empleado}` : ""}`,
                    origen: equipo.ubicacion || "-",
                    destino: "vendido",
                    fecha: equipo.fecha_venta,
                    precio_venta: equipo.precio_venta,
                    comision_venta: equipo.comision_venta
                });
            }

            kardex.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

            res.json({
                equipo,
                kardex
            });
        });
    });
};

module.exports = { obtenerHistorialPorIMEI };