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
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "white", border: "4px solid grey" }}
    >
      <div className="container">


        <Link className="navbar-brand" to="/">
          <img
            src="../src/assets/logo.png"
            alt="LogoFonda"
            style={{ width: "100px", height: "auto" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">


            {esVendedor ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/productos">Productos</Link>
                </li>

                <li className="nav-item">
                  <button className="btn btn-link nav-link text-danger" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/categorias">Categorias</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/ofertas">Ofertas</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/carrito">Carrito</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>

                {!token && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/registro">Registro</Link></li>
                  </>
                )}

                {token && (
                  <li className="nav-item">
                    <button className="btn btn-link nav-link text-danger" onClick={cerrarSesion}>
                      Cerrar sesión
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
