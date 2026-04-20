import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function GraficaVentasDia() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/graficas/ventas-dia`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const formateado = data.map((item) => ({
            fecha: item.fecha,
            total: Number(item.total_vendido)
          }));

          setDatos(formateado);
        } else {
          setDatos([]);
        }
      } catch (error) {
        console.error(error);
        alert("Error al cargar gráfica por día");
      }
    };

    cargar();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Ventas por día</h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}