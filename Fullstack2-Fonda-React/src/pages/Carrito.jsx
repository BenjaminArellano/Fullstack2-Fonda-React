import React, { useEffect, useState } from "react";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
  removeFromLocalstorage,
} from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import DataService from "../utils/DataService";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const navigate = useNavigate();
  const token = loadFromLocalstorage("token");
  const usuario = loadFromLocalstorage("usuarioLogueado");

  useEffect(() => {
    const productosGuardados = loadFromLocalstorage("compra") || [];
    setCarrito(productosGuardados);
  }, []);

  const debugCarrito = () => {
  console.log("🛒 DEBUG - Productos en carrito:");
  carrito.forEach((producto, index) => {
    console.log(`Producto ${index + 1}:`, {
      id: producto.id,
      prodId: producto.prodId,
      nombre: producto.nombreProducto || producto.nombreOferta || producto.nombre,
      precio: producto.precio || producto.precioProd || producto.precioOferta,
      cantidad: producto.cantidad
    });
  });
};

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
    if (window.confirm("Seguro que deseas vaciar el carrito?")) {
      removeFromLocalstorage("compra");
      setCarrito([]);
    }
  };

  const tieneDescuentoDuoc = usuario?.correo
    ?.toLowerCase()
    .trim()
    .endsWith("@duocuc.cl");

  const totalSinDescuento = carrito.reduce((acum, prod) => {
    const precio = prod.precio ?? prod.precioProd ?? prod.precioOferta ?? 0;
    return acum + precio * prod.cantidad;
  }, 0);

  const totalConDescuento = tieneDescuentoDuoc
    ? totalSinDescuento * 0.8
    : totalSinDescuento;

  const totalUSD = (totalConDescuento / 950).toFixed(2);

  // FUNCIÓN SIMPLIFICADA AL MÁXIMO - SOLO CREA BOLETA BÁSICA
  const crearBoletaEnBD = async (paypalDetails) => {
  try {
    setProcesandoPago(true);
    
    console.log("Productos en carrito:", carrito);

    // Crear boleta
    const boletaData = {
      cliente: usuario.nombreCompleto || "Cliente",
      rut: usuario.rut || "Sin RUT",
      total: Math.round(totalConDescuento),
      estado: "Pagado",
      usuario: { usuId: usuario.usuId }
    };

    console.log("Enviando boleta a la BD:", boletaData);
    
    const boletaCreada = await DataService.addBoleta(boletaData);
    console.log("Boleta creada exitosamente:", boletaCreada);

    if (!boletaCreada.boletaId) {
      throw new Error("No se recibió ID de boleta desde el servidor");
    }

    console.log("ID de boleta creada:", boletaCreada.boletaId);

    // Crear detalles de boleta - AHORA DEBERÍA FUNCIONAR
    const detallesCreados = [];
    
    for (const producto of carrito) {
      const precioUnitario = producto.precio ?? producto.precioProd ?? producto.precioOferta ?? 0;
      const productoId = producto.prodId || producto.id;
      
      if (!productoId) {
        console.warn("Producto sin ID:", producto);
        continue;
      }

      const detalleData = {
        cantidad: producto.cantidad,
        precioUnitario: Math.round(precioUnitario),
        boleta: {
          boletaId: boletaCreada.boletaId
        },
        producto: {
          prodId: productoId
        }
      };

      console.log("Enviando detalle:", detalleData);
      
      try {
        const detalleCreado = await DataService.addDetalleBoleta(detalleData);
        detallesCreados.push(detalleCreado);
        console.log("Detalle creado:", detalleCreado);
        
        // Actualizar stock
        try {
          const productoActual = await DataService.getProductoById(productoId);
          if (productoActual) {
            const nuevoStock = productoActual.stock - producto.cantidad;
            await DataService.updateProducto({
              ...productoActual,
              stock: Math.max(0, nuevoStock)
            });
            console.log(`Stock actualizado: ${productoActual.nombreProducto} -> ${nuevoStock}`);
          }
        } catch (stockError) {
          console.warn("No se pudo actualizar stock:", stockError);
        }
        
      } catch (detalleError) {
        console.error("Error al crear detalle:", detalleError);
        // Continuar con los siguientes productos
      }
    }

    console.log(`Detalles creados: ${detallesCreados.length} de ${carrito.length}`);

    // Limpiar carrito
    removeFromLocalstorage("compra");
    setCarrito([]);
    
    console.log("Proceso completado. Boleta:", boletaCreada.numero);
    
    return {
      boleta: boletaCreada,
      detalles: detallesCreados
    };

  } catch (error) {
    console.error("Error al crear boleta:", error);
    alert(`Error: ${error.message}`);
    throw error;
  } finally {
    setProcesandoPago(false);
  }
};

  return (
    <div className="row text-center container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "white",
        border: "4px solid grey",
        borderRadius: "10px",
      }}>
      <div className="col-md-9 bg-info rounded shadow p-4">
        <h1>Carrito de Compras</h1>
        <hr />

        {procesandoPago && (
          <div className="alert alert-warning">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Procesando pago y generando boleta...
          </div>
        )}

        {token ? (
          carrito.length === 0 ? (
            <p className="mt-4">Tu carrito esta vacio</p>
          ) : (
            <>
              <ul className="list-group mb-4">
                {carrito.map((producto, index) => {
                  const precio = producto.precio ?? producto.precioProd ?? producto.precioOferta ?? 0;
                  const nombre = producto.nombreProducto || producto.nombreOferta || producto.nombre || "Producto";
                  const id = producto.prodId || producto.ofertaId || index;

                  return (
                    <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{nombre}</strong>
                        <br />
                        <small>
                          {Number(precio).toLocaleString("es-CL")} CLP x {producto.cantidad}
                        </small>
                        <div className="mt-2">
                          <button className="btn btn-sm btn-danger me-2" onClick={() => disminuirCantidad(index)} disabled={procesandoPago}>-</button>
                          <button className="btn btn-sm btn-success" onClick={() => aumentarCantidad(index)} disabled={procesandoPago}>+</button>
                        </div>
                      </div>
                      <span>Subtotal: {(precio * producto.cantidad).toLocaleString("es-CL")} CLP</span>
                      {producto.imagen && (
                        <img src={producto.imagen} alt={nombre} style={{ width: "60px", borderRadius: "8px" }} />
                      )}
                    </li>
                  );
                })}
              </ul>

              {tieneDescuentoDuoc && (
                <>
                  <div className="alert alert-success">Descuento DUOC UC aplicado: -20%</div>
                  <h4 style={{ color: "gray", textDecoration: "line-through" }}>
                    Total original: {totalSinDescuento.toLocaleString("es-CL")} CLP
                  </h4>
                </>
              )}

              <h3 className="mb-3">Total a pagar: <strong>{totalConDescuento.toLocaleString("es-CL")} CLP</strong></h3>
              <h5>Total en USD para PayPal: <strong>${totalUSD}</strong></h5>

              <button className="btn btn-danger" onClick={vaciarCarrito} disabled={procesandoPago}>
                Vaciar carrito
              </button>

              <div className="mt-4">
                <h4>Pagar con PayPal</h4>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: totalUSD, currency_code: "USD" }
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      console.log("Iniciando proceso de pago...");
                      const details = await actions.order.capture();
                      console.log("Pago completado con PayPal:", details);
                      
                      console.log("Creando boleta en la base de datos...");
                      const resultadoBoleta = await crearBoletaEnBD(details);
                      
                      removeFromLocalstorage("compra");
                      setCarrito([]);
                      
                      console.log("Boleta creada exitosamente:", resultadoBoleta.boleta.numero);
                      
                      navigate("/pago_logrado", { 
                        state: { 
                          boletaNumero: resultadoBoleta.boleta.numero,
                          total: totalConDescuento,
                          fecha: new Date().toLocaleDateString('es-CL')
                        } 
                      });
                      
                    } catch (error) {
                      console.error("Error en el proceso de pago:", error);
                      alert(`Error: ${error.message}`);
                    }
                  }}
                  onCancel={() => {
                    console.log("Pago cancelado por el usuario");
                    navigate("/pago_fallido");
                  }}
                  onError={(err) => {
                    console.error("Error de PayPal:", err);
                    alert("Error con PayPal. Por favor, intenta nuevamente.");
                  }}
                  disabled={procesandoPago}
                />
              </div>
            </>
          )
        ) : (
          <div>
            <h2>Debe iniciar sesion para poder ingresar al carrito</h2>
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Ir a iniciar sesion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;