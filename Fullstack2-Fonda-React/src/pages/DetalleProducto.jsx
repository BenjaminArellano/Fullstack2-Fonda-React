import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../utils/DataService";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
} from "../utils/localstorageHelper";

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔹 Traer usuario logueado
  const usuarioLogueado = loadFromLocalstorage("usuarioLogueado");

  // 🔹 Validar si es vendedor
  const esVendedor =
    usuarioLogueado?.correo?.toLowerCase().endsWith("@vendedor.cl") ?? false;

  useEffect(() => {
    if (!id) {
      setCargando(false);
      return;
    }

    const fetchProducto = async () => {
      try {
        const data = await DataService.getProductoById(id);
        setProducto(data);
      } catch (error) {
      } finally {
        setCargando(false);
      }
    };

    fetchProducto();
  }, [id]);

  const agregarAlCarrito = () => {
    const carrito = loadFromLocalstorage("compra") || [];

    const productoExistente = carrito.find(
      (item) => item.prodId === producto.prodId
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    saveToLocalstorage("compra", carrito);
    alert(`${producto.nombreProducto} fue añadido al carrito`);
  };

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <h2>Cargando producto...</h2>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container text-center mt-5">
        <h2>Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="row text-center container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-9 bg-light rounded shadow p-4">
        <h1>{producto.nombreProducto}</h1>

        <p><strong>Categoría:</strong> {producto.categoria?.nombre}</p>
        <p><strong>Precio:</strong> {producto.precioProd} {producto.moneda}</p>
        <p><strong>Detalle:</strong> {producto.detalleProd}</p>

        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.nombreProducto}
            style={{ maxWidth: "400px" }}
          />
        )}

        {!esVendedor && (
          <div className="mt-4">
            <button className="btn btn-success" onClick={agregarAlCarrito}>
              Añadir al carrito
            </button>
          </div>
        )}

        {/* 🔹 SI ES VENDEDOR → mostrar mensaje */}
        {esVendedor && (
          <div className="mt-4">
            <span className="text-danger fw-bold">
              Los vendedores no pueden comprar productos.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleProducto;
