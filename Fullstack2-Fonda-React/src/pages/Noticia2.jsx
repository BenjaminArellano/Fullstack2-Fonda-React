function Noticia2() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "2rem 0"
    }}>
      {/* Header de la noticia */}
      <div style={{
        background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(213, 43, 30, 0.3)"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <div className="mb-3">
                <span className="badge" style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}>
                  <i className="bi bi-trophy-fill me-2"></i>
                  Eventos
                </span>
              </div>
              
              <h1 className="display-5 fw-bold mb-4" style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                ¡Concursos Más Divertidos que Nunca!
              </h1>
              
              <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar"></i>
                  <span>12 Septiembre 2024</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock"></i>
                  <span>4 min de lectura</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-eye"></i>
                  <span>987 vistas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la noticia */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: "25px",
              overflow: "hidden"
            }}>
              <div className="card-body p-4 p-md-5">
                {/* Imagen principal */}
                <div className="mb-5" style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: "400px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                }}>
                  <img 
                    src="../src/assets/not.png" 
                    alt="Fiesta y concursos en la fonda" 
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                
                {/* Introducción */}
                <div className="mb-5">
                  <p className="lead" style={{
                    fontSize: "1.3rem",
                    lineHeight: "1.8",
                    color: "#495057",
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(213, 43, 30, 0.1))",
                    borderRadius: "15px",
                    borderLeft: "4px solid #FF6B6B"
                  }}>
                    Este año, nuestra fonda no solo te trae música y comida típica, sino que también te invita a competir, reír y ganar increíbles premios.
                  </p>
                </div>
                
                {/* Descripción principal */}
                <div className="mb-5">
                  <p className="mb-4" style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#495057"
                  }}>
                    Desde el tradicional concurso de cueca, hasta competencias de tombo de empanadas y carreras de sacos, cada actividad está pensada para que toda la familia se divierta al máximo.
                  </p>
                  
                  <p className="mb-4" style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#495057"
                  }}>
                    Además, los más pequeños podrán disfrutar de talleres de baile, juegos tradicionales y sorpresas especiales, mientras los adultos compiten por premios en nuestras actividades típicas. No importa si eres principiante o experto: en nuestra fonda, todos tienen la oportunidad de participar y vivir la emoción de nuestras tradiciones.
                  </p>
                </div>
                
                {/* Horarios */}
                <div className="mb-5">
                  <h2 className="mb-4 text-center" style={{
                    color: "#D52B1E",
                    position: "relative",
                    paddingBottom: "1rem"
                  }}>
                    <i className="bi bi-clock-history me-2"></i>
                    Horarios de las Actividades
                    <div style={{
                      position: "absolute",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "3px",
                      background: "linear-gradient(90deg, #FF6B6B, #D52B1E)",
                      borderRadius: "2px"
                    }}></div>
                  </h2>
                  
                  <div className="row g-4">
                    {[
                      { hora: "10:00 AM", actividad: "Apertura de la fonda", icon: "bi-door-open", color: "#4D96FF" },
                      { hora: "11:00 AM – 2:00 PM", actividad: "Talleres para niños", icon: "bi-people-fill", color: "#2ED573" },
                      { hora: "2:30 PM – 6:00 PM", actividad: "Concursos de cueca y juegos tradicionales", icon: "bi-trophy", color: "#FFD700" },
                      { hora: "7:00 PM", actividad: "Premiación y cierre", icon: "bi-award-fill", color: "#FF6B6B" }
                    ].map((item, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div className="card border-0 h-100" style={{
                          background: "white",
                          borderRadius: "20px",
                          padding: "1.5rem",
                          boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                          borderTop: `4px solid ${item.color}`,
                          transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          <div className="d-flex align-items-start gap-3">
                            <div style={{
                              width: "50px",
                              height: "50px",
                              background: `${item.color}15`,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: item.color,
                              fontSize: "1.3rem"
                            }}>
                              <i className={`bi ${item.icon}`}></i>
                            </div>
                            <div>
                              <div style={{
                                fontSize: "0.9rem",
                                color: "#6c757d",
                                fontWeight: "600",
                                marginBottom: "0.25rem"
                              }}>
                                {item.hora}
                              </div>
                              <h5 className="mb-0" style={{ color: "#343a40" }}>
                                {item.actividad}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Lista de actividades */}
                <div className="mb-5">
                  <h3 className="mb-4" style={{
                    color: "#D52B1E",
                    borderBottom: "3px solid #FF6B6B",
                    paddingBottom: "0.5rem",
                    display: "inline-block"
                  }}>
                    <i className="bi bi-list-check me-2"></i>
                    Actividades Destacadas
                  </h3>
                  
                  <div className="row g-3">
                    {[
                      { actividad: "Concurso de Cueca", premio: "Viaje a Pichilemu", icon: "bi-music-note-beamed" },
                      { actividad: "Tómbola de Empanadas", premio: "Cena para 4 personas", icon: "bi-egg-fried" },
                      { actividad: "Carrera de Sacos", premio: "Bicicletas nuevas", icon: "bi-speedometer2" },
                      { actividad: "Palo Encebado", premio: "Smart TV 55'", icon: "bi-tree-fill" },
                      { actividad: "Rayuela", premio: "Set de asado completo", icon: "bi-dice-5" },
                      { actividad: "Concurso de Disfraces", premio: "Fin de semana en hotel", icon: "bi-mask" }
                    ].map((item, index) => (
                      <div key={index} className="col-12 col-md-6 col-lg-4">
                        <div className="card border-0 h-100" style={{
                          background: "linear-gradient(135deg, #FFF, #FFF5F5)",
                          borderRadius: "15px",
                          padding: "1.25rem",
                          boxShadow: "0 3px 15px rgba(255, 107, 107, 0.1)",
                          transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          <div className="text-center mb-3">
                            <div style={{
                              width: "50px",
                              height: "50px",
                              margin: "0 auto",
                              background: "#FF6B6B",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "1.2rem"
                            }}>
                              <i className={`bi ${item.icon}`}></i>
                            </div>
                          </div>
                          <h6 className="text-center mb-2" style={{ color: "#D52B1E" }}>
                            {item.actividad}
                          </h6>
                          <p className="text-center mb-0" style={{
                            fontSize: "0.9rem",
                            color: "#666"
                          }}>
                            <i className="bi bi-gift-fill me-1"></i>
                            Premio: {item.premio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mensaje final */}
                <div className="mb-5">
                  <div className="card border-0" style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    borderRadius: "20px",
                    padding: "2rem",
                    color: "#D52B1E"
                  }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div style={{
                        width: "60px",
                        height: "60px",
                        background: "#D52B1E",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1.5rem"
                      }}>
                        <i className="bi bi-megaphone-fill"></i>
                      </div>
                      <div>
                        <h4 className="mb-1">¡Anuncio Especial!</h4>
                        <p className="mb-0">Liderado por Benjamín Arellano</p>
                      </div>
                    </div>
                    
                    <p className="mb-0" style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.7"
                    }}>
                      Nuestro equipo ha trabajado para que cada rincón de la fonda sea un espacio seguro, organizado y lleno de alegría. ¡No te pierdas la oportunidad de llevarte recuerdos, ganar premios y formar parte de la celebración más auténtica del país!
                    </p>
                  </div>
                </div>
                
                {/* Conclusión */}
                <div className="mt-5 pt-4 border-top">
                  <p className="text-center mb-4" style={{
                    fontSize: "1.2rem",
                    lineHeight: "1.8",
                    color: "#495057",
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(255, 107, 107, 0.05), rgba(213, 43, 30, 0.05))",
                    borderRadius: "15px"
                  }}>
                    Ven, participa y vive la verdadera experiencia de la fonda más prendida de Chile: diversión, tradición y premios para todos.
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Noticia2;