import { useState } from "react";
import logo from "../assets/logo.png";
import { useToast } from "../context/ToastContext";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    usuario: "",
    password: ""
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const iniciarSesion = async () => {
    if (!form.usuario || !form.password) {
      showToast("Ingresa usuario y contraseña", "warning");
      return;
    }

    try {
      setCargando(true);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: form.usuario,
          password: form.password
        })
      });

      const text = await res.text();
      console.log("RESPUESTA LOGIN:", text);

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setCargando(false);
        showToast(data.error || "Error al iniciar sesión", "error");
        return;
      }

      localStorage.setItem("usuarioLogueado", JSON.stringify(data.usuario));
      setCargando(false);
      showToast("Bienvenida al sistema", "success");
      onLogin(data.usuario);
    } catch (error) {
      console.error(error);
      setCargando(false);
      showToast("Error al iniciar sesión", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      iniciarSesion();
    }
  };

  return (
    <div className="login-container premium-login">
      <div className="login-bg-shape login-shape-1"></div>
      <div className="login-bg-shape login-shape-2"></div>

      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="SIMO" className="login-logo" />
          <h2>SIMO</h2>
          <p className="login-subtitle">Sistema de Control de Inventarios</p>
        </div>

        <div className="form-group">
          <label>Usuario</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">👤</span>
            <input
              className="form-control input-with-icon"
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ingresa tu usuario"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <div className="input-icon-wrapper">
            <span className="input-icon">🔒</span>
            <input
              className="form-control input-with-icon input-with-action"
              type={mostrarPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button
          className="button-primary login-btn"
          type="button"
          onClick={iniciarSesion}
          disabled={cargando}
        >
          {cargando ? (
            <span className="loader-text">
              <span className="loader-spinner"></span>
              Iniciando sesión...
            </span>
          ) : (
            "Entrar al sistema"
          )}
        </button>

        <div className="login-footer-note">
          Acceso autorizado para administración de inventario.
        </div>
      </div>
    </div>
  );
}