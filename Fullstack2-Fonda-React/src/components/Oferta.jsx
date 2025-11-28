import { Link } from "react-router-dom";

function Oferta({ codigo, nombre, categoria, precio, moneda, imagen }) {
  return (
    <div
      className="card shadow-sm p-3 mb-5 bg-body rounded"
      style={{ width: "18rem" }}
    >
      {imagen && (
        <img
          src={imagen}
          className="card-img-top"
          alt={nombre}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}

      <div className="card-body text-center">
        <h5 className="card-title">{nombre}</h5>

        <p className="card-text">
          <strong>Categoría:</strong> {categoria || "Sin categoría"}
        </p>

        <p className="card-text">
          <strong>Precio:</strong> {precio} {moneda}
        </p>

        <Link
          to={`/oferta/${codigo}`}
          className="btn btn-primary mt-2"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default Oferta;
