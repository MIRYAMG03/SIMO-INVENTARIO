const db = require('../db/connection');

const login = (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    db.query(
        "SELECT id, nombre, usuario, password, rol FROM usuarios WHERE usuario = ?",
        [usuario],
        (err, results) => {
            if (err) {
                console.error("Error login:", err);
                return res.status(500).json({ error: "Error al iniciar sesión" });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            const user = results[0];

            if (user.password !== password) {
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            return res.json({
                mensaje: "Login correcto",
                usuario: {
                    id: user.id,
                    nombre: user.nombre,
                    usuario: user.usuario,
                    rol: user.rol
                }
            });
        }
    );
};

const cambiarPassword = (req, res) => {
    const { usuario_id, password_actual, password_nueva } = req.body;

    if (!usuario_id || !password_actual || !password_nueva) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    db.query(
        "SELECT id, password FROM usuarios WHERE id = ?",
        [usuario_id],
        (err, results) => {
            if (err) {
                console.error("Error al buscar usuario:", err);
                return res.status(500).json({ error: "Error al buscar usuario" });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const usuario = results[0];

            if (usuario.password !== password_actual) {
                return res.status(400).json({ error: "La contraseña actual es incorrecta" });
            }

            db.query(
                "UPDATE usuarios SET password = ? WHERE id = ?",
                [password_nueva, usuario_id],
                (errUpdate) => {
                    if (errUpdate) {
                        console.error("Error al cambiar contraseña:", errUpdate);
                        return res.status(500).json({ error: "Error al cambiar contraseña" });
                    }

                    return res.json({
                        mensaje: "Contraseña actualizada correctamente"
                    });
                }
            );
        }
    );
};

module.exports = { login, cambiarPassword };