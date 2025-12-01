import React, { useEffect, useState } from "react";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
  removeFromLocalstorage,
} from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import DataService from "../utils/DataService";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    const precio = prod.precio ?? prod.precioProd ?? prod.precioOferta ?? 0;
    return acum + precio * prod.cantidad;
  }, 0);

  const totalConDescuento = tieneDescuentoDuoc
    ? totalSinDescuento * 0.8
    : totalSinDescuento;

  const totalUSD = (totalConDescuento / 950).toFixed(2);

  // Función para crear boleta en BD
  const crearBoletaEnBD = async (paypalDetails) => {
    try {
      setProcesandoPago(true);
      
      // Crear boleta
      const boletaData = {
        cliente: usuario.nombreCompleto || "Cliente",
        rut: usuario.rut || "Sin RUT",
        total: Math.round(totalConDescuento),
        estado: "Pagado",
        usuario: { usuId: usuario.usuId }
      };
      
      const boletaCreada = await DataService.addBoleta(boletaData);

      if (!boletaCreada.boletaId) {
        throw new Error("No se recibió ID de boleta desde el servidor");
      }

      // Crear detalles de boleta
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
        
        try {
          const detalleCreado = await DataService.addDetalleBoleta(detalleData);
          detallesCreados.push(detalleCreado);
          
          // Actualizar stock
          try {
            const productoActual = await DataService.getProductoById(productoId);
            if (productoActual) {
              const nuevoStock = productoActual.stock - producto.cantidad;
              await DataService.updateProducto({
                ...productoActual,
                stock: Math.max(0, nuevoStock)
              });
            }
          } catch (stockError) {
            console.warn("No se pudo actualizar stock:", stockError);
          }
          
        } catch (detalleError) {
          console.error("Error al crear detalle:", detalleError);
        }
      }

      // Limpiar carrito
      removeFromLocalstorage("compra");
      setCarrito([]);
      
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "2rem 0"
    }}>
      {/* Header del carrito */}
      <div style={{
        background: "linear-gradient(135deg, #4D96FF, #0033A0)",
        color: "white",
        padding: "2rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(0, 51, 160, 0.3)"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <h1 className="display-4 fw-bold mb-3" style={{
                background: "linear-gradient(to right, #FFD700, #FFFFFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                <i className="bi bi-cart3 me-3"></i>
                Mi Carrito
              </h1>
              
              <p className="lead mb-4" style={{
                fontSize: "1.2rem",
                opacity: 0.95,
                maxWidth: "700px",
                margin: "0 auto",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                borderRadius: "15px",
                backdropFilter: "blur(5px)"
              }}>
                Revisa tus productos antes de realizar el pago
              </p>
              
              <div className="d-flex align-items-center justify-content-center gap-4">
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-box-seam me-2"></i>
                  <strong>{carrito.length}</strong> productos
                </div>
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-cash-coin me-2"></i>
                  Total: <strong>${totalConDescuento.toLocaleString("es-CL")}</strong> CLP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container">
        {procesandoPago && (
          <div className="alert border-0 shadow-sm mb-4" style={{
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#0033A0",
            borderRadius: "15px",
            border: "3px solid #0033A0"
          }}>
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-3" role="status"></div>
              <div>
                <strong>Procesando pago...</strong>
                <p className="mb-0">Estamos generando tu boleta y procesando el pago</p>
              </div>
            </div>
          </div>
        )}

        {!token ? (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: "4rem" }}></div>
            <h3 style={{ color: "#0033A0" }}>Inicia sesión para acceder al carrito</h3>
            <p className="text-muted mb-4">Necesitas estar registrado para realizar compras</p>
            <button 
              className="btn btn-lg"
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "#0033A0",
                border: "2px solid #0033A0",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(255, 215, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </button>
          </div>
        ) : carrito.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: "5rem" }}></div>
            <h3 style={{ color: "#0033A0" }}>Tu carrito está vacío</h3>
            <p className="text-muted mb-4">Agrega productos para comenzar tu compra</p>
            <button 
              className="btn btn-lg"
              onClick={() => navigate("/productos")}
              style={{
                background: "linear-gradient(135deg, #4D96FF, #0033A0)",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(77, 150, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <i className="bi bi-shop me-2"></i>
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="row">
            {/* Lista de productos */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0" style={{ color: "#0033A0" }}>
                      <i className="bi bi-basket me-2"></i>
                      Productos en el carrito
                    </h4>
                    <button 
                      className="btn btn-sm"
                      onClick={vaciarCarrito}
                      disabled={procesandoPago}
                      style={{
                        background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "20px",
                        fontWeight: "500"
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Vaciar carrito
                    </button>
                  </div>
                  
                  <div className="list-group">
                    {carrito.map((producto, index) => {
                      const precio = producto.precio ?? producto.precioProd ?? producto.precioOferta ?? 0;
                      const nombre = producto.nombreProducto || producto.nombreOferta || producto.nombre || "Producto";
                      const id = producto.prodId || producto.ofertaId || index;
                      const subtotal = precio * producto.cantidad;

                      return (
                        <div 
                          key={id}
                          className="list-group-item border-0 mb-3"
                          style={{
                            borderRadius: "15px",
                            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
                            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
                            transition: "transform 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <div className="row align-items-center">
                            <div className="col-3 col-md-2">
                              {producto.imagen ? (
                                <img 
                                  src={producto.imagen} 
                                  alt={nombre} 
                                  className="img-fluid rounded"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover"
                                  }}
                                />
                              ) : (
                                <div className="bg-light rounded d-flex align-items-center justify-content-center"
                                  style={{ width: "80px", height: "80px" }}>
                                  <i className="bi bi-image text-muted" style={{ fontSize: "1.5rem" }}></i>
                                </div>
                              )}
                            </div>
                            
                            <div className="col-5 col-md-6">
                              <h6 className="mb-1" style={{ color: "#374850", fontWeight: "600" }}>
                                {nombre}
                              </h6>
                              <p className="mb-1 text-muted" style={{ fontSize: "0.9rem" }}>
                                ${Number(precio).toLocaleString("es-CL")} CLP c/u
                              </p>
                              <div className="d-flex align-items-center gap-2 mt-2">
                                <button 
                                  className="btn btn-sm"
                                  onClick={() => disminuirCantidad(index)}
                                  disabled={procesandoPago}
                                  style={{
                                    background: "#FF6B6B",
                                    color: "white",
                                    border: "none",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                
                                <span className="mx-2" style={{ 
                                  fontWeight: "600",
                                  minWidth: "30px",
                                  textAlign: "center"
                                }}>
                                  {producto.cantidad}
                                </span>
                                
                                <button 
                                  className="btn btn-sm"
                                  onClick={() => aumentarCantidad(index)}
                                  disabled={procesandoPago}
                                  style={{
                                    background: "#2ED573",
                                    color: "white",
                                    border: "none",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                            
                            <div className="col-4 col-md-3 text-end">
                              <div className="mb-1" style={{ 
                                color: "#0033A0",
                                fontWeight: "700",
                                fontSize: "1.1rem"
                              }}>
                                ${subtotal.toLocaleString("es-CL")}
                              </div>
                              <small className="text-muted">Subtotal</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen y pago */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ 
                borderRadius: "20px",
                top: "20px"
              }}>
                <div className="card-body p-4">
                  <h4 className="mb-4" style={{ color: "#0033A0" }}>
                    <i className="bi bi-receipt me-2"></i>
                    Resumen del pedido
                  </h4>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${totalSinDescuento.toLocaleString("es-CL")} CLP</span>
                    </div>
                    
                    {tieneDescuentoDuoc && (
                      <>
                        <div className="d-flex justify-content-between mb-2" style={{ color: "#2ED573" }}>
                          <span>
                            <i className="bi bi-award-fill me-1"></i>
                            Descuento DUOC (20%):
                          </span>
                          <span>-${(totalSinDescuento * 0.2).toLocaleString("es-CL")} CLP</span>
                        </div>
                        <div className="alert alert-success border-0 py-2" style={{
                          background: "rgba(46, 213, 115, 0.1)",
                          borderRadius: "10px",
                          fontSize: "0.9rem"
                        }}>
                          <i className="bi bi-patch-check-fill me-1"></i>
                          Descuento especial para estudiantes DUOC
                        </div>
                      </>
                    )}
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <strong>Total a pagar:</strong>
                      <div className="text-end">
                        <h3 className="mb-0" style={{ color: "#0033A0" }}>
                          ${totalConDescuento.toLocaleString("es-CL")} CLP
                        </h3>
                        <small className="text-muted">
                          ≈ ${totalUSD} USD
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="mb-3" style={{ color: "#0033A0" }}>
                      <i className="bi bi-credit-card me-2"></i>
                      Método de pago
                    </h5>
                    
                    <div className="mt-3">
                      <PayPalButtons
                        style={{ 
                          layout: "vertical", 
                          color: "blue", 
                          shape: "rect",
                          label: "paypal",
                          tagline: false
                        }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: { 
                                value: totalUSD, 
                                currency_code: "USD" 
                              }
                            }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          try {
                            const details = await actions.order.capture();
                            const resultadoBoleta = await crearBoletaEnBD(details);
                            
                            removeFromLocalstorage("compra");
                            setCarrito([]);
                            
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
                    
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        <i className="bi bi-shield-check me-1"></i>
                        Pago 100% seguro con PayPal
                      </small>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top">
                    <button 
                      className="btn w-100"
                      onClick={() => navigate("/productos")}
                      disabled={procesandoPago}
                      style={{
                        background: "linear-gradient(135deg, #FFD700, #FFA500)",
                        color: "#0033A0",
                        border: "2px solid #0033A0",
                        padding: "0.75rem",
                        borderRadius: "15px",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Seguir comprando
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS inline */}
      <style>{`
        .list-group-item {
          transition: transform 0.2s ease;
        }
        
        .sticky-top {
          position: sticky;
        }
        
        @media (max-width: 768px) {
          .sticky-top {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}

export default Carrito;