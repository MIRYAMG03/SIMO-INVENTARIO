import { useEffect, useState, useCallback } from "react";
import { useToast } from "../context/ToastContext";

export default function InventarioGeneral() {
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const { showToast } = useToast();

  const cargarInventario = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/inventario/general");
      const data = await res.json();

      if (Array.isArray(data)) {
        setEquipos(data);
      } else {
        console.error("Respuesta no válida:", data);
        setEquipos([]);
        showToast(data.error || "Error al obtener inventario", "error");
      }
    } catch (error) {
      console.error("Error al cargar inventario:", error);
      setEquipos([]);
      showToast("Error al cargar inventario", "error");
    }
  }, [showToast]);

  useEffect(() => {
    cargarInventario();
  }, [cargarInventario]);

  const obtenerClaseEstatus = (estatus) => {
    if (!estatus) return "status-gray";

    const valor = estatus.toLowerCase();

    if (valor === "almacen") return "status-green";
    if (valor === "en_tienda") return "status-blue";
    if (valor === "vendido") return "status-red";

    return "status-gray";
  };

  const equiposFiltrados = equipos.filter((equipo) => {
    const texto = busqueda.toLowerCase();

    return (
      equipo.imei?.toString().includes(busqueda) ||
      equipo.marca?.toLowerCase().includes(texto) ||
      equipo.modelo?.toLowerCase().includes(texto) ||
      equipo.ram?.toLowerCase().includes(texto) ||
      equipo.rom?.toLowerCase().includes(texto) ||
      equipo.color?.toLowerCase().includes(texto) ||
      equipo.proveedor?.toLowerCase().includes(texto) ||
      equipo.ubicacion?.toLowerCase().includes(texto) ||
      equipo.estatus?.toLowerCase().includes(texto)
    );
  });

  return (
    <div>
      <span className="badge">Inventario general</span>
      <h2>Inventario general</h2>

      <div className="form-group">
        <label>Buscar</label>
        <input
          className="form-control"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="IMEI, marca, modelo, RAM, ROM, color, proveedor, estatus o ubicación"
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="tabla-inventario">
          <thead>
            <tr>
              <th>IMEI</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>RAM</th>
              <th>ROM</th>
              <th>Color</th>
              <th>Tipo</th>
              <th>Proveedor</th>
              <th>Pedido</th>
              <th>Precio</th>
              <th>Estatus</th>
              <th>Ubicación</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {equiposFiltrados.length > 0 ? (
              equiposFiltrados.map((equipo) => (
                <tr key={equipo.imei}>
                  <td>{equipo.imei}</td>
                  <td>{equipo.marca || "-"}</td>
                  <td>{equipo.modelo || "-"}</td>
                  <td>{equipo.ram || "-"}</td>
                  <td>{equipo.rom || "-"}</td>
                  <td>{equipo.color || "-"}</td>
                  <td>{equipo.tipo || "-"}</td>
                  <td>{equipo.proveedor || "-"}</td>
                  <td>{equipo.numero_pedido || "-"}</td>
                  <td>{equipo.precio || "-"}</td>
                  <td>
                    <span className={`status-badge ${obtenerClaseEstatus(equipo.estatus)}`}>
                      {equipo.estatus || "-"}
                    </span>
                  </td>
                  <td>{equipo.ubicacion || "-"}</td>
                  <td>{equipo.created_at || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13">No hay equipos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}