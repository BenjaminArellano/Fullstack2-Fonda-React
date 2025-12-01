import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../utils/DataService";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
} from "../utils/localstorageHelper";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [agregado, setAgregado] = useState(false);
  
  const usuarioLogueado = loadFromLocalstorage("usuarioLogueado");
  const esVendedor = usuarioLogueado?.correo?.toLowerCase().endsWith("@vendedor.cl") ?? false;

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
        console.error("Error cargando producto:", error);
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
    setAgregado(true);
    
    setTimeout(() => setAgregado(false), 2000);
  };

  if (cargando) {
    return (
      <div className="container text-center py-5" style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="text-center">
          <div className="spinner-border" style={{
            width: "3rem",
            height: "3rem",
            color: "#4D96FF"
          }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h3 className="mt-3" style={{ color: "#0033A0" }}>Cargando producto...</h3>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <div className="mb-4" style={{ fontSize: "5rem" }}>😢</div>
        <h3 style={{ color: "#0033A0" }}>Producto no encontrado</h3>
        <p className="text-muted mb-4">El producto que buscas no está disponible</p>
        <button 
          className="btn"
          onClick={() => navigate("/productos")}
          style={{
            background: "linear-gradient(135deg, #4D96FF, #0033A0)",
            color: "white",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "25px",
            fontWeight: "600"
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a productos
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
      padding: "2rem 0"
    }}>
      {/* Header del producto */}
      <div style={{
        background: "linear-gradient(135deg, #4D96FF, #0033A0)",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(0, 51, 160, 0.3)"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <h1 className="display-5 fw-bold mb-3" style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                {producto.nombreProducto}
              </h1>
              
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mb-3">
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-tags-fill me-2"></i>
                  {producto.categoria?.nombre || "Sin categoría"}
                </div>
                
                {producto.stock !== undefined && (
                  <div style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "25px",
                    backdropFilter: "blur(5px)"
                  }}>
                    <i className="bi bi-box-seam me-2"></i>
                    Stock: {producto.stock} unidades
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: "25px",
              overflow: "hidden"
            }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Columna de imagen */}
                  <div className="col-12 col-md-6">
                    <div style={{
                      height: "100%",
                      minHeight: "400px",
                      background: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2rem",
                      position: "relative"
                    }}>
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombreProducto}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "350px",
                            objectFit: "contain",
                            borderRadius: "15px",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <div className="mb-3" style={{ fontSize: "4rem" }}>📦</div>
                          <p className="text-muted">Imagen no disponible</p>
                        </div>
                      )}
                      
                      {/* Etiqueta de stock */}
                      {producto.stock !== undefined && producto.stock <= 5 && producto.stock > 0 && (
                        <div style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          background: "linear-gradient(135deg, #FFD700, #FFA500)",
                          color: "#333",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          boxShadow: "0 3px 10px rgba(255, 215, 0, 0.3)"
                        }}>
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>
                          ¡Últimas {producto.stock} unidades!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna de detalles */}
                  <div className="col-12 col-md-6">
                    <div style={{ padding: "3rem" }}>
                      {/* Precio */}
                      <div className="mb-4">
                        <small className="text-muted d-block mb-1">Precio</small>
                        <div className="d-flex align-items-center gap-3">
                          <span style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            color: "#0033A0"
                          }}>
                            ${producto.precioProd} {producto.moneda}
                          </span>
                          
                          {esVendedor && (
                            <span className="badge" style={{
                              background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
                              color: "white",
                              padding: "0.5rem 1rem",
                              borderRadius: "20px",
                              fontSize: "0.9rem"
                            }}>
                              Precio de venta
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detalles del producto */}
                      <div className="mb-4">
                        <h4 style={{ 
                          color: "#374850",
                          marginBottom: "1rem",
                          borderBottom: "2px solid #4D96FF",
                          paddingBottom: "0.5rem"
                        }}>
                          <i className="bi bi-info-circle-fill me-2"></i>
                          Descripción del producto
                        </h4>
                        <p style={{
                          fontSize: "1.1rem",
                          lineHeight: "1.7",
                          color: "#495057"
                        }}>
                          {producto.detalleProd || "Producto de alta calidad con el sello característico de La Fonda Más Prendida."}
                        </p>
                      </div>

                      {/* Información adicional */}
                      <div className="mb-5">
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="card border-0 h-100" style={{
                              background: "rgba(255, 215, 0, 0.1)",
                              borderRadius: "15px",
                              padding: "1rem"
                            }}>
                              <div className="text-center">
                                <div className="mb-2">
                                  <i className="bi bi-award-fill" style={{ 
                                    fontSize: "1.5rem",
                                    color: "#FFD700"
                                  }}></i>
                                </div>
                                <small style={{ color: "#333", fontWeight: "600" }}>
                                  Calidad garantizada
                                </small>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-6">
                            <div className="card border-0 h-100" style={{
                              background: "rgba(46, 213, 115, 0.1)",
                              borderRadius: "15px",
                              padding: "1rem"
                            }}>
                              <div className="text-center">
                                <div className="mb-2">
                                  <i className="bi bi-lightning-charge-fill" style={{ 
                                    fontSize: "1.5rem",
                                    color: "#2ED573"
                                  }}></i>
                                </div>
                                <small style={{ color: "#2ED573", fontWeight: "600" }}>
                                  Preparación rápida
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="d-flex flex-column gap-3">
                        {!esVendedor ? (
                          <>
                            <button 
                              className={`btn py-3 ${agregado ? 'disabled' : ''}`}
                              onClick={agregarAlCarrito}
                              disabled={agregado}
                              style={{
                                background: agregado 
                                  ? "#2ED573" 
                                  : "linear-gradient(135deg, #4D96FF, #0033A0)",
                                color: "white",
                                border: "none",
                                borderRadius: "15px",
                                fontWeight: "600",
                                fontSize: "1.1rem",
                                transition: "all 0.3s ease"
                              }}
                              onMouseEnter={(e) => {
                                if (!agregado) {
                                  e.currentTarget.style.transform = "translateY(-3px)";
                                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(77, 150, 255, 0.4)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!agregado) {
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "none";
                                }
                              }}
                            >
                              {agregado ? (
                                <>
                                  <i className="bi bi-check-circle-fill me-2"></i>
                                  ¡Agregado al carrito!
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-cart-plus-fill me-2"></i>
                                  Agregar al carrito
                                </>
                              )}
                            </button>
                            
                            <div className="d-flex gap-3">
                              <button 
                                className="btn py-3 flex-grow-1"
                                onClick={() => navigate("/productos")}
                                style={{
                                  background: "transparent",
                                  color: "#4D96FF",
                                  border: "2px solid #4D96FF",
                                  borderRadius: "15px",
                                  fontWeight: "600",
                                  fontSize: "1.1rem"
                                }}
                              >
                                <i className="bi bi-arrow-left me-2"></i>
                                Ver más productos
                              </button>
                              
                              <button 
                                className="btn py-3 flex-grow-1"
                                onClick={() => navigate("/carrito")}
                                style={{
                                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                                  color: "#0033A0",
                                  border: "none",
                                  borderRadius: "15px",
                                  fontWeight: "600",
                                  fontSize: "1.1rem"
                                }}
                              >
                                <i className="bi bi-cart3 me-2"></i>
                                Ir al carrito
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="alert border-0" style={{
                            background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
                            color: "white",
                            borderRadius: "15px",
                            padding: "1.5rem"
                          }}>
                            <div className="d-flex align-items-center gap-3">
                              <div style={{
                                width: "50px",
                                height: "50px",
                                background: "rgba(255, 255, 255, 0.2)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem"
                              }}>
                                <i className="bi bi-shop"></i>
                              </div>
                              <div>
                                <h5 className="mb-1">Modo vendedor activado</h5>
                                <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                                  Los vendedores no pueden realizar compras. Esta vista es solo para gestión de productos.
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <button 
                                className="btn btn-sm"
                                onClick={() => navigate("/productos")}
                                style={{
                                  background: "white",
                                  color: "#D52B1E",
                                  border: "none",
                                  padding: "0.5rem 1.5rem",
                                  borderRadius: "10px",
                                  fontWeight: "600"
                                }}
                              >
                                <i className="bi bi-arrow-left me-2"></i>
                                Volver a productos
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;