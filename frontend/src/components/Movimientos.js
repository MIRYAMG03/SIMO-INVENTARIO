import { useState } from "react";
import { useToast } from "../context/ToastContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

export default function Movimientos() {
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
        showToast("IMEI duplicado", "warning");
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

  const generarPDF = (movidos, fecha, destino) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 35;
    const imgHeight = 35;
    const x = (pageWidth - imgWidth) / 2;

    doc.addImage(logo, "PNG", x, 10, imgWidth, imgHeight);

    doc.setFontSize(16);
    doc.text("SIMO - Movimiento de Equipos", pageWidth / 2, 55, {
      align: "center"
    });

    doc.setFontSize(11);
    doc.text(`Destino: ${destino}`, 14, 65);
    doc.text(`Fecha: ${new Date(fecha).toLocaleString()}`, 14, 72);

    autoTable(doc, {
      startY: 80,
      head: [["Equipo", "RAM", "ROM", "Color", "IMEI", "Pedido", "Precio"]],
      body: movidos.map((item) => [
        item.equipo || "-",
        item.ram || "-",
        item.rom || "-",
        item.color || "-",
        item.imei || "-",
        item.numero_pedido || "-",
        `$${Number(item.precio || 0).toFixed(2)}`
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`movimiento_${Date.now()}.pdf`);
  };

  const enviarEquipos = async () => {
    if (!destino) {
      showToast("Selecciona una sucursal", "warning");
      return;
    }

    if (listaIMEIS.length === 0) {
      showToast("Escanea al menos un IMEI", "warning");
      return;
    }

    const payload = {
      destino,
      imeis: listaIMEIS
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/movimientos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error en movimiento", "error");
        return;
      }

      if (data.movidos && data.movidos.length > 0) {
        generarPDF(data.movidos, data.fecha, destino);
      }

      if (data.errores && data.errores.length > 0) {
        showToast("Algunos IMEIs no se movieron", "warning");
        console.log(data.errores);
      } else {
        showToast("Equipos enviados correctamente", "success");
      }

      setDestino("");
      setListaIMEIS([]);
      setImeiInput("");

    } catch (error) {
      console.error(error);
      showToast("Error al enviar equipos", "error");
    }
  };

  return (
    <div>
      <span className="badge">Movimientos</span>
      <h2>Salida de equipos a sucursal</h2>

      <div className="form-group">
        <label>Sucursal destino</label>
        <select
          className="form-control"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        >
          <option value="">Selecciona sucursal</option>
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
          placeholder="Escanea IMEI y presiona Enter"
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
                onClick={() => eliminarIMEI(index)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <br />

      <button className="button-primary" onClick={enviarEquipos}>
        Enviar equipos
      </button>
    </div>
  );
}