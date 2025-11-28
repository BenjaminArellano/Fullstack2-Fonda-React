import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataService from '../../utils/DataService'; // Importar DataService

const merchandisingBandas = '/src/assets/admin/merchandising-bandas.webp';
const vestimentaHuasa = '/src/assets/admin/VestimentaHuaso.jpg';
const panuelosCueca = '/src/assets/admin/panuelos-cueca.jpg';
const ticketsConsumo = '/src/assets/admin/tickets-consumo.jpg';
const entradas = '/src/assets/admin/entradas.jpg';
const imagenDefault = '/src/assets/admin/default.jpg';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '' });
  const [categoriaError, setCategoriaError] = useState('');
  const [loading, setLoading] = useState(false);

  const imagenesCategorias = {
    'Merchandising de Bandas': merchandisingBandas,
    'Vestimenta Huasa': vestimentaHuasa,
    'Pañuelos de Cueca': panuelosCueca,
    'Tickets de Consumo': ticketsConsumo,
    'Entradas': entradas
  };

  const getImagenCategoria = (categoriaNombre) => {
    return imagenesCategorias[categoriaNombre] || imagenDefault;
  };

  // Cargar categorías desde el backend
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      // NOTA: Necesitarás crear estos endpoints en tu backend
      const data = await DataService.getCategorias();
      console.log("Categorías cargadas:", data);
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      // Si falla, usar categorías por defecto
      const categoriasPorDefecto = [
        { catId: 1, nombre: 'Merchandising de Bandas' },
        { catId: 2, nombre: 'Vestimenta Huasa' },
        { catId: 3, nombre: 'Pañuelos de Cueca' },
        { catId: 4, nombre: 'Tickets de Consumo' },
        { catId: 5, nombre: 'Entradas' }
      ];
      setCategorias(categoriasPorDefecto);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos desde el backend
  const cargarProductos = async () => {
    try {
      const data = await DataService.getProductos();
      console.log("Productos cargados:", data);
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos: " + error.message);
    }
  };

  // Agregar nueva categoría al backend
  const handleAgregarCategoria = async () => {
  if (!nuevaCategoria.nombre.trim()) {
    setCategoriaError('El nombre de la categoría es obligatorio');
    return;
  }

  // Validar si ya existe localmente
  if (categorias.some(cat => cat.nombre.toLowerCase() === nuevaCategoria.nombre.trim().toLowerCase())) {
    setCategoriaError('Esta categoría ya existe');
    return;
  }

  try {
    setLoading(true);
    const categoriaData = {
      nombre: nuevaCategoria.nombre.trim()
    };

    console.log("Creando categoría:", categoriaData);
    const categoriaCreada = await DataService.addCategoria(categoriaData);
    
    // Actualizar lista de categorías
    const nuevasCategorias = [...categorias, categoriaCreada];
    setCategorias(nuevasCategorias);
    
    setNuevaCategoria({ nombre: '' });
    setCategoriaError('');
    setShowCategoriaModal(false);
    alert('Categoría creada exitosamente');
  } catch (error) {
    console.error("Error completo al crear categoría:", error);
    
    let errorMessage = "Error al crear categoría";
    if (error.response) {
      // El servidor respondió con un código de error
      errorMessage += `: ${error.response.status} - ${error.response.data?.message || error.response.data}`;
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      errorMessage += ": No se pudo conectar al servidor";
    } else {
      // Algo pasó al configurar la petición
      errorMessage += `: ${error.message}`;
    }
    
    setCategoriaError(errorMessage);
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  useEffect(() => {
    let filtered = productos;

    if (categoriaSeleccionada !== 'todas') {
      filtered = productos.filter(producto => 
        producto.categoria?.nombre === categoriaSeleccionada
      );
    }

    setFilteredProductos(filtered);
  }, [categoriaSeleccionada, productos]);

  const formatPrice = (price, currency = 'CLP') => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getProductosPorCategoria = (categoriaNombre) => {
    return productos.filter(producto => producto.categoria?.nombre === categoriaNombre);
  };

  const totalProductos = productos.length;
  const categoriasConProductos = categorias.filter(cat => 
    productos.some(prod => prod.categoria?.nombre === cat.nombre)
  ).length;

  return (
    <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
      {/* Loading overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* Header y Estadísticas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1" style={{ color: '#333', fontWeight: '600' }}>
                <i className="bi bi-grid me-2"></i>
                Categorías de Productos
              </h1>
              <p className="text-muted mb-0">Explora nuestros productos organizados por categorías</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => setShowCategoriaModal(true)}
                disabled={loading}
              >
                <i className="bi bi-plus-lg me-1"></i> Nueva Categoría
              </button>
              <Link to="/admin/productos" className="btn btn-outline-primary">
                <i className="bi bi-box me-1"></i> Ver Lista Completa
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="col-md-6">
          <div className="card bg-primary bg-opacity-10 border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-primary">{totalProductos}</h3>
                  <p className="mb-0 text-muted">Total de productos</p>
                </div>
                <i className="bi bi-box-seam text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-success">{categoriasConProductos}</h3>
                  <p className="mb-0 text-muted">Categorías con productos</p>
                </div>
                <i className="bi bi-tags text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro de categorías */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.95)'
          }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-muted">Filtrar por categoría</label>
                  <select 
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    disabled={loading}
                  >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map(categoria => (
                      <option key={categoria.catId} value={categoria.nombre}>
                        {categoria.nombre} ({getProductosPorCategoria(categoria.nombre).length})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="text-end">
                    <small className="text-muted">
                      Mostrando <strong>{filteredProductos.length}</strong> productos
                      {categoriaSeleccionada !== 'todas' && ` en ${categoriaSeleccionada}`}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="row">
        {filteredProductos.length > 0 ? (
          filteredProductos.map(producto => (
            <div key={producto.prodId} className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm" style={{ 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                {/* Imagen con contenedor fijo */}
                <div 
                  className="position-relative"
                  style={{
                    height: '200px',
                    overflow: 'hidden',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                >
                  <img 
                    src={getImagenCategoria(producto.categoria?.nombre)} 
                    alt={producto.categoria?.nombre}
                    className="w-100 h-100"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      e.target.src = imagenDefault;
                    }}
                  />
                </div>
                
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary mb-2">
                      {producto.categoria?.nombre || 'Sin categoría'}
                    </span>
                    <h6 className="card-title mb-2" style={{ color: '#333', fontWeight: '600' }}>
                      {producto.nombreProducto}
                    </h6>
                    <p className="card-text text-muted small mb-2">
                      ID: {producto.prodId}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h5 mb-0 text-primary" style={{ fontWeight: '600' }}>
                        {formatPrice(producto.precioProd, producto.moneda)}
                      </span>
                      <span className={`badge ${
                        producto.stock === 0 ? 'bg-danger' : 
                        producto.stock <= producto.stockCritico ? 'bg-warning' : 'bg-success'
                      }`}>
                        {producto.stock} en stock
                      </span>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Link 
                        to="/admin/productos" 
                        className="btn btn-outline-primary btn-sm flex-fill"
                      >
                        <i className="bi bi-pencil me-1"></i> Editar
                      </Link>
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-inboxes display-4 text-muted d-block mb-3"></i>
              <h5 className="text-muted mb-2">No hay productos</h5>
              <p className="text-muted mb-3">
                {categoriaSeleccionada !== 'todas' 
                  ? `No hay productos en la categoría "${categoriaSeleccionada}"`
                  : 'No hay productos registrados en el sistema'
                }
              </p>
              <Link to="/admin/productos" className="btn btn-primary">
                <i className="bi bi-plus-circle me-1"></i> Agregar Productos
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Vista de Categorías Vacías */}
      {categoriaSeleccionada === 'todas' && filteredProductos.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="mb-4" style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
              <i className="bi bi-tags me-2"></i>
              Todas las Categorías
            </h4>
          </div>
          
          {categorias.map(categoria => {
            const productosCategoria = getProductosPorCategoria(categoria.nombre);
            if (productosCategoria.length === 0) return null;
            
            return (
              <div key={categoria.catId} className="col-12 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 style={{ color: '#333', fontWeight: '600' }}>
                    {categoria.nombre} 
                    <span className="badge bg-primary ms-2">{productosCategoria.length}</span>
                  </h5>
                  <Link 
                    to="/admin/productos" 
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="row">
                  {productosCategoria.slice(0, 4).map(producto => (
                    <div key={producto.prodId} className="col-xl-3 col-lg-4 col-md-6 mb-3">
                      <div className="card h-100 shadow-sm" style={{ 
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                      }}>
                        <img 
                          src={getImagenCategoria(producto.categoria?.nombre)} 
                          alt={producto.categoria?.nombre}
                          className="card-img-top"
                          style={{
                            height: '120px',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = imagenDefault;
                          }}
                        />
                        <div className="card-body">
                          <h6 className="card-title" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                            {producto.nombreProducto}
                          </h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-primary fw-bold" style={{ fontSize: '0.8rem' }}>
                              {formatPrice(producto.precioProd, producto.moneda)}
                            </span>
                            <span className={`badge ${
                              producto.stock === 0 ? 'bg-danger' : 'bg-success'
                            }`} style={{ fontSize: '0.7rem' }}>
                              {producto.stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {productosCategoria.length > 4 && (
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      y {productosCategoria.length - 4} productos más...
                    </small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Agregar Nueva Categoría */}
      {showCategoriaModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-tags me-2"></i>
                    Nueva Categoría
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => {
                      setShowCategoriaModal(false);
                      setNuevaCategoria({ nombre: '' });
                      setCategoriaError('');
                    }}
                    disabled={loading}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nombre de la categoría</label>
                    <input
                      type="text"
                      className={`form-control ${categoriaError ? 'is-invalid' : ''}`}
                      value={nuevaCategoria.nombre}
                      onChange={(e) => {
                        setNuevaCategoria({ nombre: e.target.value });
                        if (categoriaError) setCategoriaError('');
                      }}
                      placeholder="Ej: Accesorios, Decoración..."
                      autoFocus
                      disabled={loading}
                    />
                    {categoriaError && <div className="invalid-feedback">{categoriaError}</div>}
                    <div className="form-text">
                      La nueva categoría usará una imagen por defecto.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowCategoriaModal(false);
                      setNuevaCategoria({ nombre: '' });
                      setCategoriaError('');
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleAgregarCategoria}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i> Crear Categoría
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Categorias;