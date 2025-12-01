function Noticia1() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "2rem 0"
    }}>
      {/* Header de la noticia */}
      <div style={{
        background: "linear-gradient(135deg, #FFD700, #FFA500)",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(255, 215, 0, 0.3)"
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
                  <i className="bi bi-tags-fill me-2"></i>
                  Precios
                </span>
              </div>
              
              <h1 className="display-5 fw-bold mb-4" style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                ¡Nuevos Precios para la Fonda Más Prendida!
              </h1>
              
              <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar"></i>
                  <span>15 Septiembre 2024</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock"></i>
                  <span>3 min de lectura</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-eye"></i>
                  <span>1,245 vistas</span>
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
                    src="../src/assets/huasos.png" 
                    alt="Huasos chilenos" 
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
                    background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))",
                    borderRadius: "15px",
                    borderLeft: "4px solid #FFD700"
                  }}>
                    ¡Atención a todos los fanáticos de nuestra fonda! Sabemos que la espera ha valido la pena, y para que disfrutes al máximo, hemos actualizado nuestros precios de productos, entradas y merchandising.
                  </p>
                </div>
                
                {/* Sección de Merchandising */}
                <div className="mb-5">
                  <h2 className="mb-4" style={{
                    color: "#FFA500",
                    borderBottom: "3px solid #FFD700",
                    paddingBottom: "0.5rem",
                    display: "inline-block"
                  }}>
                    <i className="bi bi-shop me-2"></i>
                    Merchandising de Bandas
                  </h2>
                  
                  <div className="row g-3">
                    {[
                      "Polera Banda 'Santaferia' – $14.990 CLP",
                      "Polera Banda 'Noche de Brujas' – $14.990 CLP",
                      "Polera Banda 'Chico Trujillo' – $14.990 CLP",
                      "Polera Banda 'Ráfaga' – $14.990 CLP"
                    ].map((item, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div className="card border-0 h-100" style={{
                          background: "linear-gradient(135deg, #FFF, #FFF8E1)",
                          borderRadius: "15px",
                          padding: "1rem",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
                        }}>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{
                              width: "40px",
                              height: "40px",
                              background: "#FFD700",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#333"
                            }}>
                              <i className="bi bi-tshirt-fill"></i>
                            </div>
                            <span style={{ fontWeight: "500" }}>{item}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sección de Vestimenta Huasa */}
                <div className="mb-5">
                  <h2 className="mb-4" style={{
                    color: "#FFA500",
                    borderBottom: "3px solid #FFD700",
                    paddingBottom: "0.5rem",
                    display: "inline-block"
                  }}>
                    <i className="bi bi-person-bounding-box me-2"></i>
                    Vestimenta Huasa
                  </h2>
                  
                  <div className="row g-3">
                    {[
                      "Poncho Tradicional de Lana – $39.990 CLP",
                      "Chupalla de Paja – $9.990 CLP"
                    ].map((item, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div className="card border-0 h-100" style={{
                          background: "linear-gradient(135deg, #FFF, #FFF8E1)",
                          borderRadius: "15px",
                          padding: "1rem",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
                        }}>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{
                              width: "40px",
                              height: "40px",
                              background: "#FFD700",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#333"
                            }}>
                              <i className="bi bi-hat-cowboy-side"></i>
                            </div>
                            <span style={{ fontWeight: "500" }}>{item}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Pañuelos de Cueca */}
                <div className="mb-5">
                  <h2 className="mb-4" style={{
                    color: "#FFA500",
                    borderBottom: "3px solid #FFD700",
                    paddingBottom: "0.5rem",
                    display: "inline-block"
                  }}>
                    <i className="bi bi-scarf me-2"></i>
                    Pañuelos de Cueca
                  </h2>
                  
                  <div className="card border-0" style={{
                    background: "linear-gradient(135deg, #FFF, #FFF8E1)",
                    borderRadius: "15px",
                    padding: "1.5rem",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                    maxWidth: "500px",
                    margin: "0 auto"
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: "50px",
                        height: "50px",
                        background: "#FFD700",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#333",
                        fontSize: "1.2rem"
                      }}>
                        <i className="bi bi-heart-fill"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">Pañuelo Bordado</h5>
                        <p className="mb-0" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                          $5.990 CLP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tickets de Consumo */}
                <div className="mb-5">
                  <h2 className="mb-4" style={{
                    color: "#FFA500",
                    borderBottom: "3px solid #FFD700",
                    paddingBottom: "0.5rem",
                    display: "inline-block"
                  }}>
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Tickets de Consumo
                  </h2>
                  
                  <div className="row g-3">
                    {[
                      { item: "Vale 'Terremoto'", precio: "$4.000 CLP", icon: "bi-cup-straw" },
                      { item: "Vale 'Empanada'", precio: "$3.000 CLP", icon: "bi-egg-fried" },
                      { item: "Vale 'Mote con Huesillo'", precio: "$2.500 CLP", icon: "bi-cup" }
                    ].map((ticket, index) => (
                      <div key={index} className="col-12 col-md-4">
                        <div className="card border-0 h-100 text-center" style={{
                          background: "linear-gradient(135deg, #FFF, #FFF8E1)",
                          borderRadius: "15px",
                          padding: "1.5rem",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
                        }}>
                          <div className="mb-3" style={{
                            width: "60px",
                            height: "60px",
                            margin: "0 auto",
                            background: "#FFD700",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#333",
                            fontSize: "1.5rem"
                          }}>
                            <i className={`bi ${ticket.icon}`}></i>
                          </div>
                          <h6 className="mb-2">{ticket.item}</h6>
                          <p className="mb-0" style={{ fontSize: "1.3rem", fontWeight: "700", color: "#FFA500" }}>
                            {ticket.precio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Entradas */}
                <div className="mb-5">
                  <h2 className="mb-4" style={{
                    color: "#FFA500",
                    borderBottom: "3px solid #FFD700",
                    paddingBottom: "0.5rem",
                    display: "inline-block"
                  }}>
                    <i className="bi bi-door-open me-2"></i>
                    Entradas
                  </h2>
                  
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <div className="card border-0 h-100" style={{
                        background: "linear-gradient(135deg, #4D96FF, #0033A0)",
                        borderRadius: "15px",
                        padding: "2rem",
                        color: "white",
                        boxShadow: "0 5px 15px rgba(77, 150, 255, 0.3)"
                      }}>
                        <h4 className="mb-3">Entrada General</h4>
                        <p className="mb-4">Silla Zona A</p>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>Incluye:</span>
                          <span style={{ fontSize: "1.8rem", fontWeight: "700" }}>$12.000 CLP</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                      <div className="card border-0 h-100" style={{
                        background: "linear-gradient(135deg, #FFD700, #FFA500)",
                        borderRadius: "15px",
                        padding: "2rem",
                        color: "#0033A0",
                        boxShadow: "0 5px 15px rgba(255, 215, 0, 0.3)"
                      }}>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h4 className="mb-0">Entrada VIP</h4>
                          <span className="badge" style={{
                            background: "#0033A0",
                            color: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "15px"
                          }}>
                            ¡Popular!
                          </span>
                        </div>
                        <p className="mb-4">Mesa con Vista al Escenario</p>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>Experiencia Premium:</span>
                          <span style={{ fontSize: "1.8rem", fontWeight: "700" }}>$25.000 CLP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Conclusión */}
                <div className="mt-5 pt-4 border-top">
                  <p className="text-center" style={{
                    fontSize: "1.2rem",
                    lineHeight: "1.8",
                    color: "#495057",
                    padding: "2rem",
                    background: "linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05))",
                    borderRadius: "15px"
                  }}>
                    No pierdas la oportunidad de adquirir tus productos favoritos y vivir la mejor experiencia de fonda en Chile. Recuerda que todos nuestros precios están actualizados para que disfrutes de la mejor atención y comodidad durante tu visita. ¡Te esperamos con música, baile y el espíritu más prendido del país!
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

export default Noticia1;