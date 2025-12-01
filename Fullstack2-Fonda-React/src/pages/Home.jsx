import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0a0a 0%, #2c1810 30%, #4a2c1a 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Imagen de fondo con overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("../src/assets/not.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.4,
        zIndex: 0
      }}></div>
      
      {/* Overlay para mejorar legibilidad */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(213, 43, 30, 0.15), rgba(0, 51, 160, 0.15))",
        zIndex: 1
      }}></div>

      {/* Hero Section - CON LOGO ORIGINAL */}
      <section className="py-5" style={{
        position: "relative",
        zIndex: 2,
        background: "linear-gradient(135deg, rgba(213, 43, 30, 0.9), rgba(0, 51, 160, 0.9))",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
        marginBottom: "3rem",
        overflow: "hidden",
        borderBottom: "5px solid #FFD700"
      }}>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center text-white">
              
              {/* Logo en el hero */}
              <div className="mb-4">
                <img
                  src="../src/assets/logo.png"
                  alt="Logo La Fonda Más Prendida"
                  style={{
                    width: "180px",
                    height: "auto",
                    borderRadius: "12px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                    border: "4px solid #FFD700",
                    backgroundColor: "white",
                    padding: "10px"
                  }}
                />
              </div>
              
              <h1 className="display-4 fw-bold mb-4" style={{
                background: "linear-gradient(to right, #FFD700, #FFA500, #FFFFFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
                fontSize: "3rem"
              }}>
                ¡La Fonda Más Prendida!
              </h1>
              
              <p className="lead mb-5" style={{
                fontSize: "1.4rem",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                padding: "1.5rem",
                borderRadius: "15px",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.2)"
              }}>
                <span style={{ color: "#FFD700" }}>Donde cada septiembre es una fiesta</span><br/>
                <strong style={{ color: "#FFD700" }}>No importa si es after o before...</strong><br/>
                <span style={{ color: "#FF6B6B" }}>¡Aquí tomamos hasta olvidar la llave!</span>
              </p>
              
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link 
                  to="/productos" 
                  className="btn btn-lg px-4 py-3 fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    border: "2px solid white",
                    borderRadius: "50px",
                    minWidth: "220px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 15px rgba(255, 215, 0, 0.4)",
                    color: "#0033A0",
                    fontSize: "1.1rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 215, 0, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(255, 215, 0, 0.4)";
                  }}
                >
                  <i className="bi bi-shop me-2"></i>
                  Ver Productos
                </Link>
                
                <Link 
                  to="/ofertas" 
                  className="btn btn-lg px-4 py-3 fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #D52B1E, #FF5252)",
                    border: "2px solid #FFD700",
                    borderRadius: "50px",
                    minWidth: "220px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 15px rgba(213, 43, 30, 0.4)",
                    color: "white",
                    fontSize: "1.1rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(213, 43, 30, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(213, 43, 30, 0.4)";
                  }}
                >
                  <i className="bi bi-tag-fill me-2"></i>
                  Ofertas Especiales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de métricas con fondo más colorido */}
      <section className="container py-5" style={{ position: "relative", zIndex: 2 }}>
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-10 col-lg-8 text-center">
            <h2 className="display-5 fw-bold mb-4" style={{
              background: "linear-gradient(to right, #FFD700, #FFFFFF, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              position: "relative",
              display: "inline-block",
              padding: "0 20px"
            }}>
              <i className="bi bi-star-fill me-3" style={{ color: "#FFD700" }}></i>
              ¡Somos la mejor opción!
              <i className="bi bi-star-fill ms-3" style={{ color: "#FFD700" }}></i>
            </h2>
            <div className="mb-4" style={{
              height: "4px",
              background: "linear-gradient(90deg, #D52B1E, #FFD700, #0033A0)",
              borderRadius: "2px",
              width: "200px",
              margin: "0 auto"
            }}></div>
          </div>
        </div>

        <div className="row g-4">
          {/* Métrica 1 - Rojo chileno */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 text-white text-center"
              style={{
                background: "linear-gradient(135deg, #D52B1E, #FF6B6B)",
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                boxShadow: "0 15px 35px rgba(213, 43, 30, 0.4)",
                transition: "all 0.4s ease",
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "4px solid #FFD700",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-15px) rotate(3deg)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(213, 43, 30, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) rotate(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(213, 43, 30, 0.4)";
              }}
            >
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "60px",
                height: "60px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%"
              }}></div>
              <i className="bi bi-star-fill mb-3" style={{ fontSize: "3.5rem" }}></i>
              <h3 className="display-4 fw-bold mb-2">4.9</h3>
              <p className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>
                Excelente Calificación
              </p>
            </div>
          </div>

          {/* Métrica 2 - Blanco */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 text-center"
              style={{
                background: "linear-gradient(135deg, #FFFFFF, #E8F4FD)",
                color: "#0033A0",
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
                transition: "all 0.4s ease",
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "4px solid #0033A0"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-15px) rotate(-3deg)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) rotate(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.2)";
              }}
            >
              <i className="bi bi-people-fill mb-3" style={{ fontSize: "3.5rem", color: "#0033A0" }}></i>
              <h3 className="display-4 fw-bold mb-2" style={{ color: "#0033A0" }}>+500</h3>
              <p className="mb-0 fw-bold" style={{ fontSize: "1.2rem", color: "#0033A0" }}>
                Clientes Felices
              </p>
            </div>
          </div>

          {/* Métrica 3 - Azul chileno */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 text-white text-center"
              style={{
                background: "linear-gradient(135deg, #0033A0, #4D96FF)",
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                boxShadow: "0 15px 35px rgba(0, 51, 160, 0.4)",
                transition: "all 0.4s ease",
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "4px solid #FFD700"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-15px) rotate(3deg)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 51, 160, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) rotate(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 51, 160, 0.4)";
              }}
            >
              <i className="bi bi-trophy-fill mb-3" style={{ fontSize: "3.5rem" }}></i>
              <h3 className="display-4 fw-bold mb-2">3</h3>
              <p className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>
                Premios Ganados
              </p>
            </div>
          </div>

          {/* Métrica 4 - Verde festivo */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 h-100 text-white text-center"
              style={{
                background: "linear-gradient(135deg, #007749, #2ED573)",
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                boxShadow: "0 15px 35px rgba(0, 119, 73, 0.4)",
                transition: "all 0.4s ease",
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "4px solid #FFD700"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-15px) rotate(-3deg)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 119, 73, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) rotate(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 119, 73, 0.4)";
              }}
            >
              <i className="bi bi-calendar2-heart-fill mb-3" style={{ fontSize: "3.5rem" }}></i>
              <h3 className="display-4 fw-bold mb-2">5+</h3>
              <p className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>
               Años de Fiesta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de llamado a la acción - AHORA CON PADDING INFERIOR */}
      <section className="container pb-5 mb-5" style={{ 
        position: "relative", 
        zIndex: 2,
        paddingBottom: "100px" // Padding adicional en la parte inferior
      }}>
        <div className="card border-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(213, 43, 30, 0.2), rgba(0, 51, 160, 0.2), rgba(255, 215, 0, 0.2))",
            borderRadius: "25px",
            border: "4px solid #8B4513",
            boxShadow: "0 20px 40px rgba(139, 69, 19, 0.3)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div className="card-body text-center p-5">
            {/* Decoración lateral izquierda */}
            <div style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "4rem",
              color: "#FFD700",
              animation: "float 3s ease-in-out infinite"
            }}>
              
            </div>
            
            {/* Decoración lateral derecha */}
            <div style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "4rem",
              color: "#FFD700",
              animation: "float 3s ease-in-out infinite 0.5s"
            }}>
              
            </div>

            <h3 className="display-5 fw-bold mb-4" style={{
              color: "#FFD700",
              textShadow: "3px 3px 0 #D52B1E"
            }}>
              ¡Este 18 es con nosotros!
            </h3>
            
            <p className="lead mb-4" style={{
              color: "white",
              fontSize: "1.4rem",
              maxWidth: "700px",
              margin: "0 auto",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              padding: "1.5rem",
              borderRadius: "15px",
              border: "2px solid #FFD700"
            }}>
              <span style={{ color: "#FFD700" }}>Empanadas como las de la abuela</span>, 
              <span style={{ color: "#FF6B6B" }}> anticuchos que derriten el alma</span>,<br/>
              <span style={{ color: "#4D96FF" }}> terremotos que hacen temblar</span> y 
              <span style={{ color: "#2ED573" }}> cueca todo el día</span>.
            </p>
            
            <Link 
              to="/contacto" 
              className="btn btn-lg px-5 py-3 fw-bold mt-3"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                border: "3px solid #D52B1E",
                borderRadius: "50px",
                minWidth: "320px",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 25px rgba(255, 215, 0, 0.5)",
                color: "#0033A0",
                fontSize: "1.3rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(255, 215, 0, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(255, 215, 0, 0.5)";
              }}
            >
              <i className="bi bi-whatsapp me-2"></i>
              ¡Reserva por WhatsApp!
            </Link>
          </div>
        </div>
      </section>

      {/* Sección decorativa inferior para llenar espacio */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50px",
        background: "linear-gradient(to top, rgba(26, 10, 10, 1), rgba(26, 10, 10, 0))",
        zIndex: 1
      }}></div>

      {/* Animación CSS global */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #1a0a0a !important; /* Esto es importante */
          margin: 0;
          padding: 0;
        }
        
        .card {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        
        .btn {
          transition: all 0.3s ease !important;
        }
        
        /* Asegurar que el div principal ocupe toda la altura */
        #root, .App {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

export default Home;