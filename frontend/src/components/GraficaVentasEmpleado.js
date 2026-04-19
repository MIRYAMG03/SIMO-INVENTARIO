import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Cell } from "recharts";

const colores = [
  "#2563eb", // azul
  "#16a34a", // verde
  "#f59e0b", // amarillo
  "#dc2626", // rojo
  "#7c3aed", // morado
  "#0ea5e9", // celeste
];


export default function GraficaVentasEmpleado() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargarGrafica = async () => {
      try {
        const res = await fetch("http://localhost:3001/graficas/ventas-empleado");
        const data = await res.json();

        if (Array.isArray(data)) {
          const datosFormateados = data.map((item) => ({
            empleado: item.empleado,
            total_vendido: Number(item.total_vendido),
            total_equipos: Number(item.total_equipos)
          }));

          setDatos(datosFormateados);
        } else {
          setDatos([]);
        }
      } catch (error) {
        console.error(error);
        alert("Error al cargar gráfica de ventas por empleado");
      }
    };

    cargarGrafica();
  }, []);

  return (
    <div>
      <h3>Ventas por empleado</h3>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="empleado" />
            <YAxis />
            <Tooltip />
            
            <Bar dataKey="total_vendido" name="Total vendido">
                {datos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}