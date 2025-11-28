import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../utils/DataService";
import {
  loadFromLocalstorage,
  saveToLocalstorage,
} from "../utils/localstorageHelper";

function DetalleOferta() {
  const { id } = useParams();
  const [oferta, setOferta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) {
      console.log("⚠️ ID no recibido");
      setCargando(false);
      return;
    }

    const fetchOferta = async () => {
      try {
        console.log("📌 ID recibido:", id);

        const data = await DataService.getOfertaById(id);

        console.log("📥 Respuesta cruda del backend:", data);

        // Normalización de datos (por si viene diferente)
        const ofertaNormalizada = {
          ofertaId: data.ofertaId ?? data.id ?? data.codigo,
          nombreOferta: data.nombreOferta ?? data.nombre ?? data.titulo,
          categoria: data.categoria?.nombre ?? "Sin categoría",
          precioOferta: data.precioOferta ?? data.precio ?? 0,
          moneda: data.moneda ?? "",
          detalleOferta: data.detalleOferta ?? data.detalle ?? "",
          imagen: data.imagen ?? "",
        };

        console.log("🔎 Oferta normalizada:", ofertaNormalizada);

        setOferta(ofertaNormalizada);
      } catch (error) {
        console.error("❌ Error cargando oferta:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchOferta();
  }, [id]);

  const agregarAlCarrito = () => {
    const carrito = loadFromLocalstorage("compra") || [];

    const ofertaExistente = carrito.find(
      (item) => item.ofertaId === oferta.ofertaId
    );

    if (ofertaExistente) {
      ofertaExistente.cantidad += 1;
    } else {
      carrito.push({ ...oferta, cantidad: 1 });
    }

    saveToLocalstorage("compra", carrito);
    alert(`${oferta.nombreOferta} fue añadida al carrito`);
  };

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <h2>Cargando oferta...</h2>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="container text-center mt-5">
        <h2>Oferta no encontrada</h2>
      </div>
    );
  }

  return (
    <div className="row text-center container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-9 bg-light rounded shadow p-4">

        <h1>{oferta.nombreOferta}</h1>

        <p><strong>Categoría:</strong> {oferta.categoria}</p>
        <p><strong>Precio:</strong> {oferta.precioOferta} {oferta.moneda}</p>
        <p><strong>Detalle:</strong> {oferta.detalleOferta}</p>

        {oferta.imagen && (
          <img
            src={oferta.imagen}
            alt={oferta.nombreOferta}
            style={{ maxWidth: "400px" }}
          />
        )}

        <div className="mt-4">
          <button className="btn btn-success" onClick={agregarAlCarrito}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleOferta;
