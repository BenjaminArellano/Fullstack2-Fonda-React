import React, { useState } from "react";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);
    
    // Validación de correo
    const dominiosPermitidos = [
      "@gmail.com",
      "@duocuc.cl", 
      "@profesor.duoc.cl",
      "@fondaduoc.cl"
    ];
    
    const correoValido = dominiosPermitidos.some(dominio => 
      correo.toLowerCase().includes(dominio)
    );
    
    if (!correoValido) {
      alert("Por favor, ingresa un correo válido (@gmail.com, @duocuc.cl, @profesor.duoc.cl o @fondaduoc.cl).");
      setEnviando(false);
      return;
    }
    
    // Simular envío
    setTimeout(() => {
      alert(`¡Mensaje enviado con éxito!\n\nCorreo: ${correo}\n\nGracias por contactarnos, ${nombre}. Te responderemos a la brevedad.`);
      setNombre("");
      setCorreo("");
      setContenido("");
      setEnviando(false);
    }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
      padding: "2rem 0"
    }}>
      {/* Header de contacto */}
      <div style={{
        background: "linear-gradient(135deg, #2ED573, #007749)",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(0, 119, 73, 0.3)"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <h1 className="display-4 fw-bold mb-3" style={{
                background: "linear-gradient(to right, #FFFFFF, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                <i className="bi bi-chat-dots me-3"></i>
                Contáctanos
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
                ¿Tienes preguntas, sugerencias o quieres reservar tu mesa?<br/>
                ¡Estamos aquí para ayudarte!
              </p>
              
              <div className="d-flex flex-wrap justify-content-center gap-4">
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "1rem",
                  borderRadius: "15px",
                  backdropFilter: "blur(5px)",
                  minWidth: "200px"
                }}>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: "#FFD700",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-telephone-fill" style={{ color: "#007749" }}></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Teléfono</h6>
                      <p className="mb-0" style={{ fontSize: "0.9rem" }}>(2) 2345 6789</p>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "1rem",
                  borderRadius: "15px",
                  backdropFilter: "blur(5px)",
                  minWidth: "200px"
                }}>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: "#FFD700",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-envelope-fill" style={{ color: "#007749" }}></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Email</h6>
                      <p className="mb-0" style={{ fontSize: "0.9rem" }}>contacto@fondaduoc.cl</p>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "1rem",
                  borderRadius: "15px",
                  backdropFilter: "blur(5px)",
                  minWidth: "200px"
                }}>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: "#FFD700",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-geo-alt-fill" style={{ color: "#007749" }}></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Ubicación</h6>
                      <p className="mb-0" style={{ fontSize: "0.9rem" }}>Av. DuocFonda 777, Santiago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de contacto */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "25px",
              overflow: "hidden"
            }}>
              <div className="card-body p-4 p-md-5">
                <div className="row">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                    <h3 style={{ color: "#007749", marginBottom: "1.5rem" }}>
                      <i className="bi bi-send-fill me-2"></i>
                      Envíanos un mensaje
                    </h3>
                    
                    <p className="text-muted mb-4">
                      Completa el formulario y nos pondremos en contacto contigo 
                      en menos de 24 horas. ¡Te esperamos!
                    </p>
                    
                    <div className="mt-5">
                      <h5 style={{ color: "#007749", marginBottom: "1rem" }}>
                        <i className="bi bi-clock-history me-2"></i>
                        Horario de atención
                      </h5>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-calendar-check me-2" style={{ color: "#2ED573" }}></i>
                          <strong>Lunes a Viernes:</strong> 10:00 - 22:00 hrs
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-calendar-check me-2" style={{ color: "#2ED573" }}></i>
                          <strong>Sábados:</strong> 11:00 - 00:00 hrs
                        </li>
                        <li>
                          <i className="bi bi-calendar-check me-2" style={{ color: "#2ED573" }}></i>
                          <strong>Domingos y festivos:</strong> 12:00 - 20:00 hrs
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h6 className="text-muted">Correos aceptados:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge" style={{
                          background: "rgba(46, 213, 115, 0.1)",
                          color: "#007749",
                          padding: "0.25rem 0.75rem"
                        }}>
                          @gmail.com
                        </span>
                        <span className="badge" style={{
                          background: "rgba(46, 213, 115, 0.1)",
                          color: "#007749",
                          padding: "0.25rem 0.75rem"
                        }}>
                          @duocuc.cl
                        </span>
                        <span className="badge" style={{
                          background: "rgba(46, 213, 115, 0.1)",
                          color: "#007749",
                          padding: "0.25rem 0.75rem"
                        }}>
                          @profesor.duoc.cl
                        </span>
                        <span className="badge" style={{
                          background: "rgba(46, 213, 115, 0.1)",
                          color: "#007749",
                          padding: "0.25rem 0.75rem"
                        }}>
                          @fondaduoc.cl
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="nombre" className="form-label fw-bold" style={{ color: "#007749" }}>
                          <i className="bi bi-person-fill me-1"></i>
                          Nombre completo
                        </label>
                        <input 
                          type="text"
                          id="nombre"
                          className="form-control"
                          placeholder="Ej: Juan Pérez"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                          style={{
                            border: "2px solid #e0e0e0",
                            borderRadius: "12px",
                            padding: "0.75rem 1rem",
                            transition: "all 0.3s ease"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#2ED573";
                            e.target.style.boxShadow = "0 0 0 0.2rem rgba(46, 213, 115, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="correo" className="form-label fw-bold" style={{ color: "#007749" }}>
                          <i className="bi bi-envelope-fill me-1"></i>
                          Correo electrónico
                        </label>
                        <input 
                          type="email"
                          id="correo"
                          className="form-control"
                          placeholder="ejemplo@correo.com"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
                          style={{
                            border: "2px solid #e0e0e0",
                            borderRadius: "12px",
                            padding: "0.75rem 1rem",
                            transition: "all 0.3s ease"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#2ED573";
                            e.target.style.boxShadow = "0 0 0 0.2rem rgba(46, 213, 115, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <small className="text-muted mt-1 d-block">
                          Solo aceptamos: @gmail.com, @duocuc.cl, @profesor.duoc.cl, @fondaduoc.cl
                        </small>
                      </div>
                    
                      <div className="mb-4">
                        <label htmlFor="contenido" className="form-label fw-bold" style={{ color: "#007749" }}>
                          <i className="bi bi-chat-left-text-fill me-1"></i>
                          Mensaje
                        </label>
                        <textarea
                          id="contenido"
                          className="form-control"
                          placeholder="Escribe tu mensaje aquí..."
                          value={contenido}
                          onChange={(e) => setContenido(e.target.value)}
                          required
                          style={{
                            border: "2px solid #e0e0e0",
                            borderRadius: "12px",
                            padding: "0.75rem 1rem",
                            minHeight: "150px",
                            resize: "vertical",
                            transition: "all 0.3s ease"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#2ED573";
                            e.target.style.boxShadow = "0 0 0 0.2rem rgba(46, 213, 115, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn w-100 py-3"
                        disabled={enviando}
                        style={{
                          background: enviando 
                            ? "#cccccc" 
                            : "linear-gradient(135deg, #2ED573, #007749)",
                          color: "white",
                          border: "none",
                          borderRadius: "15px",
                          fontWeight: "600",
                          fontSize: "1.1rem",
                          transition: "all 0.3s ease",
                          position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          if (!enviando) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(46, 213, 115, 0.4)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!enviando) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {enviando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i>
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Información adicional */}
            <div className="row mt-5">
              <div className="col-md-4 mb-4">
                <div className="card border-0 h-100 text-center" style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  borderRadius: "20px",
                  padding: "1.5rem"
                }}>
                  <div className="mb-3" style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto",
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <i className="bi bi-whatsapp" style={{ fontSize: "1.5rem", color: "#FFA500" }}></i>
                  </div>
                  <h5 style={{ color: "#0033A0" }}>WhatsApp</h5>
                  <p className="mb-0" style={{ color: "#0033A0" }}>+56 9 8765 4321</p>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="card border-0 h-100 text-center" style={{
                  background: "linear-gradient(135deg, #4D96FF, #0033A0)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  color: "white"
                }}>
                  <div className="mb-3" style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto",
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <i className="bi bi-facebook" style={{ fontSize: "1.5rem", color: "#0033A0" }}></i>
                  </div>
                  <h5>Facebook</h5>
                  <p className="mb-0">/LaFondaSQL</p>
                </div>
              </div>
              
              <div className="col-md-4 mb-4">
                <div className="card border-0 h-100 text-center" style={{
                  background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  color: "white"
                }}>
                  <div className="mb-3" style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto",
                    background: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <i className="bi bi-instagram" style={{ fontSize: "1.5rem", color: "#D52B1E" }}></i>
                  </div>
                  <h5>Instagram</h5>
                  <p className="mb-0">@fondaSQL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS inline para efectos */}
      <style>{`
        .form-control:focus {
          border-color: #2ED573 !important;
          box-shadow: 0 0 0 0.2rem rgba(46, 213, 115, 0.25) !important;
        }
        
        .card {
          transition: transform 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}

export default Contacto;