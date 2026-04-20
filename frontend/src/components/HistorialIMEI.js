import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function HistorialIMEI() {
  const [imei, setImei] = useState("");
  const [resultado, setResultado] = useState(null);
  const { showToast } = useToast();

  const buscarHistorial = async () => {
    const imeiLimpio = imei.trim();

    if (!/^\d{15}$/.test(imeiLimpio)) {
      showToast("Ingresa un IMEI válido de 15 dígitos", "warning");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/historial/${imei}`);
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "No se pudo obtener historial", "error");
        setResultado(null);
        return;
      }

      setResultado(data);
    } catch (error) {
      console.error(error);
      showToast("Error al buscar historial", "error");
      setResultado(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarHistorial();
    }
  };

  const obtenerClaseMovimiento = (tipo) => {
    if (tipo === "entrada") return "kardex-green";
    if (tipo === "salida") return "kardex-blue";
    if (tipo === "transferencia") return "kardex-purple";
    if (tipo === "regreso") return "kardex-orange";
    if (tipo === "venta" || tipo === "venta_final") return "kardex-red";
    return "kardex-gray";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-MX");
  };

  return (
    <div>
      <span className="badge">Kardex por IMEI</span>
      <h2>Historial por IMEI</h2>

      <div className="form-group">
        <label>IMEI</label>
        <input
          className="form-control"
          type="text"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escanea o escribe el IMEI"
        />
      </div>

      <button className="button-primary" type="button" onClick={buscarHistorial}>
        Buscar kardex
      </button>

      {resultado && (
        <div style={{ marginTop: "24px" }}>
          <div className="panel-soft">
            <h3>Datos del equipo</h3>
            <p><strong>IMEI:</strong> {resultado.equipo.imei}</p>
            <p><strong>Marca:</strong> {resultado.equipo.marca || "-"}</p>
            <p><strong>Modelo:</strong> {resultado.equipo.modelo || "-"}</p>
            <p><strong>RAM:</strong> {resultado.equipo.ram || "-"}</p>
            <p><strong>ROM:</strong> {resultado.equipo.rom || "-"}</p>
            <p><strong>Color:</strong> {resultado.equipo.color || "-"}</p>
            <p><strong>Estatus actual:</strong> {resultado.equipo.estatus || "-"}</p>
            <p><strong>Ubicación actual:</strong> {resultado.equipo.ubicacion || "-"}</p>
            <p><strong>Proveedor:</strong> {resultado.equipo.proveedor || "-"}</p>
            <p><strong>Número de pedido:</strong> {resultado.equipo.numero_pedido || "-"}</p>
            <p><strong>Precio compra:</strong> ${Number(resultado.equipo.precio || 0).toFixed(2)}</p>
          </div>

          <div className="kardex-timeline">
            {resultado.kardex && resultado.kardex.length > 0 ? (
              resultado.kardex.map((item, index) => (
                <div className="kardex-item" key={index}>
                  <div className={`kardex-dot ${obtenerClaseMovimiento(item.tipo)}`}></div>
                  <div className="kardex-content">
                    <div className="kardex-header">
                      <strong>{item.descripcion}</strong>
                      <span>{formatearFecha(item.fecha)}</span>
                    </div>

                    <div className="kardex-body">
                      <p><strong>Origen:</strong> {item.origen || "-"}</p>
                      <p><strong>Destino:</strong> {item.destino || "-"}</p>

                      {item.precio_venta && (
                        <p><strong>Precio venta:</strong> ${Number(item.precio_venta).toFixed(2)}</p>
                      )}

                      {item.comision_venta && (
                        <p><strong>Comisión:</strong> ${Number(item.comision_venta).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay movimientos registrados para este IMEI.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}