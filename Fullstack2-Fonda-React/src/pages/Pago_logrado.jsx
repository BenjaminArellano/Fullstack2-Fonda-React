import React from "react";
import { removeFromLocalstorage } from "../utils/localstorageHelper";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function PagoLogrado() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos de la boleta si existen
  const boletaNumero = location.state?.boletaNumero || `B${Date.now().toString().slice(-6)}`;
  const total = location.state?.total || 0;
  const fecha = location.state?.fecha || new Date().toLocaleDateString('es-CL');
  const detalles = location.state?.detalles || 0;

  // Limpiar carrito y pagos del localstorage
  const handleInicio = () => {
    removeFromLocalstorage("compra");
    removeFromLocalstorage("pagos");
    navigate("/");
  };

  const handleProductos = () => {
    removeFromLocalstorage("pagos");
    navigate("/productos");
  };

  const handleMisCompras = () => {
    navigate("/mis-compras");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0033A0 0%, #D52B1E 100%)",
      padding: "2rem 0",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Elementos decorativos */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "150px",
        height: "150px",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%",
        border: "3px dashed #FFD700",
        animation: "flotar 8s ease-in-out infinite"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "5%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%",
        border: "3px dashed white",
        animation: "flotar 10s ease-in-out infinite reverse"
      }}></div>

      {/* Volantines decorativos */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "10%",
        width: "60px",
        height: "60px",
        background: "linear-gradient(45deg, #D52B1E, #FFFFFF, #0033A0)",
        transform: "rotate(45deg)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        animation: "flotarVolantin 6s ease-in-out infinite"
      }}></div>

      <div style={{
        position: "absolute",
        bottom: "25%",
        left: "12%",
        width: "40px",
        height: "40px",
        background: "linear-gradient(45deg, #FFD700, #FFFFFF, #D52B1E)",
        transform: "rotate(45deg)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        animation: "flotarVolantin 5s ease-in-out infinite 1s"
      }}></div>

      <style>{`
        @keyframes flotar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes flotarVolantin {
          0%, 100% { transform: rotate(45deg) translateY(0px) rotate(0deg); }
          50% { transform: rotate(45deg) translateY(-15px) rotate(10deg); }
        }
        
        @keyframes confeti {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Confeti animado */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-20px",
            left: `${(i * 5)}%`,
            width: "15px",
            height: "15px",
            background: i % 3 === 0 ? "#0033A0" : i % 3 === 1 ? "#D52B1E" : "#FFD700",
            borderRadius: i % 2 === 0 ? "50%" : "0%",
            animation: `confeti ${3 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
            opacity: 0.7
          }}
        />
      ))}

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            {/* Header de éxito */}
            <div className="text-center mb-5">
              <div style={{
                width: "120px",
                height: "120px",
                margin: "0 auto 1.5rem",
                background: "linear-gradient(135deg, #0033A0, #D52B1E, #FFFFFF)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 15px 35px rgba(0, 51, 160, 0.4)",
                border: "4px solid #FFD700",
                animation: "pulse 2s infinite"
              }}>
                <i className="bi bi-check-circle-fill" style={{ 
                  fontSize: "4rem", 
                  color: "white",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}></i>
              </div>
              
              <style>{`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
              `}</style>
              
              <h1 style={{
                color: "white",
                fontWeight: "800",
                marginBottom: "0.5rem",
                fontSize: "3rem",
                textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                background: "linear-gradient(to right, #FFFFFF, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                <i className="bi bi-flag-fill me-3"></i>
                ¡Pago Realizado con Éxito!
              </h1>
              
              <p style={{ 
                color: "#FFD700", 
                fontSize: "1.3rem",
                fontStyle: "italic",
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                Tu compra ha sido procesada exitosamente
              </p>
            </div>

            {/* Tarjeta principal */}
            <div className="card border-0 shadow-lg" style={{
              borderRadius: "30px",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.97)",
              border: "4px solid #0033A0",
              boxShadow: "0 20px 50px rgba(0, 51, 160, 0.4) !important",
              position: "relative"
            }}>
              {/* Banda chilena superior */}
              <div style={{
                height: "15px",
                background: "linear-gradient(to right, #0033A0 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #D52B1E 66.66%)",
                width: "100%",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#FFD700",
                  color: "#0033A0",
                  padding: "0.25rem 1.5rem",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}>
                  <i className="bi bi-receipt me-1"></i>
                  COMPROBANTE DE PAGO
                </div>
              </div>
              
              <div className="card-body p-4 p-md-5">
                {/* Información de la boleta */}
                <div className="mb-5" style={{
                  background: "linear-gradient(135deg, rgba(0, 51, 160, 0.05), rgba(213, 43, 30, 0.05))",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "2px solid rgba(0, 51, 160, 0.1)",
                  position: "relative"
                }}>
                  <h4 className="mb-4" style={{ 
                    color: "#0033A0",
                    textAlign: "center",
                    fontWeight: "700"
                  }}>
                    <i className="bi bi-file-earmark-text-fill me-2"></i>
                    Detalles de tu Boleta
                  </h4>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="text-center p-3" style={{
                        background: "white",
                        borderRadius: "15px",
                        border: "2px solid #FFD700",
                        boxShadow: "0 5px 15px rgba(255, 215, 0, 0.2)"
                      }}>
                        <h6 style={{ color: "#666", marginBottom: "0.5rem" }}>
                          <i className="bi bi-receipt me-1"></i>
                          N° Boleta
                        </h6>
                        <div style={{
                          fontSize: "2rem",
                          fontWeight: "800",
                          color: "#0033A0",
                          letterSpacing: "2px"
                        }}>
                          {boletaNumero}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="text-center p-3" style={{
                        background: "white",
                        borderRadius: "15px",
                        border: "2px solid #FFD700",
                        boxShadow: "0 5px 15px rgba(255, 215, 0, 0.2)"
                      }}>
                        <h6 style={{ color: "#666", marginBottom: "0.5rem" }}>
                          <i className="bi bi-calendar-check me-1"></i>
                          Fecha
                        </h6>
                        <div style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: "#D52B1E"
                        }}>
                          {fecha}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="p-3" style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      borderRadius: "15px",
                      display: "inline-block",
                      padding: "0.75rem 2rem",
                      margin: "1rem auto"
                    }}>
                      <h6 className="mb-1" style={{ color: "#0033A0" }}>
                        <i className="bi bi-cash-stack me-1"></i>
                        Total Pagado
                      </h6>
                      <div style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        color: "#D52B1E",
                        textShadow: "1px 1px 3px rgba(0,0,0,0.1)"
                      }}>
                        ${total?.toLocaleString("es-CL") || "0"} CLP
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="badge" style={{
                      background: "linear-gradient(135deg, #2ED573, #007749)",
                      color: "white",
                      padding: "0.5rem 1.5rem",
                      borderRadius: "25px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <i className="bi bi-shield-check"></i>
                      Estado: <span className="ms-1">Pagado ✓</span>
                    </div>
                  </div>
                </div>

                {/* Mensaje de confirmación */}
                <div className="text-center mb-5">
                  <div style={{
                    background: "rgba(0, 51, 160, 0.05)",
                    borderRadius: "20px",
                    padding: "2rem",
                    border: "2px dashed #0033A0"
                  }}>
                    <h5 style={{ color: "#0033A0", marginBottom: "1rem" }}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#D52B1E" }}></i>
                      ¡Tu compra ha sido confirmada!
                    </h5>
                    <p className="mb-3" style={{ color: "#666", fontSize: "1.1rem" }}>
                      Tu boleta ha sido registrada en nuestro sistema y recibirás 
                      un correo de confirmación con todos los detalles de tu compra.
                    </p>
                    <div className="alert alert-success border-0" style={{
                      background: "rgba(46, 213, 115, 0.1)",
                      color: "#007749",
                      borderRadius: "15px",
                      display: "inline-block",
                      marginTop: "1rem",
                      border: "1px solid rgba(46, 213, 115, 0.3)"
                    }}>
                      <i className="bi bi-envelope-check-fill me-2"></i>
                      Correo de confirmación enviado exitosamente
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="d-grid gap-3 d-md-flex justify-content-md-center mb-5">
                  <button 
                    className="btn btn-lg"
                    onClick={handleInicio}
                    style={{
                      background: "linear-gradient(135deg, #0033A0, #1E4DBF)",
                      color: "white",
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "50px",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      minWidth: "200px",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 51, 160, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-house-door-fill"></i>
                    Ir al Inicio
                  </button>
                  
                  <button 
                    className="btn btn-lg"
                    onClick={handleProductos}
                    style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "#0033A0",
                      border: "2px solid #0033A0",
                      padding: "1rem 2rem",
                      borderRadius: "50px",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      minWidth: "200px",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(255, 215, 0, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-cart-plus-fill"></i>
                    Seguir Comprando
                  </button>
                  
                </div>

                {/* Información adicional */}
                <div className="mt-5 pt-4 border-top" style={{ borderColor: "#0033A0 !important" }}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card border-0 h-100" style={{
                        background: "linear-gradient(135deg, rgba(0, 51, 160, 0.05), rgba(255, 215, 0, 0.05))",
                        borderRadius: "20px",
                        padding: "1.5rem"
                      }}>
                        <h6 style={{ color: "#0033A0", marginBottom: "1rem" }}>
                          <i className="bi bi-clock-history me-2"></i>
                          ¿Qué sigue?
                        </h6>
                        <ul className="list-unstyled mb-0" style={{ color: "#666" }}>
                          <li className="mb-2">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: "#2ED573" }}></i>
                            Recibirás un correo de confirmación
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-check-circle-fill me-2" style={{ color: "#2ED573" }}></i>
                            Los productos serán procesados en 24h
                          </li>
                          <li>
                            <i className="bi bi-check-circle-fill me-2" style={{ color: "#2ED573" }}></i>
                            Envío según método seleccionado
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="card border-0 h-100" style={{
                        background: "linear-gradient(135deg, rgba(213, 43, 30, 0.05), rgba(255, 215, 0, 0.05))",
                        borderRadius: "20px",
                        padding: "1.5rem"
                      }}>
                        <h6 style={{ color: "#D52B1E", marginBottom: "1rem" }}>
                          <i className="bi bi-headset me-2"></i>
                          ¿Necesitas ayuda?
                        </h6>
                        <div style={{ color: "#666" }}>
                          <p className="mb-2">
                            Estamos aquí para ayudarte con cualquier duda sobre tu compra.
                          </p>
                          <a 
                            href="/contacto" 
                            className="text-decoration-none d-inline-flex align-items-center gap-2"
                            style={{
                              color: "#0033A0",
                              fontWeight: "600"
                            }}
                          >
                            <i className="bi bi-arrow-right-circle-fill"></i>
                            Contáctanos ahora
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tarjetas de contacto rápidas */}
                <div className="row mt-4">
                  <div className="col-md-4 mb-3">
                    <div className="card border-0 h-100 text-center" style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      color: "#0033A0"
                    }}>
                      <div className="mb-3" style={{
                        width: "50px",
                        height: "50px",
                        margin: "0 auto",
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <i className="bi bi-whatsapp" style={{ fontSize: "1.5rem" }}></i>
                      </div>
                      <h6>WhatsApp</h6>
                      <p className="mb-0" style={{ fontSize: "0.9rem" }}>+56 9 8765 4321</p>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <div className="card border-0 h-100 text-center" style={{
                      background: "linear-gradient(135deg, #0033A0, #1E4DBF)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      color: "white"
                    }}>
                      <div className="mb-3" style={{
                        width: "50px",
                        height: "50px",
                        margin: "0 auto",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <i className="bi bi-telephone" style={{ fontSize: "1.5rem" }}></i>
                      </div>
                      <h6>Teléfono</h6>
                      <p className="mb-0" style={{ fontSize: "0.9rem" }}>(2) 2345 6789</p>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <div className="card border-0 h-100 text-center" style={{
                      background: "linear-gradient(135deg, #D52B1E, #FF6B6B)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      color: "white"
                    }}>
                      <div className="mb-3" style={{
                        width: "50px",
                        height: "50px",
                        margin: "0 auto",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <i className="bi bi-envelope" style={{ fontSize: "1.5rem" }}></i>
                      </div>
                      <h6>Email</h6>
                      <p className="mb-0" style={{ fontSize: "0.9rem" }}>ventas@fondaduoc.cl</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer festivo */}
            <div className="text-center mt-5">
              <div style={{
                background: "rgba(255, 215, 0, 0.1)",
                border: "2px solid #FFD700",
                borderRadius: "25px",
                padding: "1.5rem",
                display: "inline-block"
              }}>
                <p className="mb-0" style={{ 
                  color: "#0033A0", 
                  fontSize: "1.1rem",
                  fontWeight: "500"
                }}>
                  <i className="bi bi-emoji-smile-fill me-2" style={{ color: "#D52B1E" }}></i>
                  ¡Gracias por confiar en nosotros! ¡Viva Chile!
                  <i className="bi bi-emoji-heart-eyes ms-2" style={{ color: "#D52B1E" }}></i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagoLogrado;