import { useEffect, useState } from "react";
import Oferta from "../components/Oferta";
import DataService from "../utils/DataService";

function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    DataService.getOfertas()
      .then((data) => {
        setOfertas(data);
        
        // Extraer categorías únicas
        const catsUnicas = [...new Set(data
          .map(o => o.categoria?.nombre || "Ofertas Especiales")
          .filter(cat => cat)
        )];
        setCategorias(catsUnicas);
        
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando ofertas:", err);
        setCargando(false);
      });
  }, []);

  // Filtrar ofertas por categoría
  const ofertasFiltradas = filtroCategoria === "todos" 
    ? ofertas 
    : ofertas.filter(o => o.categoria?.nombre === filtroCategoria);

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
          <h3 className="mt-3" style={{ color: "#D52B1E" }}>Cargando ofertas especiales...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)",
      paddingBottom: "3rem"
    }}>
      {/* Header de ofertas - Estilo especial */}
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
        {/* Elemento decorativo */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "4rem",
          opacity: 0.2,
          transform: "rotate(15deg)"
        }}>
          
        </div>
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <h1 className="display-4 fw-bold mb-3" style={{
                background: "linear-gradient(to right, #FFD700, #FFFFFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                ¡Ofertas Especiales!
              </h1>
              
              <p className="lead mb-4" style={{
                fontSize: "1.3rem",
                opacity: 0.95,
                maxWidth: "700px",
                margin: "0 auto",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                borderRadius: "15px",
                backdropFilter: "blur(5px)"
              }}>
                Aprovecha nuestras promociones exclusivas por tiempo limitado 
              </p>
              
              {/* Contador de ofertas */}
              <div className="mb-4" style={{
                background: "rgba(255, 255, 255, 0.2)",
                padding: "1rem",
                borderRadius: "15px",
                display: "inline-block",
                backdropFilter: "blur(5px)"
              }}>
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div style={{
                    width: "10px",
                    height: "10px",
                    background: "#FFD700",
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite"
                  }}></div>
                  <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                    {ofertasFiltradas.length} ofertas activas
                  </span>
                  <div style={{
                    width: "10px",
                    height: "10px",
                    background: "#FFD700",
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite 0.5s"
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de ofertas - CORREGIDO */}
      <div className="container">
        {ofertasFiltradas.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: "5rem" }}></div>
            <h3 style={{ color: "#D52B1E" }}>¡No hay ofertas disponibles!</h3>
            <p className="text-muted mb-3">Vuelve pronto para nuevas promociones</p>
            <a 
              href="/productos" 
              className="btn"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "#D52B1E",
                border: "2px solid #D52B1E",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                fontWeight: "600",
                textDecoration: "none",
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
              <i className="bi bi-arrow-left me-2"></i>
              Ver productos regulares
            </a>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {ofertasFiltradas.map((oferta) => (
              <div 
                className="col-12 col-sm-6 col-md-4 col-lg-3" 
                key={oferta.ofertaId}
                style={{
                  animation: "fadeIn 0.5s ease-out",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <div style={{ width: "100%", maxWidth: "300px" }}>
                  <Oferta
                    codigo={oferta.ofertaId}
                    nombre={oferta.nombreOferta}
                    categoria={oferta.categoria?.nombre}
                    precio={oferta.precioOferta}
                    moneda={oferta.moneda}
                    imagen={oferta.imagen}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Banner de tiempo limitado */}
      {ofertasFiltradas.length > 0 && (
        <div className="container mt-5">
          <div className="alert border-0" style={{
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#D52B1E",
            borderRadius: "15px",
            border: "3px dashed #D52B1E",
            padding: "1.5rem"
          }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "#D52B1E",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.2rem"
                }}>
                  
                </div>
                <div>
                  <h5 className="mb-1 fw-bold">¡Ofertas por tiempo limitado!</h5>
                  <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                    Estas promociones terminan pronto, no te las pierdas
                  </p>
                </div>
              </div>
              <button
                className="btn btn-sm mt-2 mt-sm-0"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  background: "#D52B1E",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  fontWeight: "600"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <i className="bi bi-arrow-up me-1"></i>
                Ver todas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animación CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.8; 
          }
        }
        
        /* Estilos para asegurar que las tarjetas mantengan su proporción */
        .col-12.col-sm-6.col-md-4.col-lg-3 {
          display: flex;
          justify-content: center;
        }
        
        /* Ajustes responsivos específicos para ofertas */
        @media (max-width: 576px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 100%;
            flex: 0 0 100%;
          }
          
          .col-12.col-sm-6.col-md-4.col-lg-3 > div {
            max-width: 100%;
          }
        }
        
        @media (min-width: 576px) and (max-width: 768px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 50%;
            flex: 0 0 50%;
          }
          
          .col-12.col-sm-6.col-md-4.col-lg-3 > div {
            max-width: 100%;
          }
        }
        
        @media (min-width: 768px) and (max-width: 992px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 33.333%;
            flex: 0 0 33.333%;
          }
          
          .col-12.col-sm-6.col-md-4.col-lg-3 > div {
            max-width: 100%;
          }
        }
        
        @media (min-width: 992px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 25%;
            flex: 0 0 25%;
          }
          
          .col-12.col-sm-6.col-md-4.col-lg-3 > div {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}

// Función auxiliar para obtener colores según categoría (versión ofertas)
function getCategoriaColorOferta(categoria) {
  const colores = {
    "Bebidas": "#FF6B6B", // Rojo claro
    "Comidas": "#FF8E53", // Naranja
    "Postres": "#FFD166", // Amarillo pastel
    "Souvenirs": "#06D6A0", // Verde pastel
    "Entradas": "#FF9A8B", // Salmón
    "Platos principales": "#FF6B6B", // Rojo
    "Ofertas Especiales": "#FF4757", // Rojo intenso
    "Sin categoría": "#FF9A76", // Coral
  };
  
  return colores[categoria] || "#FF4757"; // Rojo intenso por defecto
}

export default Ofertas;