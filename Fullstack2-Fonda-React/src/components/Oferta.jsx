import { Link } from "react-router-dom";

function Oferta({ codigo, nombre, categoria, precio, moneda, imagen }) {
  return (
    <div className="card h-100" style={{
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 6px 20px rgba(255, 107, 107, 0.2)",
      background: "linear-gradient(135deg, #fff, #fff8f8)",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      width: "100%"  // Importante: ocupa todo el ancho disponible
    }}>
      {/* Ribbon de oferta */}
      <div style={{
        position: "absolute",
        top: "15px",
        right: "-35px",
        background: "linear-gradient(135deg, #FF6B6B, #FF4757)",
        color: "white",
        padding: "6px 35px",
        transform: "rotate(45deg)",
        fontSize: "0.8rem",
        fontWeight: "600",
        zIndex: "1",
        boxShadow: "0 3px 10px rgba(255, 107, 107, 0.3)",
        width: "140px",
        textAlign: "center"
      }}>
        ¡OFERTA!
      </div>
      
      {imagen && (
        <div style={{ 
          overflow: "hidden", 
          height: "200px",
          flexShrink: 0 
        }}>
          <img
            src={imagen}
            className="card-img-top"
            alt={nombre}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>
      )}

      <div className="card-body d-flex flex-column" style={{ 
        padding: "1.5rem",
        flexGrow: 1 
      }}>
        <h5 className="card-title" style={{
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#D52B1E",
          marginBottom: "0.75rem",
          minHeight: "2.2rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical"
        }}>
          {nombre}
        </h5>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <span className="badge" style={{
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#333",
            fontSize: "0.75rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontWeight: "600"
          }}>
            {categoria || "Oferta Especial"}
          </span>
          
          <div style={{ textAlign: "right" }}>
            <p className="mb-1" style={{
              fontSize: "0.85rem",
              color: "#666",
              textDecoration: "line-through"
            }}>
              ${(parseFloat(precio) * 1.2).toFixed(0)} {moneda}
            </p>
            <p className="mb-0" style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#FF4757"
            }}>
              {precio} {moneda}
            </p>
          </div>
        </div>

        <Link
          to={`/oferta/${codigo}`}
          className="btn mt-auto"
          style={{
            background: "linear-gradient(135deg, #FF6B6B, #FF4757)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            fontSize: "0.9rem",
            width: "100%",
            textDecoration: "none",
            textAlign: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(255, 107, 107, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Ver Oferta
        </Link>
      </div>
    </div>
  );
}

export default Oferta;