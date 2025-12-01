import React, { useState, useEffect } from "react";
import {
  saveToLocalstorage,
  loadFromLocalstorage,
  removeFromLocalstorage,
} from "../utils/localstorageHelper.js";
import { useNavigate, Link } from "react-router-dom";
import DataService from "../utils/DataService";
import "bootstrap-icons/font/bootstrap-icons.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = loadFromLocalstorage("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!correo || !clave) {
      setError("Debes completar todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const usuarios = await DataService.getUsuarios();
      const usuarioEncontrado = usuarios.find(
        (u) => u.correo === correo && u.clave === clave
      );

      if (!usuarioEncontrado) {
        setError("Correo o clave incorrectos");
        setLoading(false);
        return;
      }

      const tokenGenerado = Math.random().toString(36).substring(2) + Date.now();
      saveToLocalstorage("token", tokenGenerado);
      saveToLocalstorage("usuarioLogueado", {
        ...usuarioEncontrado,
        clave: "******" 
      });

      setToken(tokenGenerado);

      if (usuarioEncontrado.rol === "admin" || usuarioEncontrado.rol === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      navigate("/");
      setCorreo("");
      setClave("");

    } catch (error) {
      setError("Error al intentar iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeFromLocalstorage("token");
    removeFromLocalstorage("usuarioLogueado");
    setToken(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Elementos decorativos */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%"
      }}></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Header */}
            <div className="text-center mb-5">
              <div style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 1.5rem",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(255, 215, 0, 0.4)"
              }}>
                <i className="bi bi-lock-fill" style={{ fontSize: "2rem", color: "#764ba2" }}></i>
              </div>
              <h1 style={{
                color: "white",
                fontWeight: "700",
                marginBottom: "0.5rem",
                fontSize: "2.5rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }}>
                Bienvenido de nuevo
              </h1>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {/* Formulario */}
            <div className="card border-0 shadow-lg" style={{
              borderRadius: "25px",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.95)"
            }}>
              <div className="card-body p-4 p-md-5">
                {token ? (
                  <div className="text-center py-4">
                    <div className="mb-4" style={{ fontSize: "4rem" }}>✅</div>
                    <h3 style={{ color: "#764ba2", marginBottom: "1rem" }}>
                      ¡Ya tienes una sesión activa!
                    </h3>
                    <p className="text-muted mb-4">
                      Puedes continuar navegando o cerrar tu sesión actual
                    </p>
                    <div className="d-flex flex-column gap-3">
                      <button 
                        className="btn"
                        onClick={() => navigate("/")}
                        style={{
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 2rem",
                          borderRadius: "15px",
                          fontWeight: "600",
                          fontSize: "1.1rem"
                        }}
                      >
                        <i className="bi bi-house-door me-2"></i>
                        Ir al Inicio
                      </button>
                      <button 
                        className="btn"
                        onClick={handleLogout}
                        style={{
                          background: "transparent",
                          color: "#667eea",
                          border: "2px solid #667eea",
                          padding: "0.75rem 2rem",
                          borderRadius: "15px",
                          fontWeight: "600",
                          fontSize: "1.1rem"
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert border-0 mb-4" style={{
                        background: "linear-gradient(135deg, #FF6B6B, #D52B1E)",
                        color: "white",
                        borderRadius: "15px",
                        border: "none"
                      }}>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          <div>{error}</div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="correo" className="form-label fw-bold" style={{ color: "#667eea" }}>
                          <i className="bi bi-envelope-fill me-2"></i>
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          id="correo"
                          className="form-control"
                          placeholder="ejemplo@correo.com"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
                          disabled={loading}
                          style={{
                            border: "2px solid #e0e0e0",
                            borderRadius: "12px",
                            padding: "0.75rem 1rem",
                            fontSize: "1rem",
                            transition: "all 0.3s ease"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#667eea";
                            e.target.style.boxShadow = "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="clave" className="form-label fw-bold" style={{ color: "#667eea" }}>
                          <i className="bi bi-key-fill me-2"></i>
                          Contraseña
                        </label>
                        <div className="position-relative">
                          <input
                            type={mostrarClave ? "text" : "password"}
                            id="clave"
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                              border: "2px solid #e0e0e0",
                              borderRadius: "12px",
                              padding: "0.75rem 1rem",
                              fontSize: "1rem",
                              paddingRight: "50px",
                              transition: "all 0.3s ease"
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#667eea";
                              e.target.style.boxShadow = "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e0e0e0";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                          <button
                            type="button"
                            className="btn position-absolute"
                            style={{
                              top: "50%",
                              right: "10px",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              color: "#667eea",
                              padding: "0.25rem"
                            }}
                            onClick={() => setMostrarClave(!mostrarClave)}
                          >
                            <i className={`bi ${mostrarClave ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="recordar"
                            style={{ cursor: "pointer" }}
                          />
                          <label className="form-check-label" htmlFor="recordar" style={{ color: "#666", cursor: "pointer" }}>
                            Recordar mi sesión
                          </label>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="btn w-100 py-3"
                        disabled={loading}
                        style={{
                          background: loading 
                            ? "#cccccc" 
                            : "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          borderRadius: "15px",
                          fontWeight: "600",
                          fontSize: "1.1rem",
                          transition: "all 0.3s ease",
                          marginBottom: "1.5rem"
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Iniciando sesión...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Iniciar Sesión
                          </>
                        )}
                      </button>

                      <div className="text-center mb-4">
                        <Link 
                          to="/recuperar" 
                          style={{
                            color: "#667eea",
                            textDecoration: "none",
                            fontWeight: "500",
                            fontSize: "0.95rem"
                          }}
                        >
                          <i className="bi bi-question-circle me-1"></i>
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>

                      <div className="text-center">
                        <p className="mb-2" style={{ color: "#666" }}>
                          ¿No tienes una cuenta?
                        </p>
                        <Link 
                          to="/registro"
                          className="btn"
                          style={{
                            background: "transparent",
                            color: "#764ba2",
                            border: "2px solid #764ba2",
                            padding: "0.75rem 2rem",
                            borderRadius: "15px",
                            fontWeight: "600",
                            fontSize: "1rem",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center"
                          }}
                        >
                          <i className="bi bi-person-plus me-2"></i>
                          Crear Cuenta
                        </Link>
                      </div>
                    </form>
                  </>
                )}

                {/* Información de correos aceptados */}
                <div className="mt-5 pt-4 border-top">
                  <h6 className="text-muted mb-2">Correos aceptados:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {["@gmail.com", "@duocuc.cl", "@fondaduoc.cl", "@vendedor.cl"].map((domain, idx) => (
                      <span key={idx} className="badge" style={{
                        background: "rgba(102, 126, 234, 0.1)",
                        color: "#667eea",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem"
                      }}>
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;