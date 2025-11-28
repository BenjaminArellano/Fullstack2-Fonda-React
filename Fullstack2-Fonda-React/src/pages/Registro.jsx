import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataService from "../utils/DataService"; 

function Registro() {
  const [rut, setRut] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoConfirm, setCorreoConfirm] = useState("");
  const [claveConfirm, setClaveConfirm] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---- VALIDACIONES ----
    if (rut.length !== 9) {
      alert("El RUT debe tener exactamente 9 caracteres.");
      return;
    }

    const correosValidos = ["@gmail.com", "@duocuc.cl", "@profesor.duoc.cl", "@fondaduoc.cl", "@admin.cl","@vendedor.cl"];
    if (!correosValidos.some(domain => correo.includes(domain))) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }

    if (correo !== correoConfirm) {
      alert("Los correos no coinciden.");
      return;
    }

    const regexClave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if (!regexClave.test(clave)) {
      alert("La clave debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un carácter especial.");
      return;
    }

    if (clave !== claveConfirm) {
      alert("Las claves no coinciden.");
      return;
    }

    if (telefono.length < 8) {
      alert("El teléfono debe tener al menos 8 dígitos.");
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

      alert("Usuario registrado correctamente en el servidor");
      navigate("/Login");
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow">
        <h1 className="mb-4">Registro</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label htmlFor="rut" className="form-label fw-bold">RUT:</label>
            <input
              type="text"
              id="rut"
              className="form-control"
              placeholder="Con dígito verificador, sin puntos o guion"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="nombreCompleto" className="form-label fw-bold">Nombre completo:</label>
            <input
              type="text"
              id="nombreCompleto"
              className="form-control"
              placeholder="Nombre completo"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="correo" className="form-label fw-bold">Correo electrónico:</label>
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
            <label htmlFor="correoConfirm" className="form-label fw-bold">Confirmar correo:</label>
            <input
              type="email"
              id="correoConfirm"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={correoConfirm}
              onChange={(e) => setCorreoConfirm(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="clave" className="form-label fw-bold">Clave:</label>
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

          <div className="mb-3 text-start">
            <label htmlFor="claveConfirm" className="form-label fw-bold">Confirmar clave:</label>
            <input
              type="password"
              id="claveConfirm"
              className="form-control"
              placeholder="Ingresa tu clave"
              value={claveConfirm}
              onChange={(e) => setClaveConfirm(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="telefono" className="form-label fw-bold">Teléfono:</label>
            <input
              type="number"
              id="telefono"
              className="form-control"
              placeholder="ejemplo: 12345678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
