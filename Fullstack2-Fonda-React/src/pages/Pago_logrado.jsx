import React from "react";
import { removeFromLocalstorage } from "../utils/localstorageHelper";
import { useNavigate, useLocation } from "react-router-dom";

function PagoLogrado() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener datos de la boleta si existen
  const boletaNumero = location.state?.boletaNumero || `B${Date.now()}`;
  const total = location.state?.total;
  const fecha = location.state?.fecha;
  const detalles = location.state?.detalles || 0;

  // Limpiar carrito y pagos del localstorage
  const handleInicio = () => {
    removeFromLocalstorage("compra");
    removeFromLocalstorage("pagos");
    navigate("/");
  };

  const handleProductos = () => {
    removeFromLocalstorage("pagos");
    navigate("/productos");
  };

  const handleMisCompras = () => {
    navigate("/mis-compras");
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow text-center">
        <div className="mb-4">
          <h1 className="mb-3">¡Pago Realizado con Éxito!</h1>
          <p className="lead text-muted">Tu compra ha sido procesada exitosamente</p>
        </div>

        {/* Información de la boleta */}
        <div className="alert alert-info mt-3" role="alert">
          <h5 className="alert-heading">Detalles de tu Boleta</h5>
          <hr />
          <div className="text-start">
            <p className="mb-2">
              <strong>N° Boleta:</strong> 
              <span className="badge bg-primary ms-2">{boletaNumero}</span>
            </p>
            <p className="mb-2">
              <strong>Fecha:</strong> {fecha || new Date().toLocaleDateString('es-CL')}
            </p>
            <p className="mb-2">
              <strong>Total Pagado:</strong> 
              <span className="fw-bold text-success ms-2">
                ${total?.toLocaleString("es-CL") || "0"} CLP
              </span>
            </p>
            <p className="mb-0">
              <strong>Estado:</strong> 
              <span className="badge bg-success ms-2">Pagado ✓</span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-muted">
            <strong>Tu boleta ha sido registrada en nuestro sistema</strong>
            <br />
          </p>
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
          <button className="btn btn-primary me-md-2" onClick={handleInicio}>
            Ir al Inicio
          </button>
          <button className="btn btn-success me-md-2" onClick={handleProductos}>
            Seguir Comprando
          </button>
        </div>

        <div className="mt-4 p-3 bg-light rounded">
          <h6>¿Qué sigue?</h6>
          <small className="text-muted">
            • Recibirás un correo de confirmación<br/>
            • Los productos serán enviados según el método seleccionado
          </small>
        </div>

        <div className="mt-4">
          <small className="text-muted">
            ¿Necesitas ayuda? <a href="/contacto" className="text-decoration-none">Contáctanos</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default PagoLogrado;