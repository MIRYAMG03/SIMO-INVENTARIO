import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

export default function Catalogos() {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const { showToast } = useToast();

  const [nuevaMarca, setNuevaMarca] = useState("");
  const [nuevoProveedor, setNuevoProveedor] = useState("");
  const [nuevoModelo, setNuevoModelo] = useState({
    marca_id: "",
    nombre: ""
  });

  const cargarCatalogos = async () => {
    try {
      const [resMarcas, resModelos, resProveedores] = await Promise.all([
        fetch("http://localhost:3001/catalogos/marcas"),
        fetch("http://localhost:3001/catalogos/modelos"),
        fetch("http://localhost:3001/catalogos/proveedores")
      ]);

      const dataMarcas = await resMarcas.json();
      const dataModelos = await resModelos.json();
      const dataProveedores = await resProveedores.json();

      setMarcas(Array.isArray(dataMarcas) ? dataMarcas : []);
      setModelos(Array.isArray(dataModelos) ? dataModelos : []);
      setProveedores(Array.isArray(dataProveedores) ? dataProveedores : []);
    } catch (error) {
      console.error(error);
      showToast("Error al cargar catálogos", "error");
    }
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const agregarMarca = async () => {
    if (!nuevaMarca.trim()) {
      showToast("Ingresa el nombre de la marca", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/catalogos/marcas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nuevaMarca })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error al agregar marca", "error");
        return;
      }

      setNuevaMarca("");
      cargarCatalogos();
      showToast("Marca agregada correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast("Error al agregar marca", "error");
    }
  };

  const agregarProveedor = async () => {
    if (!nuevoProveedor.trim()) {
      showToast("Ingresa el nombre del proveedor", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/catalogos/proveedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nuevoProveedor })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error al agregar proveedor", "error");
        return;
      }

      setNuevoProveedor("");
      cargarCatalogos();
      showToast("Proveedor agregado correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast("Error al agregar proveedor", "error");
    }
  };

  const agregarModelo = async () => {
    if (!nuevoModelo.marca_id) {
      showToast("Selecciona una marca", "warning");
      return;
    }

    if (!nuevoModelo.nombre.trim()) {
      showToast("Ingresa el nombre del modelo", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/catalogos/modelos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoModelo)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error al agregar modelo", "error");
        return;
      }

      setNuevoModelo({
        marca_id: "",
        nombre: ""
      });

      cargarCatalogos();
      showToast("Modelo agregado correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast("Error al agregar modelo", "error")
    }
  };

  return (
    <div>
      <span className="badge">Catálogos</span>
      <h2>Administración de catálogos</h2>

      <div className="catalogos-grid">
        <div className="panel-soft">
          <h3>Marcas</h3>

          <div className="form-group">
            <label>Nueva marca</label>
            <input
              className="form-control"
              type="text"
              value={nuevaMarca}
              onChange={(e) => setNuevaMarca(e.target.value)}
              placeholder="Ej. Xiaomi"
            />
          </div>

          <button className="button-primary" type="button" onClick={agregarMarca}>
            Agregar marca
          </button>

          <div className="list-box">
            <strong>Lista de marcas</strong>
            <ul>
              {marcas.map((marca) => (
                <li key={marca.id}>
                  <span>{marca.nombre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel-soft">
          <h3>Proveedores</h3>

          <div className="form-group">
            <label>Nuevo proveedor</label>
            <input
              className="form-control"
              type="text"
              value={nuevoProveedor}
              onChange={(e) => setNuevoProveedor(e.target.value)}
              placeholder="Ej. CELULARES DE SONORA"
            />
          </div>

          <button className="button-primary" type="button" onClick={agregarProveedor}>
            Agregar proveedor
          </button>

          <div className="list-box">
            <strong>Lista de proveedores</strong>
            <ul>
              {proveedores.map((proveedor) => (
                <li key={proveedor.id}>
                  <span>{proveedor.nombre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px" }} className="panel-soft">
        <h3>Modelos</h3>

        <div className="filtros-grid">
          <div className="form-group">
            <label>Marca</label>
            <select
              className="form-control"
              value={nuevoModelo.marca_id}
              onChange={(e) =>
                setNuevoModelo({ ...nuevoModelo, marca_id: e.target.value })
              }
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
            <label>Nuevo modelo</label>
            <input
              className="form-control"
              type="text"
              value={nuevoModelo.nombre}
              onChange={(e) =>
                setNuevoModelo({ ...nuevoModelo, nombre: e.target.value })
              }
              placeholder="Ej. Redmi Note 13"
            />
          </div>
        </div>

        <button className="button-primary" type="button" onClick={agregarModelo}>
          Agregar modelo
        </button>

        <div className="list-box">
          <strong>Lista de modelos</strong>
          <ul>
            {modelos.map((modelo) => (
              <li key={modelo.id}>
                <span>
                  {modelo.marca} - {modelo.nombre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}