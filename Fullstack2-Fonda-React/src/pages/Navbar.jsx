import { Link, useNavigate } from "react-router-dom";
import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";

function Navbar() {
  const token = loadFromLocalstorage("token");
  const usuario = loadFromLocalstorage("usuarioLogueado");
  const navigate = useNavigate();

  const cerrarSesion = () => {
    removeFromLocalstorage("token");
    removeFromLocalstorage("usuarioLogueado");
    removeFromLocalstorage("compra");
    navigate("/login");
  };

  const esVendedor = usuario?.correo?.toLowerCase().endsWith("@vendedor.cl");

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light sticky-top"
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 249, 250, 0.98))",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderBottom: "3px solid #FFD700",
        padding: "0.5rem 0"
      }}
    >
      <div className="container">
        {/* Logo original */}
        <Link className="navbar-brand" to="/">
          <img
            src="../src/assets/logo.png"
            alt="LogoFonda"
            style={{ 
              width: "100px", 
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }}
          />
        </Link>

        {/* Toggle button simple */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: "1px solid #D52B1E"
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content simplificado */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center">
            {esVendedor ? (
              <>
                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/productos"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(77, 150, 255, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    <i className="bi bi-box-seam me-1"></i>
                    Productos
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={cerrarSesion}
                    style={{
                      fontWeight: "500",
                      padding: "0.4rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      borderWidth: "2px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Links principales */}
                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    Inicio
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/Nosotros"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    Nosotros
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/Blog"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    Noticias
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/productos"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(77, 150, 255, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    Productos
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/categorias"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(77, 150, 255, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    Categorias
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/ofertas"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)";
                      e.currentTarget.style.color = "#D52B1E";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    <span style={{ color: "#D52B1E", fontWeight: "600" }}>Ofertas</span>
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/carrito"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    <i className="bi bi-cart3 me-1"></i>
                    Carrito
                  </Link>
                </li>

                <li className="nav-item mx-1">
                  <Link 
                    className="nav-link" 
                    to="/contacto"
                    style={{
                      color: "#0033A0",
                      fontWeight: "500",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(77, 150, 255, 0.1)";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#0033A0";
                    }}
                  >
                    Contacto
                  </Link>
                </li>

                {/* Login/Registro o Cerrar Sesión */}
                {!token ? (
                  <div className="d-flex">
                    <li className="nav-item mx-1">
                      <Link 
                        className="btn btn-outline-primary btn-sm" 
                        to="/login"
                        style={{
                          fontWeight: "500",
                          padding: "0.4rem 1rem",
                          borderRadius: "6px",
                          transition: "all 0.2s ease",
                          borderWidth: "2px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Login
                      </Link>
                    </li>

                    <li className="nav-item mx-1">
                      <Link 
                        className="btn btn-danger btn-sm" 
                        to="/registro"
                        style={{
                          fontWeight: "500",
                          padding: "0.4rem 1rem",
                          borderRadius: "6px",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <i className="bi bi-person-plus me-1"></i>
                        Registro
                      </Link>
                    </li>
                  </div>
                ) : (
                  <li className="nav-item mx-1">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={cerrarSesion}
                      style={{
                        fontWeight: "500",
                        padding: "0.4rem 1rem",
                        borderRadius: "6px",
                        transition: "all 0.2s ease",
                        borderWidth: "2px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Salir
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;