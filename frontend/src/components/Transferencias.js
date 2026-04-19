import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Transferencias() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [imeiInput, setImeiInput] = useState("");
  const [listaIMEIS, setListaIMEIS] = useState([]);

  const { showToast } = useToast();

  const sucursales = [
    "SIERRA MOVIL PINAL 1",
    "SIERRA MOVIL PINAL 2",
    "SIERRA MOVIL AHUACATLAN 1",
    "SIERRA MOVIL AHUACATLAN 2",
    "SIERRA MOVIL PLAZOLETA",
    "SIERRA MOVIL JALPAN",
    "SIERRA MOVIL MERCADO",
    "SIERRA MOVIL PUERTO",
    "SIERRA MOVIL PURISIMA",
    "SIERRA MOVIL CONCA",
    "SIERRA MOVIL ARROYO SECO",
    "SIERRA MOVIL LAGUNITA 1",
    "SIERRA MOVIL LAGUNITA 2",
    "SIERRA MOVIL XILITLA 1",
    "SIERRA MOVIL XILITLA 2",
    "SIERRA MOVIL MATLAPA 1",
    "SIERRA MOVIL MATLAPA 2",
    "SIERRA MOVIL HUICHI 1",
    "SIERRA MOVIL HUICHI 2",
    "SIERRA MOVIL MIMI",
    "SIERRA MOVIL TAMPAMOLON",
    "SIERRA MOVIL SANTOS"
  ];

  const handleScan = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const imei = imeiInput.trim();

      if (!/^\d{15}$/.test(imei)) {
        showToast("El IMEI debe tener 15 dígitos", "warning");
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

  const transferir = async () => {
    if (!origen) {
      showToast("Selecciona la sucursal origen", "warning");
      return;
    }

    if (!destino) {
      showToast("Selecciona la sucursal destino", "warning");
      return;
    }

    if (origen === destino) {
      showToast("La sucursal origen y destino no pueden ser la misma", "warning");
      return;
    }

    if (listaIMEIS.length === 0) {
      showToast("Escanea al menos un IMEI", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/transferencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          origen,
          destino,
          imeis: listaIMEIS
        })
      });

      const text = await res.text();
      console.log("RESPUESTA TRANSFERENCIAS:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        showToast("El servidor devolvió una respuesta no válida", "error");
        return;
      }

      if (!res.ok) {
        showToast(data.error || "Error al transferir", "error");
        return;
      }

      if (data.errores && data.errores.length > 0) {
        showToast("Algunos IMEIs no se transfirieron. Revisa consola.", "warning");
        console.log(data.errores);
      } else {
        showToast("Transferencia realizada correctamente", "success");
      }

      setOrigen("");
      setDestino("");
      setImeiInput("");
      setListaIMEIS([]);
    } catch (error) {
      console.error(error);
      showToast("Error al transferir equipos", "error");
    }
  };

  return (
    <div>
      <span className="badge">Transferencias</span>
      <h2>Transferencia entre sucursales</h2>

      <div className="form-group">
        <label>Sucursal origen</label>
        <select
          className="form-control"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        >
          <option value="">Selecciona sucursal origen</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal} value={sucursal}>
              {sucursal}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Sucursal destino</label>
        <select
          className="form-control"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        >
          <option value="">Selecciona sucursal destino</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal} value={sucursal}>
              {sucursal}
            </option>
          ))}
        </select>
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
        <strong>IMEIs listos para transferir: {listaIMEIS.length}</strong>
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

      <button className="button-primary" type="button" onClick={transferir}>
        Transferir equipos
      </button>
    </div>
  );
}