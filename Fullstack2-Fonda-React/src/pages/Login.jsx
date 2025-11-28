import React, { useState, useEffect } from "react";
import {
  saveToLocalstorage,
  loadFromLocalstorage,
  removeFromLocalstorage,
} from "../utils/localstorageHelper.js";
import { useNavigate } from "react-router-dom";
import DataService from "../utils/DataService";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const IrAHome = (ruta) => {
    navigate(ruta);
  };

  // Si ya existe token, mantener sesión
  useEffect(() => {
    const savedToken = loadFromLocalstorage("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !clave) {
      alert("Debes completar todos los campos.");
      return;
    }

    try {
      // Obtener todos los usuarios desde el backend
      const usuarios = await DataService.getUsuarios();


      // Comparar con correo + clave
      const usuarioEncontrado = usuarios.find(
        (u) => u.correo === correo && u.clave === clave
      );

      if (!usuarioEncontrado) {
        alert("Correo o clave incorrectos");
        return;
      }

      if (usuarioEncontrado.rol === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      // Crear token falso
      const tokenGenerado = Math.random().toString(36).substring(2) + Date.now();

      saveToLocalstorage("token", tokenGenerado);
      saveToLocalstorage("usuarioLogueado", {
      ...usuarioEncontrado,
      clave: "******" 
      });

      setToken(tokenGenerado);

      alert("Sesión iniciada correctamente");

      // Redirección por rol
      if (usuarioEncontrado.rol === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      navigate("/");

      setCorreo("");
      setClave("");

    } catch (error) {
      alert("Error al intentar iniciar sesión");
    }
  };

  const handleLogout = () => {
    removeFromLocalstorage("token");
    removeFromLocalstorage("usuarioLogueado");
    setToken(null);
    alert("Sesión cerrada");
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-5 bg-light p-4 rounded shadow">
        
        {token ? (
          <div className="text-center">
            <h3>Usuario ya logueado</h3>

            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>

            <button
              className="btn btn-success m-4"
              onClick={() => IrAHome("/")}
            >
              Ir a Inicio
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-4">Iniciar sesión</h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label htmlFor="correo" className="form-label fw-bold">
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
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="clave" className="form-label fw-bold">
                  Clave:
                </label>
                <input
                  type="password"
                  id="clave"
                  className="form-control"
                  placeholder="Ingresa tu clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Ingresar
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;
