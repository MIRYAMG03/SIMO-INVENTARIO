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

export default function GraficaVentas() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/graficas/ventas-dia`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setDatos(data);
        } else {
          setDatos([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    cargar();
  }, []);

  return (
    <div className="grafica-box">
      <h3>Ventas por día</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_vendido" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}