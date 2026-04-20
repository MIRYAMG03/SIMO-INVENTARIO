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

    // Fondo superior
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 32, "F");

    // Logo
    const imgWidth = 28;
    const imgHeight = 28;
    const xLogo = 14;
    doc.addImage(logo, "PNG", xLogo, 2, imgWidth, imgHeight);

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SIERRA MOVIL", 48, 14);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Salida de equipos a sucursal", 48, 22);

    // Regresar color normal
    doc.setTextColor(0, 0, 0);

    // Caja de información
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, pageWidth - 28, 26, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Sucursal destino:", 20, 50);
    doc.text("Fecha:", 20, 58);

    doc.setFont("helvetica", "normal");
    doc.text(String(destino || "-"), 60, 50);
    doc.text(new Date(fecha).toLocaleString(), 60, 58);

    // Tabla
    autoTable(doc, {
      startY: 75,
      head: [["Equipo", "RAM", "ROM", "Color", "IMEI", "Pedido", "Precio"]],
      body: movidos.map((item) => [
        item.equipo || item.modelo || "-",
        item.ram || "-",
        item.rom || "-",
        item.color || "-",
        item.imei || "-",
        item.numero_pedido || "-",
        `$${Number(item.precio || 0).toFixed(2)}`
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle"
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14 }
    });

    // Totales
    const finalY = doc.lastAutoTable.finalY + 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Total de equipos: ${movidos.length}`, 14, finalY);

    // Área de firmas
    const firmaY = finalY + 28;

    doc.setDrawColor(120, 120, 120);
    doc.line(20, firmaY, 85, firmaY);
    doc.line(120, firmaY, 185, firmaY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Entrega", 46, firmaY + 6);
    doc.text("Recibe", 148, firmaY + 6);

    // Pie
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Documento generado automáticamente por SIMO.",
      14,
      firmaY + 20
    );

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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/movimientos/salida`, {
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