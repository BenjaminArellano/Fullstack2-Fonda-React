import { useEffect, useState } from "react";
import Producto from "../components/Producto";
import DataService from "../utils/DataService";

function Categorias() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Cargar categorías
  useEffect(() => {
    DataService.getCategorias()
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // Cargar productos
  useEffect(() => {
    DataService.getProductos()
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div className="container mt-3">
      <h1 className="text-center">Categorías</h1>

      {/* Select Categorías */}
      <div className="mb-3">
        <label className="form-label">Filtrar por categoría:</label>

        <select
          className="form-select"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas</option>

          {categorias.map((cat) => (
            <option key={cat.catId ?? cat.id} value={cat.catId ?? cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Productos filtrados */}
      <div className="row">
        {productos
          .filter((p) => {
            if (!categoriaSeleccionada) return true;
            const catId = Number(categoriaSeleccionada);
            return (
              (p.categoria && (p.categoria.catId === catId || p.categoria.id === catId))
            );
          })
          .map((producto) => (
            <div className="col-md-4 mb-3" key={producto.prodId}>
              <Producto
                codigo={producto.prodId}
                nombre={producto.nombreProducto}
                precio={producto.precioProd}
                moneda={producto.moneda}
                imagen={producto.imagen}
                categoria={producto.categoria?.nombre}
                detalle={producto.detalleProd}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Categorias;
