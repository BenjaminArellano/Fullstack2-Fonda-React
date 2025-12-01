import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Blog() {
  const navigate = useNavigate();

  const verNoticia = (ruta) => {
    navigate(ruta);
  };

  const noticias = [
    {
      id: 1,
      titulo: "¡Nuevos precios especiales para la Fonda Más Prendida!",
      subtitulo: "Ajustamos nuestros precios para que todos puedan celebrar con nosotros",
      descripcion: "Ven a nuestra fonda y disfruta del auténtico sabor de las celebraciones chilenas. Música, comida típica y diversión para toda la familia te esperan en un ambiente lleno de tradición y alegría. Hemos ajustado nuestros precios para hacerlos más accesibles, sin perder la calidad que nos caracteriza.",
      imagen: "src/assets/huasos.png",
      ruta: "/noticia1",
      fecha: "15 Septiembre 2024",
      categoria: "Precios",
      icono: "bi-tags-fill",
      color: "#FFD700"
    },
    {
      id: 2,
      titulo: "¡Participa en los concursos más divertidos!",
      subtitulo: "Gana premios increíbles en nuestras competencias típicas",
      descripcion: "Este año tenemos los concursos más emocionantes de todas las fondas. Desde el tradicional 'palo encebado' hasta competencias de cueca y tomateras. Premios increíbles, risas aseguradas y recuerdos que durarán para toda la vida. ¡No te lo pierdas!",
      imagen: "../src/assets/not.png",
      ruta: "/noticia2",
      fecha: "12 Septiembre 2024",
      categoria: "Eventos",
      icono: "bi-trophy-fill",
      color: "#FF6B6B"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      paddingBottom: "3rem",
    }}>
      {/* Header del blog */}
      <div style={{
        background: "linear-gradient(135deg, #9370DB, #8A2BE2)",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(147, 112, 219, 0.3)"
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
                <i className="bi bi-newspaper me-3"></i>
                Noticias y Blog
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
                Mantente informado sobre las últimas novedades, eventos y promociones
              </p>
              
              <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-calendar-event me-2"></i>
                  <strong>{noticias.length}</strong> noticias publicadas
                </div>
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  backdropFilter: "blur(5px)"
                }}>
                  <i className="bi bi-eye me-2"></i>
                  Más de 500 visitas diarias
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de noticias */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {noticias.map((noticia) => (
            <div 
              key={noticia.id}
              className="col-12 col-md-10 col-lg-8"
            >
              <div className="card border-0 shadow-lg" style={{
                borderRadius: "25px",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                marginBottom: "2rem"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
              }}
              >
                {/* Cabecera de la noticia */}
                <div style={{
                  background: `linear-gradient(135deg, ${noticia.color}, ${noticia.color}99)`,
                  padding: "1.5rem",
                  color: "white"
                }}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                    <div className="d-flex align-items-center gap-2">
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
                        <i className={`bi ${noticia.icono}`}></i>
                      </div>
                      <div>
                        <h3 className="mb-0">{noticia.titulo}</h3>
                        <p className="mb-0 opacity-75">{noticia.subtitulo}</p>
                      </div>
                    </div>
                    <span className="badge mt-2 mt-md-0" style={{
                      background: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "600"
                    }}>
                      {noticia.categoria}
                    </span>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="mb-3 d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <i className="bi bi-calendar" style={{ color: "#6c757d" }}></i>
                          <small className="text-muted">{noticia.fecha}</small>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="bi bi-clock" style={{ color: "#6c757d" }}></i>
                          <small className="text-muted">5 min de lectura</small>
                        </div>
                      </div>
                      
                      <p className="mb-4" style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.8",
                        color: "#495057"
                      }}>
                        {noticia.descripcion}
                      </p>
                      
                      <div className="d-flex flex-wrap gap-2">
                        <button 
                          className="btn"
                          onClick={() => verNoticia(noticia.ruta)}
                          style={{
                            background: "linear-gradient(135deg, #4D96FF, #0033A0)",
                            color: "white",
                            border: "none",
                            padding: "0.75rem 2rem",
                            borderRadius: "15px",
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
                          <i className="bi bi-book me-2"></i>
                          Leer noticia completa
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-md-4 mt-4 mt-md-0">
                      <div style={{
                        borderRadius: "15px",
                        overflow: "hidden",
                        height: "200px",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                      }}>
                        <img 
                          src={noticia.imagen} 
                          alt={noticia.titulo}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de suscripción */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-8">
            <div className="card border-0" style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              borderRadius: "25px",
              overflow: "hidden"
            }}>
              <div className="card-body p-4 p-md-5 text-center">
                <div className="mb-4" style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto",
                  background: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  color: "#FFA500"
                }}>
                  <i className="bi bi-envelope-paper-fill"></i>
                </div>
                
                <h3 style={{ color: "#0033A0", marginBottom: "1rem" }}>
                  Suscríbete a nuestro boletín
                </h3>
                
                <p className="mb-4" style={{ color: "#0033A0", opacity: 0.9 }}>
                  Recibe las últimas noticias, promociones y eventos directamente en tu correo
                </p>
                
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="input-group mb-3">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Tu correo electrónico"
                        style={{
                          border: "none",
                          borderRadius: "15px 0 0 15px",
                          padding: "0.75rem 1.5rem",
                          fontSize: "1rem"
                        }}
                      />
                      <button 
                        className="btn"
                        style={{
                          background: "#0033A0",
                          color: "white",
                          border: "none",
                          borderRadius: "0 15px 15px 0",
                          padding: "0.75rem 2rem",
                          fontWeight: "600"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        Suscribirse
                      </button>
                    </div>
                    <small style={{ color: "#0033A0", opacity: 0.8 }}>
                      <i className="bi bi-shield-check me-1"></i>
                      No compartiremos tu correo con nadie más
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS adicional */}
      <style>{`
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .form-control:focus {
          box-shadow: none;
          border-color: #0033A0;
        }
      `}</style>
    </div>
  );
}

export default Blog;