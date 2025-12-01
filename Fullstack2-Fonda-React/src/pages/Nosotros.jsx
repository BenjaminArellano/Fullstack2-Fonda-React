import React from "react";

function Nosotros() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0033A0 0%, #D52B1E 100%)",
      padding: "2rem 0"
    }}>

      {/* Contenido principal */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "30px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              border: "3px solid #0033A0"
            }}>
              {/* Banda chilena superior */}
              <div style={{
                height: "15px",
                background: "linear-gradient(to right, #0033A0 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #D52B1E 66.66%)",
                width: "100%"
              }}></div>
              
              <div className="card-body p-4 p-md-5">
                
                {/* Título Quiénes Somos */}
                <div className="text-center mb-4">
                  <h2 style={{
                    color: "#0033A0",
                    fontWeight: "800",
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    position: "relative",
                    display: "inline-block"
                  }}>
                    <span style={{
                      position: "absolute",
                      top: "-10px",
                      left: "-20px",
                      color: "#D52B1E",
                      fontSize: "3rem",
                      opacity: 0.1
                    }}>“</span>
                    Quiénes Somos
                    <span style={{
                      position: "absolute",
                      bottom: "-20px",
                      right: "-20px",
                      color: "#D52B1E",
                      fontSize: "3rem",
                      opacity: 0.1
                    }}>”</span>
                  </h2>
                  
                  <div style={{
                    height: "4px",
                    width: "100px",
                    background: "linear-gradient(to right, #0033A0, #D52B1E)",
                    margin: "1rem auto",
                    borderRadius: "2px"
                  }}></div>
                </div>
                
                {/* Texto de presentación */}
                <div style={{
                  backgroundColor: "rgba(0, 51, 160, 0.03)",
                  borderRadius: "25px",
                  padding: "2.5rem",
                  border: "2px solid rgba(0, 51, 160, 0.1)",
                  position: "relative"
                }}>
                  <p style={{
                    color: "#333",
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    marginBottom: "2rem",
                    textAlign: "justify"
                  }}>
                    En nuestra fonda, cada plato, cada detalle y cada sonrisa cuentan una historia de esfuerzo, 
                    tradición y pasión por lo que hacemos. La gran participación y el cariño de nuestra gente 
                    nos inspiraron a dar un paso más allá: desarrollar esta página web, un espacio pensado 
                    para acercarnos aún más a quienes nos visitan y permitir que todos disfruten de nuestra 
                    propuesta con comodidad y organización.
                  </p>
                  
                  {/* Cita destacada */}
                  <div style={{
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    borderLeft: "4px solid #FFD700",
                    padding: "1.5rem",
                    margin: "2rem 0",
                    borderRadius: "0 15px 15px 0",
                    borderRight: "2px solid rgba(255, 215, 0, 0.2)"
                  }}>
                    <p className="mb-0" style={{
                      color: "#0033A0",
                      fontSize: "1.1rem",
                      fontStyle: "italic",
                      fontWeight: "500"
                    }}>
                      <i className="bi bi-quote me-2" style={{ color: "#D52B1E", fontSize: "1.5rem" }}></i>
                      Este proyecto no habría sido posible sin el liderazgo, la visión y la entrega 
                      de nuestro capitán, Benjamin Arellano, quien con su guía y compromiso logró 
                      que nuestro equipo superara los desafíos y llevara esta idea a la realidad.
                    </p>
                  </div>
                  
                  <p style={{
                    color: "#333",
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    marginBottom: "0",
                    textAlign: "justify"
                  }}>
                    Cada clic en nuestra página representa la misma calidez, alegría y dedicación 
                    que sentimos cada vez que abrimos las puertas de nuestra fonda; un lugar donde 
                    la tradición se encuentra con la innovación, y donde cada persona que nos visita 
                    se convierte en parte de nuestra familia. Estamos orgullosos de poder compartir 
                    no solo nuestros sabores, sino también nuestra historia y nuestra pasión con 
                    todos ustedes, porque al final, nuestra fonda existe gracias a cada uno de ustedes 
                    y a la magia de sentirnos juntos, celebrando cada momento.
                  </p>
                  
                  {/* Firma decorativa */}
                  <div className="text-center mt-4 pt-3" style={{
                    borderTop: "1px dashed #0033A0",
                    paddingTop: "1.5rem"
                  }}>
                    <div style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #0033A0, #D52B1E)",
                      color: "white",
                      padding: "0.75rem 2rem",
                      borderRadius: "30px",
                      fontWeight: "bold",
                      fontSize: "1.1rem"
                    }}>
                      <i className="bi bi-heart-fill me-2" style={{ color: "#FFD700" }}></i>
                      La Familia de La Fonda
                    </div>
                  </div>
                </div>
                
                {/* Valores */}
                <div className="row mt-5 pt-4">
                  <div className="col-md-4 mb-4">
                    <div className="card border-0 h-100 text-center" style={{
                      background: "linear-gradient(135deg, #0033A0, #1E4DBF)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      color: "white",
                      boxShadow: "0 8px 20px rgba(0, 51, 160, 0.3)"
                    }}>
                      <div className="mb-3" style={{
                        width: "70px",
                        height: "70px",
                        margin: "0 auto",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #FFD700"
                      }}>
                        <i className="bi bi-people-fill" style={{ fontSize: "1.8rem", color: "#FFD700" }}></i>
                      </div>
                      <h5 style={{ color: "#FFD700" }}>Comunidad</h5>
                      <p className="mb-0">Cada cliente es parte de nuestra gran familia chilena</p>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-4">
                    <div className="card border-0 h-100 text-center" style={{
                      background: "linear-gradient(135deg, #D52B1E, #FF6B6B)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      color: "white",
                      boxShadow: "0 8px 20px rgba(213, 43, 30, 0.3)"
                    }}>
                      <div className="mb-3" style={{
                        width: "70px",
                        height: "70px",
                        margin: "0 auto",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #FFD700"
                      }}>
                        <i className="bi bi-award-fill" style={{ fontSize: "1.8rem", color: "#FFD700" }}></i>
                      </div>
                      <h5 style={{ color: "#FFD700" }}>Excelencia</h5>
                      <p className="mb-0">Servicio y calidad que honran nuestras tradiciones</p>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-4">
                    <div className="card border-0 h-100 text-center" style={{
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      color: "#0033A0",
                      boxShadow: "0 8px 20px rgba(255, 215, 0, 0.3)"
                    }}>
                      <div className="mb-3" style={{
                        width: "70px",
                        height: "70px",
                        margin: "0 auto",
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #D52B1E"
                      }}>
                        <i className="bi bi-emoji-smile-fill" style={{ fontSize: "1.8rem", color: "#D52B1E" }}></i>
                      </div>
                      <h5 style={{ color: "#D52B1E" }}>Alegría</h5>
                      <p className="mb-0">Celebramos la vida y las fiestas patrias con entusiasmo</p>
                    </div>
                  </div>
                </div>
                
                {/* Llamado a la acción */}
                <div className="text-center mt-5 pt-3">
                  <div style={{
                    background: "linear-gradient(135deg, rgba(0, 51, 160, 0.05), rgba(213, 43, 30, 0.05))",
                    borderRadius: "25px",
                    padding: "2rem",
                    border: "2px dashed #0033A0"
                  }}>
                    <h4 style={{ color: "#0033A0", marginBottom: "1rem" }}>
                      <i className="bi bi-calendar-heart-fill me-2" style={{ color: "#D52B1E" }}></i>
                      ¡Ven a Celebrar con Nosotros!
                    </h4>
                    <p className="mb-3" style={{ color: "#666", maxWidth: "600px", margin: "0 auto" }}>
                      Te invitamos a ser parte de nuestra tradición y disfrutar de las mejores 
                      Fiestas Patrias en un ambiente familiar y auténticamente chileno.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                      <button 
                        className="btn"
                        style={{
                          background: "linear-gradient(135deg, #0033A0, #D52B1E)",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 2rem",
                          borderRadius: "50px",
                          fontWeight: "600",
                          fontSize: "1rem"
                        }}
                      >
                        <i className="bi bi-calendar-event me-2"></i>
                        Ver Eventos
                      </button>
                      <button 
                        className="btn"
                        style={{
                          background: "transparent",
                          color: "#0033A0",
                          border: "2px solid #0033A0",
                          padding: "0.75rem 2rem",
                          borderRadius: "50px",
                          fontWeight: "600",
                          fontSize: "1rem"
                        }}
                      >
                        <i className="bi bi-telephone me-2"></i>
                        Reservar Mesa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-5 pt-4">
        <p style={{ 
          color: "#FFD700", 
          fontSize: "1rem",
          fontStyle: "italic"
        }}>
          <i className="bi bi-flag-fill me-2"></i>
          ¡Viva Chile! ¡Viva nuestra tradición!
          <i className="bi bi-emoji-laughing ms-2"></i>
        </p>
      </div>
    </div>
  );
}

export default Nosotros;