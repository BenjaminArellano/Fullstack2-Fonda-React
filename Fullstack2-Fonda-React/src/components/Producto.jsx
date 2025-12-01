import { useNavigate } from "react-router-dom";

function Producto(props) {
  const navigate = useNavigate();
  
  return (
    <div className="card h-100" style={{ 
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      background: "#fff",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      {props.imagen && (
        <div style={{ 
          overflow: "hidden", 
          height: "200px",
          flexShrink: 0 
        }}>
          <img 
            src={props.imagen} 
            alt={props.nombre} 
            className="card-img-top"
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
        padding: "1.25rem",
        flexGrow: 1 
      }}>
        <h5 className="card-title" style={{
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#374850",
          marginBottom: "0.5rem",
          lineHeight: "1.3",
          minHeight: "2.6rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical"
        }}>
          {props.nombre}
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
            background: "linear-gradient(135deg, #6BC5FF, #4D96FF)",
            color: "white",
            fontSize: "0.75rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontWeight: "500"
          }}>
            {props.categoria || "Sin categoría"}
          </span>
          
          <h2 className="mb-0" style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#0D47A1",
            textAlign: "right"
          }}>
            ${props.precio} {props.moneda}
          </h2>
        </div>
        
        <button 
          className="btn mt-auto"
          onClick={() => navigate(`/producto/${props.codigo}`)}
          style={{
            background: "linear-gradient(135deg, #0D47A1, #1976D2)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            fontSize: "0.9rem",
            width: "100%"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(13, 71, 161, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}

export default Producto;