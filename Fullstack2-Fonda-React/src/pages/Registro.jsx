import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataService from "../utils/DataService"; 
import "bootstrap-icons/font/bootstrap-icons.css";

function Registro() {
  const [rut, setRut] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoConfirm, setCorreoConfirm] = useState("");
  const [claveConfirm, setClaveConfirm] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarClaveConfirm, setMostrarClaveConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ---- VALIDACIONES ----
    if (rut.length !== 9) {
      setError("El RUT debe tener exactamente 9 caracteres.");
      setLoading(false);
      return;
    }

    const correosValidos = ["@gmail.com", "@duocuc.cl", "@profesor.duoc.cl", "@fondaduoc.cl"];
    if (!correosValidos.some(domain => correo.includes(domain))) {
      setError("Por favor, ingresa un correo válido (@gmail.com, @duocuc.cl, etc.).");
      setLoading(false);
      return;
    }

    if (correo !== correoConfirm) {
      setError("Los correos no coinciden.");
      setLoading(false);
      return;
    }

    const regexClave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if (!regexClave.test(clave)) {
      setError("La clave debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un carácter especial.");
      setLoading(false);
      return;
    }

    if (clave !== claveConfirm) {
      setError("Las claves no coinciden.");
      setLoading(false);
      return;
    }

    if (telefono.length < 8) {
      setError("El teléfono debe tener al menos 8 dígitos.");
      setLoading(false);
      return;
    }

    // ---- Determinar rol ----
    let rol = "cliente"; // por defecto

    if (correo.endsWith("@admin.cl")) {
        rol = "admin";
    } else if (correo.endsWith("@vendedor.cl")) {
        rol = "vendedor";
    }

    // ---- OBJETO PARA ENVIAR AL BACKEND ----
    const nuevoUsuario = {
      rut,
      nombreCompleto,
      correo,
      clave,
      telefono: parseInt(telefono),
      rol
    };

    // ---- PETICIÓN AL SERVIDOR (SPRING BOOT) ----
    try {
      const respuesta = await DataService.addUsuario(nuevoUsuario);

      alert("¡Usuario registrado correctamente! ¡Bienvenido a las Fiestas Patrias!");
      navigate("/Login");
    } catch (error) {
      setError("Error al conectar con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0033A0 0%, #D52B1E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Elementos decorativos patrios */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "150px",
        height: "150px",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%",
        border: "3px dashed #FFD700"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "5%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%",
        border: "3px dashed white"
      }}></div>

      {/* Volantín decorativo */}
      <div style={{
        position: "absolute",
        top: "15%",
        right: "15%",
        width: "80px",
        height: "80px",
        background: "linear-gradient(45deg, #D52B1E, #FFFFFF, #0033A0)",
        transform: "rotate(45deg)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        animation: "flotar 6s ease-in-out infinite"
      }}></div>

      {/* Flor de copihue decorativa */}
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: "15%",
        width: "60px",
        height: "60px",
        background: "#D52B1E",
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        transform: "rotate(180deg)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}></div>

      <style>{`
        @keyframes flotar {
          0%, 100% { transform: rotate(45deg) translateY(0px); }
          50% { transform: rotate(45deg) translateY(-20px); }
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            {/* Header */}
            <div className="text-center mb-4">
              <div style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 1.5rem",
                background: "linear-gradient(135deg, #0033A0, #D52B1E, #FFFFFF)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 25px rgba(0, 51, 160, 0.4)",
                border: "3px solid white"
              }}>
                <i className="bi bi-person-plus-fill" style={{ fontSize: "2.5rem", color: "white" }}></i>
              </div>
              <h1 style={{
                color: "white",
                fontWeight: "700",
                marginBottom: "0.5rem",
                fontSize: "2.8rem",
                textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                background: "linear-gradient(to right, #FFFFFF, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                ¡Únete a la Fiesta!
              </h1>
              <p style={{ 
                color: "#FFD700", 
                fontSize: "1.2rem",
                fontStyle: "italic",
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
              }}>
                Regístrate para celebrar las Fiestas Patrias con nosotros
              </p>
            </div>

            {/* Formulario */}
            <div className="card border-0 shadow-lg" style={{
              borderRadius: "20px",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.95)",
              border: "3px solid #0033A0",
              boxShadow: "0 15px 35px rgba(0, 51, 160, 0.3) !important"
            }}>
              {/* Banda chilena superior */}
              <div style={{
                height: "10px",
                background: "linear-gradient(to right, #0033A0 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #D52B1E 66.66%)",
                width: "100%"
              }}></div>
              
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert border-0 mb-4" style={{
                    background: "linear-gradient(135deg, #D52B1E, #8B0000)",
                    color: "white",
                    borderRadius: "15px",
                    border: "none",
                    fontWeight: "500"
                  }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="rut" className="form-label fw-bold" style={{ 
                        color: "#0033A0",
                        fontSize: "1.1rem"
                      }}>
                        <i className="bi bi-card-checklist me-2" style={{ color: "#D52B1E" }}></i>
                        RUT:
                      </label>
                      <input
                        type="text"
                        id="rut"
                        className="form-control"
                        placeholder="Con dígito verificador, sin puntos o guion"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                          border: "2px solid #0033A0",
                          borderRadius: "10px",
                          padding: "0.75rem 1rem",
                          fontSize: "1rem",
                          transition: "all 0.3s ease",
                          background: "rgba(0, 51, 160, 0.05)"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#D52B1E";
                          e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#0033A0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="nombreCompleto" className="form-label fw-bold" style={{ 
                        color: "#0033A0",
                        fontSize: "1.1rem"
                      }}>
                        <i className="bi bi-person-fill me-2" style={{ color: "#D52B1E" }}></i>
                        Nombre completo:
                      </label>
                      <input
                        type="text"
                        id="nombreCompleto"
                        className="form-control"
                        placeholder="Nombre completo"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                          border: "2px solid #0033A0",
                          borderRadius: "10px",
                          padding: "0.75rem 1rem",
                          fontSize: "1rem",
                          transition: "all 0.3s ease",
                          background: "rgba(0, 51, 160, 0.05)"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#D52B1E";
                          e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#0033A0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="correo" className="form-label fw-bold" style={{ 
                        color: "#0033A0",
                        fontSize: "1.1rem"
                      }}>
                        <i className="bi bi-envelope-fill me-2" style={{ color: "#D52B1E" }}></i>
                        Correo electrónico:
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
                          border: "2px solid #0033A0",
                          borderRadius: "10px",
                          padding: "0.75rem 1rem",
                          fontSize: "1rem",
                          transition: "all 0.3s ease",
                          background: "rgba(0, 51, 160, 0.05)"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#D52B1E";
                          e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#0033A0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="correoConfirm" className="form-label fw-bold" style={{ 
                        color: "#0033A0",
                        fontSize: "1.1rem"
                      }}>
                        <i className="bi bi-envelope-check-fill me-2" style={{ color: "#D52B1E" }}></i>
                        Confirmar correo:
                      </label>
                      <input
                        type="email"
                        id="correoConfirm"
                        className="form-control"
                        placeholder="ejemplo@correo.com"
                        value={correoConfirm}
                        onChange={(e) => setCorreoConfirm(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                          border: "2px solid #0033A0",
                          borderRadius: "10px",
                          padding: "0.75rem 1rem",
                          fontSize: "1rem",
                          transition: "all 0.3s ease",
                          background: "rgba(0, 51, 160, 0.05)"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#D52B1E";
                          e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#0033A0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="clave" className="form-label fw-bold" style={{ 
                        color: "#0033A0",
                        fontSize: "1.1rem"
                      }}>
                        <i className="bi bi-key-fill me-2" style={{ color: "#D52B1E" }}></i>
                        Clave:
                      </label>
                      <div className="position-relative">
                        <input
                          type={mostrarClave ? "text" : "password"}
                          id="clave"
                          className="form-control"
                          placeholder="Ingresa tu clave"
                          value={clave}
                          onChange={(e) => setClave(e.target.value)}
                          required
                          disabled={loading}
                          style={{
                            border: "2px solid #0033A0",
                            borderRadius: "10px",
                            padding: "0.75rem 1rem",
                            fontSize: "1rem",
                            paddingRight: "50px",
                            transition: "all 0.3s ease",
                            background: "rgba(0, 51, 160, 0.05)"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#D52B1E";
                            e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#0033A0";
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
                            color: "#D52B1E",
                            padding: "0.25rem"
                          }}
                          onClick={() => setMostrarClave(!mostrarClave)}
                        >
                          <i className={`bi ${mostrarClave ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <label htmlFor="claveConfirm" className="form-label fw-bold" style={{ 
                        color: "#0033A0",
                        fontSize: "1.1rem"
                      }}>
                        <i className="bi bi-key me-2" style={{ color: "#D52B1E" }}></i>
                        Confirmar clave:
                      </label>
                      <div className="position-relative">
                        <input
                          type={mostrarClaveConfirm ? "text" : "password"}
                          id="claveConfirm"
                          className="form-control"
                          placeholder="Confirma tu clave"
                          value={claveConfirm}
                          onChange={(e) => setClaveConfirm(e.target.value)}
                          required
                          disabled={loading}
                          style={{
                            border: "2px solid #0033A0",
                            borderRadius: "10px",
                            padding: "0.75rem 1rem",
                            fontSize: "1rem",
                            paddingRight: "50px",
                            transition: "all 0.3s ease",
                            background: "rgba(0, 51, 160, 0.05)"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#D52B1E";
                            e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#0033A0";
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
                            color: "#D52B1E",
                            padding: "0.25rem"
                          }}
                          onClick={() => setMostrarClaveConfirm(!mostrarClaveConfirm)}
                        >
                          <i className={`bi ${mostrarClaveConfirm ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="telefono" className="form-label fw-bold" style={{ 
                      color: "#0033A0",
                      fontSize: "1.1rem"
                    }}>
                      <i className="bi bi-telephone-fill me-2" style={{ color: "#D52B1E" }}></i>
                      Teléfono:
                    </label>
                    <input
                      type="number"
                      id="telefono"
                      className="form-control"
                      placeholder="ejemplo: 12345678"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                      disabled={loading}
                      style={{
                        border: "2px solid #0033A0",
                        borderRadius: "10px",
                        padding: "0.75rem 1rem",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                        background: "rgba(0, 51, 160, 0.05)"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#D52B1E";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(213, 43, 30, 0.25)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#0033A0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="alert border-0" style={{
                      background: "rgba(255, 215, 0, 0.1)",
                      color: "#0033A0",
                      borderRadius: "15px",
                      border: "1px solid #FFD700",
                      fontSize: "0.9rem"
                    }}>
                      <i className="bi bi-info-circle-fill me-2" style={{ color: "#D52B1E" }}></i>
                      <strong>Requisitos de clave:</strong> Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un carácter especial.
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn w-100 py-3"
                    disabled={loading}
                    style={{
                      background: loading 
                        ? "#cccccc" 
                        : "linear-gradient(135deg, #0033A0, #D52B1E)",
                      color: "white",
                      border: "none",
                      borderRadius: "50px",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      transition: "all 0.3s ease",
                      marginBottom: "1.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(213, 43, 30, 0.4)";
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
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-flag-fill me-2"></i>
                        ¡Registrarme y Celebrar!
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-2" style={{ color: "#0033A0", fontWeight: "500" }}>
                      ¿Ya tienes una cuenta?
                    </p>
                    <Link 
                      to="/Login"
                      className="btn"
                      style={{
                        background: "transparent",
                        color: "#0033A0",
                        border: "2px solid #0033A0",
                        padding: "0.75rem 2rem",
                        borderRadius: "50px",
                        fontWeight: "600",
                        fontSize: "1rem",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#0033A0";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#0033A0";
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </Link>
                  </div>
                </form>

                {/* Información de correos aceptados */}
                <div className="mt-5 pt-4 border-top" style={{ borderColor: "#0033A0 !important" }}>
                  <h6 className="mb-2" style={{ color: "#0033A0", fontWeight: "600" }}>
                    <i className="bi bi-check-circle me-1" style={{ color: "#D52B1E" }}></i>
                    Dominios de correo aceptados:
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {["@gmail.com", "@duocuc.cl", "@fondaduoc.cl", "@vendedor.cl"].map((domain, idx) => (
                      <span key={idx} className="badge" style={{
                        background: idx % 2 === 0 ? "#0033A0" : "#D52B1E",
                        color: "white",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "500"
                      }}>
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer festivo */}
            <div className="text-center mt-4">
              <p style={{ 
                color: "#FFD700", 
                fontSize: "0.9rem",
                fontStyle: "italic"
              }}>
                <i className="bi bi-emoji-laughing me-1"></i>
                ¡Celebra con nosotros el espíritu chileno!
                <i className="bi bi-emoji-heart-eyes ms-1"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;