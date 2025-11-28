import { removeFromLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function PagoLogrado() {
  const navigate = useNavigate();

  // Limpiar carrito y pagos del localstorage
  const handleInicio = () => {
    removeFromLocalstorage("compra");
    removeFromLocalstorage("pagos");
    navigate("/"); // Ir a inicio
  };

  const handleProductos = () => {
    removeFromLocalstorage("pagos");
    navigate("/productos"); // Ir a productos
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow text-center">
        <h1 className="mb-4">¡Pago Realizado con Éxito!</h1>

        <div className="alert alert-success mt-3" role="alert">
          Tu pago se ha procesado correctamente. ¡Gracias por tu compra!
        </div>

        <div className="d-flex justify-content-around mt-4">
          <button className="btn btn-primary" onClick={handleInicio}>
            Ir al Inicio
          </button>
          <button className="btn btn-success" onClick={handleProductos}>
            Ver Productos
          </button>
        </div>
      </div>
    </div>
  );
}

export default PagoLogrado;
