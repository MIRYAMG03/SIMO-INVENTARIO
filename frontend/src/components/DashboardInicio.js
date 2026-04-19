import { useEffect, useState } from "react";
import GraficaVentasEmpleado from "./GraficaVentasEmpleado";
import GraficaVentasDia from "./GraficaVentasDia";

export default function DashboardInicio() {
  const [datos, setDatos] = useState({
    totalEquipos: 0,
    enAlmacen: 0,
    enSucursales: 0,
    vendidos: 0,
    totalVentas: 0,
    totalComisiones: 0
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:3001/dashboard");
        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          alert(data.error || "Error al cargar dashboard");
          return;
        }

        setDatos(data);
      } catch (error) {
        console.error(error);
        alert("Error al cargar dashboard");
      }
    };

    cargar();
  }, []);

  return (
    <div>
      <h2>Panel principal</h2>
      <p>Resumen general del sistema</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total equipos</h3>
          <p>{datos.totalEquipos}</p>
        </div>

        <div className="dashboard-card">
          <h3>En almacén</h3>
          <p>{datos.enAlmacen}</p>
        </div>

        <div className="dashboard-card">
          <h3>En sucursales</h3>
          <p>{datos.enSucursales}</p>
        </div>

        <div className="dashboard-card">
          <h3>Vendidos</h3>
          <p>{datos.vendidos}</p>
        </div>

        <div className="dashboard-card money-card">
          <h3>Total vendido</h3>
          <p>${Number(datos.totalVentas).toFixed(2)}</p>
        </div>

        <div className="dashboard-card commission-card">
          <h3>Total comisiones</h3>
          <p>${Number(datos.totalComisiones).toFixed(2)}</p>
        </div>
      </div>

      <div className="grafica-box">
        <GraficaVentasEmpleado />
      </div>

      <div className="grafica-box">
        <GraficaVentasDia />
      </div>
    </div>
  );
}