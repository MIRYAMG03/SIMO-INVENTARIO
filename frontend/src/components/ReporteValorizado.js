import { useEffect, useMemo, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useToast } from "../context/ToastContext";

export default function ReporteValorizado() {
  const [datos, setDatos] = useState([]);
  const { showToast } = useToast();

  const cargarReporte = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/reportes/valorizado`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setDatos(data);
      } else {
        setDatos([]);
        showToast(data.error || "Error al cargar reporte valorizado", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error al cargar reporte valorizado", "error");
    }
  }, [showToast]);

  useEffect(() => {
    cargarReporte();
  }, [cargarReporte]);

  const totalEquipos = useMemo(
    () => datos.reduce((acc, item) => acc + Number(item.total_equipos || 0), 0),
    [datos]
  );

  const valorTotal = useMemo(
    () => datos.reduce((acc, item) => acc + Number(item.valor_inventario || 0), 0),
    [datos]
  );

  const exportarExcel = () => {
    if (datos.length === 0) {
      showToast("No hay datos para exportar", "warning");
      return;
    }

    const exportData = datos.map((item) => ({
      Ubicacion: item.ubicacion || "-",
      "Total equipos": Number(item.total_equipos || 0),
      "Valor inventario": Number(item.valor_inventario || 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 18 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Valorizado");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(archivo, "reporte_valorizado.xlsx");
  };

  return (
    <div>
      <span className="badge">Reporte valorizado</span>
      <h2>Reporte valorizado de inventario</h2>

      <div className="resumen-box">
        <strong>Total de equipos: {totalEquipos}</strong>
        <br />
        <strong>Valor total del inventario: ${valorTotal.toFixed(2)}</strong>
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
              <th>Ubicación</th>
              <th>Total equipos</th>
              <th>Valor inventario</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map((item, index) => (
                <tr key={index}>
                  <td>{item.ubicacion || "-"}</td>
                  <td>{item.total_equipos}</td>
                  <td>${Number(item.valor_inventario || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay datos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}