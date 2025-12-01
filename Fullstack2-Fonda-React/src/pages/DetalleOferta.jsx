import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../utils/DataService";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
} from "../utils/localstorageHelper";

function DetalleOferta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oferta, setOferta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    if (!id) {
      setCargando(false);
      return;
    }

    const fetchOferta = async () => {
      try {
        const data = await DataService.getOfertaById(id);
        setOferta(data);
      } catch (error) {
        console.error("Error cargando oferta:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchOferta();
  }, [id]);

  const agregarAlCarrito = () => {
    const carrito = loadFromLocalstorage("compra") || [];

    const ofertaExistente = carrito.find(
      (item) => item.ofertaId === oferta.ofertaId
    );

    if (ofertaExistente) {
      ofertaExistente.cantidad += 1;
    } else {
      carrito.push({ ...oferta, cantidad: 1 });
    }

    saveToLocalstorage("compra", carrito);
    setAgregado(true);
    
    // Resetear el estado después de 2 segundos
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
            color: "#FF6B6B"
          }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h3 className="mt-3" style={{ color: "#D52B1E" }}>Cargando oferta...</h3>
        </div>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="container text-center py-5">
        <div className="mb-4" style={{ fontSize: "5rem" }}>😢</div>
        <h3 style={{ color: "#D52B1E" }}>Oferta no encontrada</h3>
        <p className="text-muted mb-4">La oferta que buscas no existe o ha expirado</p>
        <button 
          className="btn"
          onClick={() => navigate("/ofertas")}
          style={{
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#D52B1E",
            border: "2px solid #D52B1E",
            padding: "0.75rem 2rem",
            borderRadius: "25px",
            fontWeight: "600"
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a ofertas
        </button>
      </div>
    );
  }

  // Calcular precio original (20% más caro)
  const precioOriginal = oferta.precioOferta * 1.2;
  const ahorro = precioOriginal - oferta.precioOferta;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)",
      padding: "2rem 0"
    }}>
      {/* Header de la oferta */}
      <div style={{
        background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(213, 43, 30, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Etiqueta de oferta */}
        <div style={{
          position: "absolute",
          top: "30px",
          right: "-35px",
          background: "linear-gradient(135deg, #FFD700, #FFA500)",
          color: "#D52B1E",
          padding: "8px 40px",
          transform: "rotate(45deg)",
          fontSize: "0.9rem",
          fontWeight: "700",
          zIndex: "1",
          boxShadow: "0 3px 15px rgba(255, 215, 0, 0.4)",
          width: "160px",
          textAlign: "center"
        }}>
          ¡OFERTA ESPECIAL!
        </div>
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <h1 className="display-5 fw-bold mb-3" style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                {oferta.nombreOferta}
              </h1>
              
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mb-3">
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-tag-fill me-2"></i>
                  {oferta.categoria?.nombre || "Oferta Especial"}
                </div>
                
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-clock me-2"></i>
                  Oferta por tiempo limitado
                </div>
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
                      {oferta.imagen ? (
                        <img
                          src={oferta.imagen}
                          alt={oferta.nombreOferta}
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
                          <div className="mb-3" style={{ fontSize: "4rem" }}>🏷️</div>
                          <p className="text-muted">Imagen no disponible</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna de detalles */}
                  <div className="col-12 col-md-6">
                    <div style={{ padding: "3rem" }}>
                      {/* Precios */}
                      <div className="mb-4">
                        <div className="d-flex align-items-end gap-3 mb-2">
                          <div>
                            <small className="text-muted d-block mb-1">Precio original</small>
                            <span style={{
                              fontSize: "1.2rem",
                              color: "#666",
                              textDecoration: "line-through"
                            }}>
                              ${precioOriginal.toFixed(0)} {oferta.moneda}
                            </span>
                          </div>
                          
                          <div>
                            <small className="text-muted d-block mb-1">Precio oferta</small>
                            <span style={{
                              fontSize: "2.5rem",
                              fontWeight: "700",
                              color: "#FF4757"
                            }}>
                              ${oferta.precioOferta} {oferta.moneda}
                            </span>
                          </div>
                        </div>
                        
                        <div className="alert" style={{
                          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))",
                          color: "#D52B1E",
                          border: "2px dashed #FFD700",
                          borderRadius: "15px",
                          padding: "0.75rem 1rem"
                        }}>
                          <div className="d-flex align-items-center justify-content-between">
                            <span>
                              <i className="bi bi-piggy-bank-fill me-2"></i>
                              <strong>Ahorras:</strong>
                            </span>
                            <span style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                              ${ahorro.toFixed(0)} {oferta.moneda}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="mb-4">
                        <h4 style={{ 
                          color: "#374850",
                          marginBottom: "1rem",
                          borderBottom: "2px solid #FF6B6B",
                          paddingBottom: "0.5rem"
                        }}>
                          <i className="bi bi-info-circle-fill me-2"></i>
                          Detalles de la oferta
                        </h4>
                        <p style={{
                          fontSize: "1.1rem",
                          lineHeight: "1.7",
                          color: "#495057"
                        }}>
                          {oferta.detalleOferta || "Oferta especial con descuento exclusivo. ¡No te lo pierdas!"}
                        </p>
                      </div>

                      {/* Información adicional */}
                      <div className="mb-5">
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="card border-0" style={{
                              background: "rgba(77, 150, 255, 0.1)",
                              borderRadius: "15px",
                              padding: "1rem"
                            }}>
                              <div className="text-center">
                                <div className="mb-2">
                                  <i className="bi bi-shield-check" style={{ 
                                    fontSize: "1.5rem",
                                    color: "#4D96FF"
                                  }}></i>
                                </div>
                                <small style={{ color: "#4D96FF", fontWeight: "600" }}>
                                  Garantía de calidad
                                </small>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-6">
                            <div className="card border-0" style={{
                              background: "rgba(46, 213, 115, 0.1)",
                              borderRadius: "15px",
                              padding: "1rem"
                            }}>
                              <div className="text-center">
                                <div className="mb-2">
                                  <i className="bi bi-truck" style={{ 
                                    fontSize: "1.5rem",
                                    color: "#2ED573"
                                  }}></i>
                                </div>
                                <small style={{ color: "#2ED573", fontWeight: "600" }}>
                                  Entrega rápida
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="d-flex flex-column gap-3">
                        <button 
                          className={`btn py-3 ${agregado ? 'disabled' : ''}`}
                          onClick={agregarAlCarrito}
                          disabled={agregado}
                          style={{
                            background: agregado 
                              ? "#2ED573" 
                              : "linear-gradient(135deg, #FF6B6B, #FF4757)",
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
                              e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 107, 107, 0.4)";
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
                        
                        <button 
                          className="btn py-3"
                          onClick={() => navigate("/ofertas")}
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
                          Ver más ofertas
                        </button>
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

export default DetalleOferta;