import React, { useEffect, useState } from "react";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
  removeFromLocalstorage,
} from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();
  const token = loadFromLocalstorage("token");
  const usuario = loadFromLocalstorage("usuarioLogueado");

  useEffect(() => {
    const productosGuardados = loadFromLocalstorage("compra") || [];
    setCarrito(productosGuardados);
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    saveToLocalstorage("compra", nuevoCarrito);
  };

  const aumentarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad += 1;
    actualizarCarrito(nuevoCarrito);
  };

  const disminuirCantidad = (index) => {
    const nuevoCarrito = [...carrito];

    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad -= 1;
    } else {
      nuevoCarrito.splice(index, 1);
    }

    actualizarCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    if (window.confirm("¿Seguro que deseas vaciar el carrito?")) {
      removeFromLocalstorage("compra");
      setCarrito([]);
    }
  };

  const tieneDescuentoDuoc = usuario?.correo
    ?.toLowerCase()
    .trim()
    .endsWith("@duocuc.cl");

  const totalSinDescuento = carrito.reduce((acum, prod) => {
    const precio =
      prod.precio ??
      prod.precioProd ??
      prod.precioOferta ??
      0;

    return acum + precio * prod.cantidad;
  }, 0);

  const totalConDescuento = tieneDescuentoDuoc
    ? totalSinDescuento * 0.8
    : totalSinDescuento;

  return (
    <div
      className="row text-center container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "white",
        border: "4px solid grey",
        borderRadius: "10px",
      }}
    >
      <div className="col-md-9 bg-info rounded shadow p-4">
        <h1>Carrito de Compras</h1>
        <hr />

        {token ? (
          carrito.length === 0 ? (
            <p className="mt-4">Tu carrito está vacío</p>
          ) : (
            <>
              <ul className="list-group mb-4">
                {carrito.map((producto, index) => {
                  const precio =
                    producto.precio ??
                    producto.precioProd ??
                    producto.precioOferta ??
                    0;

                  const nombre =
                    producto.nombreProducto ||
                    producto.nombreOferta ||
                    producto.nombre ||
                    "Producto";

                  const id =
                    producto.prodId ||
                    producto.ofertaId ||
                    index;

                  return (
                    <li
                      key={id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{nombre}</strong>
                        <br />
                        <small>
                          {Number(precio).toLocaleString("es-CL")} CLP x{" "}
                          {producto.cantidad}
                        </small>

                        <div className="mt-2">
                          <button
                            className="btn btn-sm btn-danger me-2"
                            onClick={() => disminuirCantidad(index)}
                          >
                            -
                          </button>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => aumentarCantidad(index)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <span>
                        Subtotal:{" "}
                        {(precio * producto.cantidad).toLocaleString("es-CL")} CLP
                      </span>

                      {producto.imagen && (
                        <img
                          src={producto.imagen}
                          alt={nombre}
                          style={{ width: "60px", borderRadius: "8px" }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              {tieneDescuentoDuoc && (
                <div className="alert alert-success">
                  Descuento DUOC UC aplicado: -20%
                </div>
              )}

              {tieneDescuentoDuoc && (
                <h4 style={{ color: "gray", textDecoration: "line-through" }}>
                  Total original: {totalSinDescuento.toLocaleString("es-CL")} CLP
                </h4>
              )}

              <h3 className="mb-3">
                Total a pagar:{" "}
                <strong>{totalConDescuento.toLocaleString("es-CL")} CLP</strong>
              </h3>

              <button className="btn btn-danger" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>

              <button
                className="btn btn-success m-4"
                onClick={() => navigate("/SimulacionPago")}
              >
                Comprar
              </button>
            </>
          )
        ) : (
          <div>
            <h2>Debe iniciar sesión para poder ingresar al carrito</h2>
            <p className="text-center">
              Presione el botón para ir a iniciar sesión
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
