import { useEffect, useState } from "react";
import Oferta from "../components/Oferta";
import DataService from "../utils/DataService";

function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    DataService.getOfertas()
      .then((data) => {
        setOfertas(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando ofertas:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <h2>Cargando ofertas...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center mt-4">
        <div className="row">
          <h1 className="text-center mt-5 mb-5">Ofertas</h1>

          {ofertas.map((oferta) => (
            <div className="col" key={oferta.ofertaId}>
              <Oferta
                codigo={oferta.ofertaId}
                nombre={oferta.nombreOferta}
                categoria={oferta.categoria?.nombre}
                precio={oferta.precioOferta}
                moneda={oferta.moneda}
                imagen={oferta.imagen}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ofertas;
