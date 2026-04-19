import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";

export default function RegistrarEquipos() {
  const [form, setForm] = useState({
    marca_id: "",
    modelo_id: "",
    tipo: "Celular",
    proveedor: "",
    numero_pedido: "",
    precio: "",
    ram: "",
    rom: "",
    color: ""
  });

  const { showToast } = useToast();

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [imeiInput, setImeiInput] = useState("");
  const [listaIMEIS, setListaIMEIS] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/catalogos/marcas")
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch((err) => console.error(err));
  }, []);

  const handleMarcaChange = (e) => {
    const marca_id = e.target.value;

    setForm((prev) => ({
      ...prev,
      marca_id,
      modelo_id: ""
    }));

    if (!marca_id) {
      setModelos([]);
      return;
    }

    fetch(`http://localhost:3001/catalogos/modelos/${marca_id}`)
      .then((res) => res.json())
      .then((data) => setModelos(data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const imei = imeiInput.trim();

      if (!/^\d{15}$/.test(imei)) {
        showToast("El IMEI debe tener exactamente 15 dígitos", "warning");
        return;
      }

      if (listaIMEIS.includes(imei)) {
        showToast("IMEI duplicado en la lista", "warning");
        setImeiInput("");
        return;
      }

      setListaIMEIS((prev) => [...prev, imei]);
      setImeiInput("");
    }
  };

  const eliminarIMEI = (index) => {
    setListaIMEIS((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.marca_id || !form.modelo_id) {
      showToast("Selecciona marca y modelo", "warning");
      return;
    }

    if (!form.proveedor.trim()) {
      showToast("Ingresa el proveedor", "warning");
      return;
    }

    if (!form.numero_pedido.trim()) {
      showToast("Ingresa el número de pedido", "warning");
      return;
    }

    if (!form.precio) {
      showToast("Ingresa el precio", "warning");
      return;
    }

    if (!form.ram.trim()) {
      showToast("Ingresa la RAM", "warning");
      return;
    }

    if (!form.rom.trim()) {
      showToast("Ingresa la ROM", "warning");
      return;
    }

    if (!form.color.trim()) {
      showToast("Ingresa el color", "warning");
      return;
    }

    if (listaIMEIS.length === 0) {
      showToast("Escanea al menos un IMEI", "warning");
      return;
    }

    const payload = {
      ...form,
      imeis: listaIMEIS
    };

    try {
      const res = await fetch("http://localhost:3001/equipos/lote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.errores && result.errores.length > 0) {
        showToast("Algunos IMEIs no se registraron", "warning");
        console.log(result.errores);
      } else {
        showToast("Equipos registrados correctamente", "success");
      }

      setForm({
        marca_id: "",
        modelo_id: "",
        tipo: "Celular",
        proveedor: "",
        numero_pedido: "",
        precio: "",
        ram: "",
        rom: "",
        color: ""
      });

      setModelos([]);
      setImeiInput("");
      setListaIMEIS([]);
    } catch (error) {
      console.error(error);
      showToast("Error al registrar equipos", "error");
    }
  };

  return (
    <div>
      <span className="badge">Entradas a almacén</span>
      <h2>Registrar equipos</h2>

      <div className="form-group">
        <label>Marca</label>
        <select
          className="form-control"
          value={form.marca_id}
          onChange={handleMarcaChange}
        >
          <option value="">Selecciona marca</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Modelo</label>
        <select
          className="form-control"
          value={form.modelo_id}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              modelo_id: e.target.value
            }))
          }
        >
          <option value="">Selecciona modelo</option>
          {modelos.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>
              {modelo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="filtros-grid">
        <div className="form-group">
          <label>RAM</label>
          <input
            className="form-control"
            type="text"
            name="ram"
            value={form.ram}
            onChange={handleChange}
            placeholder="Ej. 4 GB"
          />
        </div>

        <div className="form-group">
          <label>ROM</label>
          <input
            className="form-control"
            type="text"
            name="rom"
            value={form.rom}
            onChange={handleChange}
            placeholder="Ej. 128 GB"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Color</label>
        <input
          className="form-control"
          type="text"
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Ej. Negro"
        />
      </div>

      <div className="form-group">
        <label>Proveedor</label>
        <input
          className="form-control"
          type="text"
          name="proveedor"
          value={form.proveedor}
          onChange={handleChange}
          placeholder="Proveedor"
        />
      </div>

      <div className="form-group">
        <label>Número de pedido</label>
        <input
          className="form-control"
          type="text"
          name="numero_pedido"
          value={form.numero_pedido}
          onChange={handleChange}
          placeholder="Número de pedido"
        />
      </div>

      <div className="form-group">
        <label>Precio</label>
        <input
          className="form-control"
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          placeholder="Precio"
        />
      </div>

      <div className="form-group">
        <label>Escanear IMEI</label>
        <input
          className="form-control"
          type="text"
          value={imeiInput}
          onChange={(e) => setImeiInput(e.target.value)}
          onKeyDown={handleScan}
          placeholder="Escanea el IMEI y presiona Enter"
        />
      </div>

      <div className="list-box">
        <strong>IMEIs escaneados: {listaIMEIS.length}</strong>
        <ul>
          {listaIMEIS.map((imei, index) => (
            <li key={index}>
              <span>{imei}</span>
              <button
                className="button-danger"
                type="button"
                onClick={() => eliminarIMEI(index)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <br />

      <button className="button-primary" type="button" onClick={handleSubmit}>
        Guardar equipos
      </button>
    </div>
  );
}