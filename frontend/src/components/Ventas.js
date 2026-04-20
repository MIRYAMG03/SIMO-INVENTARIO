import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Ventas() {
  const [form, setForm] = useState({
    imei: "",
    empleado: "",
    precio_venta: "",
    comision_venta: ""
  });

  const [empleados, setEmpleados] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("http://localhost:3001/empleados")
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const registrarVenta = async () => {
    const imei = form.imei.trim();

    if (!/^\d{15}$/.test(imei)) {
      showToast("IMEI inválido", "warning");
      return;
    }

    if (!form.empleado) {
      showToast("Selecciona un empleado", "warning");
      return;
    }

    if (!form.comision_venta) {
      showToast("Ingresa la comisión", "warning");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(res)
      })

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error al registrar venta", "error");
        return;
      }

      showToast("Venta registrada", "success");

      setForm({
        imei: "",
        empleado: "",
        precio_venta: "",
        comision_venta: ""
      });

    } catch (error) {
      console.error(error);
      showToast("Error en venta", "error");
    }
  };

  return (
    <div>
      <span className="badge">Ventas</span>
      <h2>Registrar venta</h2>

      <div className="form-group">
        <label>IMEI</label>
        <input
          className="form-control"
          name="imei"
          placeholder="Escanea IMEI"
          value={form.imei}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Empleado</label>
        <select
          className="form-control"
          name="empleado"
          value={form.empleado}
          onChange={handleChange}
        >
          <option value="">Selecciona empleado</option>
          {empleados.map(emp => (
            <option key={emp.id} value={emp.nombre}>
              {emp.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Precio venta</label>
        <input
          className="form-control"
          type="number"
          name="precio_venta"
          value={form.precio_venta}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Comisión</label>
        <input
          className="form-control"
          type="number"
          name="comision_venta"
          value={form.comision_venta}
          onChange={handleChange}
        />
      </div>

      <button className="button-primary" onClick={registrarVenta}>
        Registrar venta
      </button>
    </div>
  );
}