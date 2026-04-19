import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.png";

import Login from "./components/Login";
import DashboardInicio from "./components/DashboardInicio";
import RegistrarEquipos from "./components/RegistrarEquipos";
import Movimientos from "./components/Movimientos";
import Regresos from "./components/Regresos";
import Transferencias from "./components/Transferencias";
import InventarioGeneral from "./components/InventarioGeneral";
import InventarioSucursal from "./components/InventarioSucursal";
import HistorialIMEI from "./components/HistorialIMEI";
import Ventas from "./components/Ventas";
import ReporteComisiones from "./components/ReporteComisiones";
import Catalogos from "./components/Catalogos";
import ReporteValorizado from "./components/ReporteValorizado";
import CambiarPassword from "./components/CambiarPassword";
import InstalarApp from "./components/InstalarApp";
import SinPermiso from "./components/SinPermiso";
import NoEncontrado from "./components/NoEncontrado";
import ErrorBoundary from "./components/ErrorBoundary";

import { permisosPorRol } from "./config/permisos";

function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userGuardado = localStorage.getItem("usuarioLogueado");
    if (userGuardado) {
      setUsuario(JSON.parse(userGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    setUsuario(null);
    setModuloActivo("inicio");
  };

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  const modulosValidos = [
    "inicio",
    "compra",
    "movimientos",
    "regresos",
    "transferencias",
    "inventario-general",
    "inventario-sucursal",
    "historial-imei",
    "ventas",
    "comisiones",
    "catalogos",
    "reporte-valorizado",
    "cambiar-password"
  ];

  const tienePermiso = permisosPorRol[usuario.rol]?.includes(moduloActivo);

  const renderContenido = () => {
    if (!modulosValidos.includes(moduloActivo)) {
      return <NoEncontrado />;
    }

    if (!tienePermiso) {
      return <SinPermiso />;
    }

    switch (moduloActivo) {
      case "inicio":
        return (
          <div className="panel">
            <DashboardInicio />
          </div>
        );

      case "compra":
        return (
          <div className="panel">
            <RegistrarEquipos />
          </div>
        );

      case "movimientos":
        return (
          <div className="panel">
            <Movimientos />
          </div>
        );

      case "regresos":
        return (
          <div className="panel">
            <Regresos />
          </div>
        );

      case "transferencias":
        return (
          <div className="panel">
            <Transferencias />
          </div>
        );

      case "inventario-general":
        return (
          <div className="panel">
            <InventarioGeneral />
          </div>
        );

      case "inventario-sucursal":
        return (
          <div className="panel">
            <InventarioSucursal />
          </div>
        );

      case "historial-imei":
        return (
          <div className="panel">
            <HistorialIMEI />
          </div>
        );

      case "ventas":
        return (
          <div className="panel">
            <Ventas />
          </div>
        );

      case "comisiones":
        return (
          <div className="panel">
            <ReporteComisiones />
          </div>
        );

      case "catalogos":
        return (
          <div className="panel">
            <Catalogos />
          </div>
        );

      case "reporte-valorizado":
        return (
          <div className="panel">
            <ReporteValorizado />
          </div>
        );

      case "cambiar-password":
        return (
          <div className="panel">
            <CambiarPassword />
          </div>
        );

      default:
        return <NoEncontrado />;
    }
  };

  const puedeVer = (modulo) => permisosPorRol[usuario.rol]?.includes(modulo);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-content">
          <div className="brand">
            <img src={logo} alt="SIMO" className="brand-logo" />
            <div>
              <h1 className="brand-title">SIMO</h1>
              <p className="brand-subtitle">Sistema de Inventario</p>
            </div>
          </div>

          <div className="topbar-user">
            <span>
              {usuario.nombre} | {usuario.rol}
            </span>
            <button className="button-logout" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <InstalarApp />

      <nav className="menu-horizontal">
        {puedeVer("inicio") && (
          <button className={moduloActivo === "inicio" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("inicio")}>
            Inicio
          </button>
        )}

        {puedeVer("compra") && (
          <button className={moduloActivo === "compra" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("compra")}>
            Compra
          </button>
        )}

        {puedeVer("movimientos") && (
          <button className={moduloActivo === "movimientos" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("movimientos")}>
            Movimientos
          </button>
        )}

        {puedeVer("regresos") && (
          <button className={moduloActivo === "regresos" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("regresos")}>
            Regresos
          </button>
        )}

        {puedeVer("transferencias") && (
          <button className={moduloActivo === "transferencias" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("transferencias")}>
            Transferencias
          </button>
        )}

        {puedeVer("inventario-general") && (
          <button className={moduloActivo === "inventario-general" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("inventario-general")}>
            Inventario general
          </button>
        )}

        {puedeVer("inventario-sucursal") && (
          <button className={moduloActivo === "inventario-sucursal" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("inventario-sucursal")}>
            Inventario sucursal
          </button>
        )}

        {puedeVer("historial-imei") && (
          <button className={moduloActivo === "historial-imei" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("historial-imei")}>
            Kardex IMEI
          </button>
        )}

        {puedeVer("ventas") && (
          <button className={moduloActivo === "ventas" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("ventas")}>
            Ventas
          </button>
        )}

        {puedeVer("comisiones") && (
          <button className={moduloActivo === "comisiones" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("comisiones")}>
            Comisiones
          </button>
        )}

        {puedeVer("catalogos") && (
          <button className={moduloActivo === "catalogos" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("catalogos")}>
            Catálogos
          </button>
        )}

        {puedeVer("reporte-valorizado") && (
          <button className={moduloActivo === "reporte-valorizado" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("reporte-valorizado")}>
            Reporte valorizado
          </button>
        )}

        {puedeVer("cambiar-password") && (
          <button className={moduloActivo === "cambiar-password" ? "menu-btn active" : "menu-btn"} onClick={() => setModuloActivo("cambiar-password")}>
            Cambiar contraseña
          </button>
        )}
      </nav>

      <main className="contenido-principal">
        <ErrorBoundary>{renderContenido()}</ErrorBoundary>
      </main>
    </div>
  );
}

export default App;