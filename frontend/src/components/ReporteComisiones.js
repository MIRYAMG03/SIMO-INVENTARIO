import { useEffect, useMemo, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useToast } from "../context/ToastContext";

export default function ReporteComisiones() {
  const [ventas, setVentas] = useState([]);
  const [empleadoFiltro, setEmpleadoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const { showToast } = useToast();

  const cargarReporte = useCallback(async (inicio = "", fin = "") => {
    try {
      let url = fetch(`${process.env.REACT_APP_API_URL}/comisiones`);

      const params = new URLSearchParams();
      if (inicio) params.append("fechaInicio", inicio);
      if (fin) params.append("fechaFin", fin);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Respuesta no válida:", text);
        showToast("El servidor devolvió una respuesta no válida", "error");
        return;
      }

      if (!res.ok) {
        showToast(data.error || "Error al cargar reporte", "error");
        return;
      }

      if (Array.isArray(data)) {
        setVentas(data);
      } else {
        setVentas([]);
      }
    } catch (error) {
      console.error(error);
      showToast("Error al cargar reporte", "error");
    }
  }, [showToast]);

  useEffect(() => {
    cargarReporte();
  }, [cargarReporte]);

  const empleados = useMemo(() => {
    const lista = [...new Set(ventas.map((v) => v.empleado).filter(Boolean))];
    return lista.sort((a, b) => a.localeCompare(b));
  }, [ventas]);

  const ventasFiltradas = ventas.filter((venta) =>
    empleadoFiltro ? venta.empleado === empleadoFiltro : true
  );

  const totalComision = ventasFiltradas.reduce(
    (acc, item) => acc + Number(item.comision_venta || 0),
    0
  );

  const totalVentas = ventasFiltradas.reduce(
    (acc, item) => acc + Number(item.precio_venta || 0),
    0
  );

  const buscar = () => {
    cargarReporte(fechaInicio, fechaFin);
  };

  const limpiarFiltros = () => {
    setEmpleadoFiltro("");
    setFechaInicio("");
    setFechaFin("");
    cargarReporte();
  };

  const exportarExcel = () => {
    if (ventasFiltradas.length === 0) {
      showToast("No hay datos para exportar", "warning");
      return;
    }

    const datos = ventasFiltradas.map((v) => ({
      Empleado: v.empleado || "-",
      IMEI: v.imei || "-",
      Marca: v.marca || "-",
      Modelo: v.modelo || "-",
      "Precio venta": Number(v.precio_venta || 0),
      Comisión: Number(v.comision_venta || 0),
      "Fecha venta": v.fecha_venta || "-"
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);

    hoja["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 22 }
    ];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Comisiones");

    const excelBuffer = XLSX.write(libro, {
      bookType: "xlsx",
      type: "array"
    });

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const nombreArchivo = empleadoFiltro
      ? `comisiones_${empleadoFiltro.replaceAll(" ", "_")}.xlsx`
      : "comisiones_todos_los_empleados.xlsx";

    saveAs(archivo, nombreArchivo);
  };

  return (
    <div>
      <span className="badge">Reporte de comisiones</span>
      <h2>Reporte de comisiones por empleado</h2>

      <div className="filtros-grid">
        <div className="form-group">
          <label>Empleado</label>
          <select
            className="form-control"
            value={empleadoFiltro}
            onChange={(e) => setEmpleadoFiltro(e.target.value)}
          >
            <option value="">Todos los empleados</option>
            {empleados.map((empleado) => (
              <option key={empleado} value={empleado}>
                {empleado}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha inicio</label>
          <input
            className="form-control"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha fin</label>
          <input
            className="form-control"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button className="button-primary" type="button" onClick={buscar}>
          Buscar
        </button>

        <button className="button-primary" type="button" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>

        <button className="button-primary" type="button" onClick={exportarExcel}>
          Exportar a Excel
        </button>
      </div>

      <div className="resumen-box">
        <strong>Total de equipos vendidos: {ventasFiltradas.length}</strong>
        <br />
        <strong>Total vendido: ${totalVentas.toFixed(2)}</strong>
        <br />
        <strong>Total de comisión: ${totalComision.toFixed(2)}</strong>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="tabla-inventario">
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>IMEI</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Precio venta</th>
              <th>Comisión</th>
              <th>Fecha venta</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length > 0 ? (
              ventasFiltradas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.empleado || "-"}</td>
                  <td>{venta.imei}</td>
                  <td>{venta.marca || "-"}</td>
                  <td>{venta.modelo || "-"}</td>
                  <td>${Number(venta.precio_venta || 0).toFixed(2)}</td>
                  <td>${Number(venta.comision_venta || 0).toFixed(2)}</td>
                  <td>{venta.fecha_venta || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay ventas para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}