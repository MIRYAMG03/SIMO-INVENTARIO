const db = require('../db/connection');

// ===== MARCAS =====
const obtenerMarcas = (req, res) => {
    db.query("SELECT * FROM marcas ORDER BY nombre ASC", (err, results) => {
        if (err) {
            console.error("Error al obtener marcas:", err);
            return res.status(500).json({ error: "Error al obtener marcas" });
        }

        res.json(results);
    });
};

const agregarMarca = (req, res) => {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ error: "El nombre de la marca es obligatorio" });
    }

    db.query(
        "INSERT INTO marcas (nombre) VALUES (?)",
        [nombre.trim()],
        (err, result) => {
            if (err) {
                console.error("Error al agregar marca:", err);
                return res.status(500).json({ error: "Error al agregar marca" });
            }

            res.json({
                mensaje: "Marca agregada correctamente",
                id: result.insertId
            });
        }
    );
};

// ===== MODELOS =====
const obtenerModelos = (req, res) => {
    const { marcaId } = req.params;

    db.query(
        "SELECT * FROM modelos WHERE marca_id = ? ORDER BY nombre ASC",
        [marcaId],
        (err, results) => {
            if (err) {
                console.error("Error al obtener modelos:", err);
                return res.status(500).json({ error: "Error al obtener modelos" });
            }

            res.json(results);
        }
    );
};

const obtenerTodosLosModelos = (req, res) => {
    const sql = `
        SELECT modelos.id, modelos.nombre, modelos.marca_id, marcas.nombre AS marca
        FROM modelos
        INNER JOIN marcas ON modelos.marca_id = marcas.id
        ORDER BY marcas.nombre ASC, modelos.nombre ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener todos los modelos:", err);
            return res.status(500).json({ error: "Error al obtener modelos" });
        }

        res.json(results);
    });
};

const agregarModelo = (req, res) => {
    const { marca_id, nombre } = req.body;

    if (!marca_id) {
        return res.status(400).json({ error: "La marca es obligatoria" });
    }

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ error: "El nombre del modelo es obligatorio" });
    }

    db.query(
        "INSERT INTO modelos (marca_id, nombre) VALUES (?, ?)",
        [marca_id, nombre.trim()],
        (err, result) => {
            if (err) {
                console.error("Error al agregar modelo:", err);
                return res.status(500).json({ error: "Error al agregar modelo" });
            }

            res.json({
                mensaje: "Modelo agregado correctamente",
                id: result.insertId
            });
        }
    );
};

// ===== PROVEEDORES =====
const obtenerProveedores = (req, res) => {
    db.query("SELECT * FROM proveedores ORDER BY nombre ASC", (err, results) => {
        if (err) {
            console.error("Error al obtener proveedores:", err);
            return res.status(500).json({ error: "Error al obtener proveedores" });
        }

        res.json(results);
    });
};

const agregarProveedor = (req, res) => {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ error: "El nombre del proveedor es obligatorio" });
    }

    db.query(
        "INSERT INTO proveedores (nombre) VALUES (?)",
        [nombre.trim()],
        (err, result) => {
            if (err) {
                console.error("Error al agregar proveedor:", err);
                return res.status(500).json({ error: "Error al agregar proveedor" });
            }

            res.json({
                mensaje: "Proveedor agregado correctamente",
                id: result.insertId
            });
        }
    );
};

module.exports = {
    obtenerMarcas,
    agregarMarca,
    obtenerModelos,
    obtenerTodosLosModelos,
    agregarModelo,
    obtenerProveedores,
    agregarProveedor
};