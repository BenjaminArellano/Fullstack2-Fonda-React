import { useEffect, useState } from "react";
import Producto from "../components/Producto";
import DataService from "../utils/DataService";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    DataService.getProductos()
      .then((data) => {
        setProductos(data);
        
        // Extraer categorías únicas
        const catsUnicas = [...new Set(data
          .map(p => p.categoria?.nombre || "Sin categoría")
          .filter(cat => cat)
        )];
        setCategorias(catsUnicas);
        
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setCargando(false);
      });
  }, []);

  // Filtrar productos por categoría
  const productosFiltrados = filtroCategoria === "todos" 
    ? productos 
    : productos.filter(p => p.categoria?.nombre === filtroCategoria);

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
            color: "#FFD700"
          }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h3 className="mt-3" style={{ color: "#0033A0" }}>Cargando productos...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      paddingBottom: "3rem"
    }}>
      {/* Header de productos */}
      <div style={{
        background: "linear-gradient(135deg, rgba(213, 43, 30, 0.9), rgba(0, 51, 160, 0.9))",
        color: "white",
        padding: "3rem 1rem",
        marginBottom: "2rem",
        borderRadius: "0 0 30px 30px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 text-center">
              <h1 className="display-4 fw-bold mb-3" style={{
                background: "linear-gradient(to right, #FFD700, #FFFFFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                Nuestros Productos
              </h1>
              <p className="lead mb-4" style={{
                fontSize: "1.2rem",
                opacity: 0.9,
                maxWidth: "700px",
                margin: "0 auto"
              }}>
                Descubre nuestra selección especial de productos típicos chilenos
              </p>

              {/* Filtros de categorías */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                <button
                  className={`btn ${filtroCategoria === "todos" ? "" : "btn-outline-light"}`}
                  onClick={() => setFiltroCategoria("todos")}
                  style={{
                    background: filtroCategoria === "todos" ? "#FFD700" : "transparent",
                    color: filtroCategoria === "todos" ? "#0033A0" : "white",
                    border: "2px solid white",
                    borderRadius: "25px",
                    padding: "0.5rem 1.5rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (filtroCategoria !== "todos") {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filtroCategoria !== "todos") {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  Todos
                </button>
                
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    className={`btn ${filtroCategoria === categoria ? "" : "btn-outline-light"}`}
                    onClick={() => setFiltroCategoria(categoria)}
                    style={{
                      background: filtroCategoria === categoria ? getCategoriaColor(categoria) : "transparent",
                      color: filtroCategoria === categoria ? "white" : "white",
                      border: "2px solid white",
                      borderRadius: "25px",
                      padding: "0.5rem 1.5rem",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (filtroCategoria !== categoria) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (filtroCategoria !== categoria) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {categoria}
                  </button>
                ))}
              </div>

              
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div style={{
                  height: "2px",
                  width: "50px",
                  background: "#FFD700"
                }}></div>
                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                  {productosFiltrados.length} productos encontrados
                </span>
                <div style={{
                  height: "2px",
                  width: "50px",
                  background: "#FFD700"
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de productos - CORREGIDO */}
      <div className="container">
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: "4rem" }}>🥺</div>
            <h3 style={{ color: "#0033A0" }}>No hay productos en esta categoría</h3>
            <p className="text-muted">Intenta con otra categoría</p>
            <button
              className="btn btn-primary"
              onClick={() => setFiltroCategoria("todos")}
              style={{
                background: "linear-gradient(135deg, #D52B1E, #FF6B6B)",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                fontWeight: "600"
              }}
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {productosFiltrados.map((producto) => (
              <div 
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex" 
                key={producto.prodId}
                style={{
                  animation: "fadeIn 0.5s ease-out",
                  minHeight: "380px" // Altura mínima para consistencia
                }}
              >
                <div className="w-100 h-100">
                  <Producto
                    codigo={producto.prodId}   
                    nombre={producto.nombreProducto}
                    categoria={producto.categoria?.nombre}
                    precio={producto.precioProd}
                    moneda={producto.moneda}
                    imagen={producto.imagen}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer informativo */}
      {productosFiltrados.length > 0 && (
        <div className="container mt-5 pt-4">
          <div className="text-center" style={{
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(77, 150, 255, 0.1))",
            padding: "2rem",
            borderRadius: "20px",
            border: "2px solid rgba(255, 215, 0, 0.3)"
          }}>
            <h4 style={{ color: "#0033A0", marginBottom: "1rem" }}>
              ¿No encuentras lo que buscas?
            </h4>
            <p className="text-muted mb-3">
              Contáctanos y te ayudaremos a encontrar el producto perfecto para ti
            </p>
            <a 
              href="/contacto" 
              className="btn"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "#0033A0",
                border: "2px solid #0033A0",
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
              <i className="bi bi-whatsapp me-2"></i>
              Contactar por WhatsApp
            </a>
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
        
        /* Estilos para asegurar que las tarjetas se vean bien */
        .col-12.col-sm-6.col-md-4.col-lg-3 {
          display: flex;
        }
        
        .col-12.col-sm-6.col-md-4.col-lg-3 > div {
          width: 100%;
        }
        
        /* Ajustes responsivos */
        @media (max-width: 576px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 100%;
            flex: 0 0 100%;
          }
        }
        
        @media (min-width: 576px) and (max-width: 768px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 50%;
            flex: 0 0 50%;
          }
        }
        
        @media (min-width: 768px) and (max-width: 992px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 33.333%;
            flex: 0 0 33.333%;
          }
        }
        
        @media (min-width: 992px) {
          .col-12.col-sm-6.col-md-4.col-lg-3 {
            max-width: 25%;
            flex: 0 0 25%;
          }
        }
      `}</style>
    </div>
  );
}

// Función auxiliar para obtener colores según categoría
function getCategoriaColor(categoria) {
  const colores = {
    "Bebidas": "#4D96FF", // Azul
    "Comidas": "#D52B1E", // Rojo
    "Postres": "#FFD700", // Amarillo
    "Souvenirs": "#2ED573", // Verde
    "Entradas": "#9370DB", // Púrpura
    "Platos principales": "#FF6B6B", // Rojo claro
    "Sin categoría": "#6c757d", // Gris
  };
  
  return colores[categoria] || "#0033A0"; // Azul oscuro por defecto
}

export default Productos;