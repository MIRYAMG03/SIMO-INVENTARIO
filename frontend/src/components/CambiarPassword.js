import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function CambiarPassword() {
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const { showToast } = useToast();

  const [form, setForm] = useState({
    password_actual: "",
    password_nueva: "",
    confirmar_password: ""
  });

  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarCambio = async () => {
    if (!form.password_actual || !form.password_nueva || !form.confirmar_password) {
      showToast("Completa todos los campos", "warning");
      return;
    }

    if (form.password_nueva.length < 4) {
      showToast("La nueva contraseña debe tener al menos 4 caracteres", "warning");
      return;
    }

    if (form.password_nueva !== form.confirmar_password) {
      showToast("La confirmación no coincide", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/cambiar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario_id: usuarioLogueado.id,
          password_actual: form.password_actual,
          password_nueva: form.password_nueva
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error al cambiar contraseña", "error");
        return;
      }

      showToast("Contraseña actualizada correctamente", "success");

      setForm({
        password_actual: "",
        password_nueva: "",
        confirmar_password: ""
      });
    } catch (error) {
      console.error(error);
      showToast("Error al cambiar contraseña", "error");
    }
  };

  return (
    <div>
      <span className="badge">Seguridad</span>
      <h2>Cambiar contraseña</h2>

      <div className="panel-soft">
        <div className="form-group">
          <label>Contraseña actual</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">🔒</span>
            <input
              className="form-control input-with-icon input-with-action"
              type={mostrarActual ? "text" : "password"}
              name="password_actual"
              value={form.password_actual}
              onChange={handleChange}
              placeholder="Contraseña actual"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setMostrarActual(!mostrarActual)}
            >
              {mostrarActual ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Nueva contraseña</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">🔑</span>
            <input
              className="form-control input-with-icon input-with-action"
              type={mostrarNueva ? "text" : "password"}
              name="password_nueva"
              value={form.password_nueva}
              onChange={handleChange}
              placeholder="Nueva contraseña"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setMostrarNueva(!mostrarNueva)}
            >
              {mostrarNueva ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Confirmar nueva contraseña</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">✅</span>
            <input
              className="form-control input-with-icon input-with-action"
              type={mostrarConfirmar ? "text" : "password"}
              name="confirmar_password"
              value={form.confirmar_password}
              onChange={handleChange}
              placeholder="Confirma nueva contraseña"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
            >
              {mostrarConfirmar ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button className="button-primary" type="button" onClick={guardarCambio}>
          Guardar nueva contraseña
        </button>
      </div>
    </div>
  );
}