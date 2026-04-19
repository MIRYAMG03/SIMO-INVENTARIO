const db = require('../db/connection');

const obtenerEmpleados = (req, res) => {
    db.query("SELECT * FROM empleados ORDER BY nombre ASC", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener empleados" });
        }

        res.json(results);
    });
};

module.exports = { obtenerEmpleados };