import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useToast } from "../context/ToastContext";

export default function InventarioSucursal() {
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const cargarInventario = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/inventario/sucursal`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setEquipos(data);
        } else {
          console.error("Respuesta no válida:", data);
          setEquipos([]);
          showToast(data.error || "Error al cargar inventario por sucursal", "error");
        }
      } catch (error) {
        console.error("Error al cargar inventario por sucursal:", error);
        setEquipos([]);
        showToast("Error al cargar inventario por sucursal", "error");
      }
    };

    cargarInventario();
  }, [showToast]);

  const obtenerClaseEstatus = (estatus) => {
    if (!estatus) return "status-gray";

    const valor = estatus.toLowerCase();

    if (valor === "almacen") return "status-green";
    if (valor === "en_tienda") return "status-blue";
    if (valor === "vendido") return "status-red";

    return "status-gray";
  };

  const sucursales = useMemo(() => {
    const unicas = [
      ...new Set(
        equipos
          .map((equipo) => equipo.ubicacion)
          .filter(
            (ubicacion) =>
              ubicacion &&
              ubicacion.toLowerCase() !== "almacen" &&
              ubicacion.toLowerCase() !== "vendido"
          )
      )
    ];
    return unicas.sort((a, b) => a.localeCompare(b));
  }, [equipos]);

  const equiposFiltrados = equipos.filter((equipo) => {
    const coincideSucursal = sucursalSeleccionada
      ? equipo.ubicacion === sucursalSeleccionada
      : (equipo.ubicacion || "").toLowerCase() !== "almacen" &&
        (equipo.ubicacion || "").toLowerCase() !== "vendido";

    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      equipo.imei?.toString().includes(busqueda) ||
      equipo.marca?.toLowerCase().includes(texto) ||
      equipo.modelo?.toLowerCase().includes(texto) ||
      equipo.ram?.toLowerCase().includes(texto) ||
      equipo.rom?.toLowerCase().includes(texto) ||
      equipo.color?.toLowerCase().includes(texto) ||
      equipo.ubicacion?.toLowerCase().includes(texto) ||
      equipo.estatus?.toLowerCase().includes(texto);

    return coincideSucursal && coincideBusqueda;
  });

  const conteoPorSucursal = useMemo(() => {
    const conteo = {};

    equipos.forEach((equipo) => {
      const ubicacion = equipo.ubicacion;

      if (
        ubicacion &&
        ubicacion.toLowerCase() !== "almacen" &&
        ubicacion.toLowerCase() !== "vendido"
      ) {
        conteo[ubicacion] = (conteo[ubicacion] || 0) + 1;
      }
    });

    return Object.entries(conteo)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sucursal, total]) => ({ sucursal, total }));
  }, [equipos]);

  const exportarExcel = () => {
    if (equiposFiltrados.length === 0) {
      showToast("No hay datos para exportar", "warning");
      return;
    }

    const datosExportar = equiposFiltrados.map((equipo) => ({
      IMEI: equipo.imei,
      Marca: equipo.marca || "-",
      Modelo: equipo.modelo || "-",
      RAM: equipo.ram || "-",
      ROM: equipo.rom || "-",
      Color: equipo.color || "-",
      Proveedor: equipo.proveedor || "-",
      Pedido: equipo.numero_pedido || "-",
      Precio: equipo.precio || 0,
      Estatus: equipo.estatus || "-",
      Ubicacion: equipo.ubicacion || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExportar);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 18 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 20 },
      { wch: 14 },
      { wch: 12 },
      { wch: 14 },
      { wch: 22 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const nombreSucursal = sucursalSeleccionada
      ? sucursalSeleccionada.replaceAll(" ", "_")
      : "todas_las_sucursales";

    saveAs(archivo, `inventario_${nombreSucursal}.xlsx`);
  };

  return (
    <div>
      <span className="badge">Inventario por sucursal</span>
      <h2>Inventario por sucursal</h2>

      <div className="filtros-grid">
        <div className="form-group">
          <label>Sucursal</label>
          <select
            className="form-control"
            value={sucursalSeleccionada}
            onChange={(e) => setSucursalSeleccionada(e.target.value)}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal} value={sucursal}>
                {sucursal}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Buscar</label>
          <input
            className="form-control"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="IMEI, marca, modelo, RAM, ROM, color o ubicación"
          />
        </div>
      </div>

      <div className="resumen-box">
        <strong>Total de equipos encontrados: {equiposFiltrados.length}</strong>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <button className="button-primary" type="button" onClick={exportarExcel}>
          Exportar a Excel
        </button>
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
              <th>Proveedor</th>
              <th>Pedido</th>
              <th>Precio</th>
              <th>Estatus</th>
              <th>Ubicación</th>
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
                  <td>{equipo.proveedor || "-"}</td>
                  <td>{equipo.numero_pedido || "-"}</td>
                  <td>${Number(equipo.precio || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${obtenerClaseEstatus(equipo.estatus)}`}>
                      {equipo.estatus || "-"}
                    </span>
                  </td>
                  <td>{equipo.ubicacion || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No hay equipos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel-soft" style={{ marginBottom: "20px" }}>
        <h3>Conteo por sucursal</h3>
        <div className="list-box">
          <ul>
            {conteoPorSucursal.map((item) => (
              <li key={item.sucursal}>
                <span>{item.sucursal}</span>
                <strong>{item.total} equipos</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}