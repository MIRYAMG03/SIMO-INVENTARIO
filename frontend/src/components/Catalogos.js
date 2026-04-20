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
        fetch(`${process.env.REACT_APP_API_URL}/catalogos/marcas`),
        fetch(`${process.env.REACT_APP_API_URL}/catalogos/modelos`),
        fetch(`${process.env.REACT_APP_API_URL}/catalogos/proveedores`)
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/catalogos/marcas`, {
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
      await cargarCatalogos();
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/catalogos/proveedores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nuevoProveedor })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar proveedor");
      }

      setNuevoProveedor("");
      await cargarCatalogos();
      showToast("Proveedor registrado correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al registrar proveedor", "error");
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/catalogos/modelos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          marca_id: nuevoModelo.marca_id,
          nombre: nuevoModelo.nombre
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar modelo");
      }

      setNuevoModelo({
        marca_id: "",
        nombre: ""
      });

      await cargarCatalogos();
      showToast("Modelo registrado correctamente", "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al registrar modelo", "error");
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