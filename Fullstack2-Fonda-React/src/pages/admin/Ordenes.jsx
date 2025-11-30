// REEMPLAZA todo el componente Ordenes con esta versión corregida:

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataService from '../../utils/DataService';

const Ordenes = () => {
  const [boletas, setBoletas] = useState([]);
  const [filteredBoletas, setFilteredBoletas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [fechaFilter, setFechaFilter] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [selectedBoleta, setSelectedBoleta] = useState(null);
  const [detallesBoleta, setDetallesBoleta] = useState([]);
  const [showBoletaModal, setShowBoletaModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para boletas - ACTUALIZADO para mapear 'PAGADA' a 'completada'
  const estadosBoleta = [
    { valor: 'todos', label: 'Todos los estados', color: 'secondary' },
    { valor: 'completada', label: 'Completada', color: 'success' },
    { valor: 'pendiente', label: 'Pendiente', color: 'warning' },
    { valor: 'cancelada', label: 'Cancelada', color: 'danger' }
  ];

  // Función para mapear estado de BD a frontend
  const mapearEstado = (estadoBD) => {
    if (estadoBD === 'PAGADA' || estadoBD === 'Pagado') return 'completada';
    return estadoBD ? estadoBD.toLowerCase() : 'desconocido';
  };

  // Función para formatear fecha desde BD
  const parsearFechaBD = (fechaBD) => {
    if (!fechaBD) return new Date();
    
    // Si ya es Date object
    if (fechaBD instanceof Date) return fechaBD;
    
    // Si es string en formato '15/11/24'
    if (typeof fechaBD === 'string' && fechaBD.includes('/')) {
      const [day, month, year] = fechaBD.split('/');
      return new Date(`20${year}-${month}-${day}`);
    }
    
    // Intentar parsear como fecha ISO
    return new Date(fechaBD);
  };

  // Cargar boletas desde el backend
  const cargarBoletas = async () => {
    try {
      setLoading(true);
      const data = await DataService.getBoletas();
      console.log("Boletas cargadas:", data);
      
      // Convertir fechas de BD a Date objects
      const boletasConFecha = data.map(boleta => ({
        ...boleta,
        fecha: parsearFechaBD(boleta.fecha),
        // Mapear estado para display
        estadoDisplay: mapearEstado(boleta.estado)
      }));
      
      setBoletas(boletasConFecha);
      setFilteredBoletas(boletasConFecha);
    } catch (error) {
      console.error("Error al cargar boletas:", error);
      alert("Error al cargar boletas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar detalles de una boleta específica
  const cargarDetallesBoleta = async (boletaId) => {
    try {
      setLoading(true);
      const todosDetalles = await DataService.getDetallesBoletas();
      
      // Filtrar detalles por boletaId
      const detallesFiltrados = todosDetalles.filter(
        detalle => detalle.boleta?.boletaId === boletaId
      );
      
      console.log("Detalles de boleta:", detallesFiltrados);
      setDetallesBoleta(detallesFiltrados);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      alert("Error al cargar detalles: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBoletas();
  }, []);

  useEffect(() => {
    let filtered = boletas;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(boleta => 
        boleta.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boleta.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boleta.rut?.includes(searchTerm)
      );
    }

    // Filtro por estado - CORREGIDO
    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(boleta => {
        const estadoMapeado = mapearEstado(boleta.estado);
        return estadoMapeado === estadoFilter;
      });
    }

    // Filtro por fecha
    if (fechaFilter) {
      const filterDate = new Date(fechaFilter);
      filtered = filtered.filter(boleta => 
        boleta.fecha.toDateString() === filterDate.toDateString()
      );
    }

    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'cliente':
          return (a.cliente || '').localeCompare(b.cliente || '');
        case 'total':
          return (b.total || 0) - (a.total || 0);
        case 'numero':
          return (a.numero || '').localeCompare(b.numero || '');
        case 'fecha':
        default:
          return b.fecha - a.fecha; // Más reciente primero
      }
    });

    setFilteredBoletas(filtered);
  }, [searchTerm, estadoFilter, fechaFilter, sortBy, boletas]);

  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price || 0);
  };

  // Obtener color del estado - CORREGIDO
  const getEstadoColor = (estado) => {
    const estadoMapeado = mapearEstado(estado);
    const estadoObj = estadosBoleta.find(e => e.valor === estadoMapeado);
    return estadoObj ? estadoObj.color : 'secondary';
  };

  // Obtener label del estado - CORREGIDO
  const getEstadoLabel = (estado) => {
    const estadoMapeado = mapearEstado(estado);
    const estadoObj = estadosBoleta.find(e => e.valor === estadoMapeado);
    return estadoObj ? estadoObj.label : estado || 'Desconocido';
  };

  // Mostrar modal de boleta con detalles
  const handleShowBoleta = async (boleta) => {
    setSelectedBoleta(boleta);
    await cargarDetallesBoleta(boleta.boletaId);
    setShowBoletaModal(true);
  };

  // Exportar CSV
  const exportarCSV = () => {
    if (filteredBoletas.length === 0) {
      alert('No hay boletas para exportar');
      return;
    }

    const headers = ['Número', 'Fecha', 'Cliente', 'RUT', 'Total', 'Estado'];
    const csvData = filteredBoletas.map(boleta => [
      boleta.numero,
      formatFecha(boleta.fecha),
      boleta.cliente,
      boleta.rut,
      boleta.total,
      getEstadoLabel(boleta.estado)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boletas-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setEstadoFilter('todos');
    setFechaFilter('');
    setSortBy('fecha');
  };

  // Estadísticas - CORREGIDAS
  const totalVentas = boletas
    .filter(boleta => boleta.estado === 'PAGADA' || boleta.estado === 'Pagado') 
    .reduce((sum, boleta) => sum + (boleta.total || 0), 0);

  const boletasHoy = boletas.filter(boleta => 
    boleta.fecha.toDateString() === new Date().toDateString()
  ).length;

  const boletasCompletadas = boletas.filter(boleta => 
    boleta.estado === 'PAGADA' || boleta.estado === 'Pagado'
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
                <i className="bi bi-receipt me-2"></i>
                Boletas y Órdenes
              </h1>
              <p className="text-muted mb-0">Gestión y visualización de todas las transacciones del sistema</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={exportarCSV}
                disabled={filteredBoletas.length === 0 || loading}
                title="Exportar a CSV"
              >
                <i className="bi bi-file-earmark-spreadsheet me-1"></i> Exportar CSV
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={cargarBoletas}
                disabled={loading}
                title="Actualizar lista"
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas - AHORA DEBERÍAN MOSTRAR DATOS REALES */}
        <div className="col-md-4">
          <div className="card bg-primary bg-opacity-10 border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-primary">{formatPrice(totalVentas)}</h3>
                  <p className="mb-0 text-muted">Ventas totales</p>
                </div>
                <i className="bi bi-currency-dollar text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-success">{boletasCompletadas}</h3>
                  <p className="mb-0 text-muted">Boletas completadas</p>
                </div>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info bg-opacity-10 border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-info">{boletasHoy}</h3>
                  <p className="mb-0 text-muted">Boletas hoy</p>
                </div>
                <i className="bi bi-calendar-day text-info" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.95)'
          }}>
            <div className="card-body">
              <div className="row g-3">
                {/* Búsqueda general */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Búsqueda</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por cliente, número o RUT..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loading}
                    />
                    <button className="btn btn-outline-secondary" type="button" disabled={loading}>
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por estado */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Estado</label>
                  <select 
                    className="form-select"
                    value={estadoFilter}
                    onChange={(e) => setEstadoFilter(e.target.value)}
                    disabled={loading}
                  >
                    {estadosBoleta.map(estado => (
                      <option key={estado.valor} value={estado.valor}>{estado.label}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por fecha */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFilter}
                    onChange={(e) => setFechaFilter(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Ordenamiento */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    disabled={loading}
                  >
                    <option value="fecha">Fecha (reciente)</option>
                    <option value="numero">Número</option>
                    <option value="cliente">Cliente</option>
                    <option value="total">Total</option>
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="col-md-3 d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <button 
                      className="btn btn-outline-secondary flex-fill"
                      onClick={clearFilters}
                      title="Limpiar filtros"
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Mostrando <strong>{filteredBoletas.length}</strong> de <strong>{boletas.length}</strong> boletas
                      {estadoFilter !== 'todos' && ` • Estado: ${getEstadoLabel(estadoFilter)}`}
                      {fechaFilter && ` • Fecha: ${new Date(fechaFilter).toLocaleDateString('es-CL')}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    {filteredBoletas.length !== boletas.length && (
                      <button 
                        className="btn btn-sm btn-link text-muted p-0"
                        onClick={clearFilters}
                        disabled={loading}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Boletas */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm" style={{ 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div className="card-header" style={{ 
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              padding: '1rem 1.25rem'
            }}>
              <h3 className="card-title mb-0" style={{ color: '#333', fontSize: '1.25rem' }}>
                Listado de Boletas
              </h3>
            </div>

            <div className="card-body table-responsive p-0" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <table className="table table-hover text-nowrap mb-0">
                <thead style={{ backgroundColor: 'rgba(248,249,250,0.9)' }}>
                  <tr>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Número</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Fecha</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Cliente</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>RUT</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Total</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Estado</th>
                    <th style={{ 
                      width: '120px', 
                      border: 'none', 
                      padding: '12px 16px', 
                      fontWeight: '600', 
                      color: '#333',
                      textAlign: 'center'
                    }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBoletas.length > 0 ? (
                    filteredBoletas.map(boleta => (
                      <tr key={boleta.boletaId} style={{ 
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666', fontWeight: '500' }}>
                          {boleta.numero || `B${boleta.boletaId}`}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          {formatFecha(boleta.fecha)}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>
                          {boleta.cliente || 'Cliente no especificado'}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          {boleta.rut || 'RUT no especificado'}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>
                          {formatPrice(boleta.total)}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge bg-${getEstadoColor(boleta.estado)}`}>
                            {getEstadoLabel(boleta.estado)}
                          </span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', textAlign: 'center' }}>
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleShowBoleta(boleta)}
                              title="Ver boleta"
                              disabled={loading}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5" style={{ border: 'none' }}>
                        <i className="bi bi-receipt display-4 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>
                          {loading ? 'Cargando boletas...' : 'No se encontraron boletas'}
                        </p>
                        <small className="text-muted">
                          {loading ? 'Por favor espere...' : 'Intenta ajustar los filtros de búsqueda'}
                        </small>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Boleta con Detalles */}
      {showBoletaModal && selectedBoleta && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-receipt me-2"></i>
                  Boleta {selectedBoleta.numero || `B${selectedBoleta.boletaId}`}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowBoletaModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                {/* Encabezado de la boleta */}
                <div className="text-center mb-4">
                  <h4 style={{ color: '#333', fontWeight: 'bold' }}>Fonda Duoc</h4>
                  <p className="text-muted mb-1">Sistema de Gestión de Fondas</p>
                  <p className="text-muted">Boleta Electrónica</p>
                </div>

                {/* Información de la boleta */}
                <div className="row mb-4">
                  <div className="col-6">
                    <strong>Boleta N°:</strong> {selectedBoleta.numero || `B${selectedBoleta.boletaId}`}<br/>
                    <strong>Fecha:</strong> {formatFecha(selectedBoleta.fecha)}<br/>
                    <strong>ID Boleta:</strong> {selectedBoleta.boletaId}
                  </div>
                  <div className="col-6">
                    <strong>Cliente:</strong> {selectedBoleta.cliente || 'No especificado'}<br/>
                    <strong>RUT:</strong> {selectedBoleta.rut || 'No especificado'}<br/>
                    {selectedBoleta.usuario && (
                      <strong>Vendedor:</strong> 
                    )} {selectedBoleta.usuario?.nombreCompleto || 'Sistema'}
                  </div>
                </div>

                {/* Items de la boleta */}
                <div className="table-responsive mb-4">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th style={{ width: '50%' }}>Producto</th>
                        <th style={{ width: '15%' }}>Cantidad</th>
                        <th style={{ width: '15%' }}>Precio Unit.</th>
                        <th style={{ width: '15%' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detallesBoleta.length > 0 ? (
                        detallesBoleta.map((detalle, index) => (
                          <tr key={detalle.detalleId}>
                            <td>{index + 1}</td>
                            <td>
                              {detalle.producto?.nombreProducto || 'Producto no disponible'}
                              <br/>
                              <small className="text-muted">
                                Código: {detalle.producto?.prodId || 'N/A'}
                              </small>
                            </td>
                            <td>{detalle.cantidad}</td>
                            <td>{formatPrice(detalle.precioUnitario)}</td>
                            <td>{formatPrice(detalle.cantidad * detalle.precioUnitario)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-3">
                            {loading ? 'Cargando detalles...' : 'No hay detalles disponibles para esta boleta'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totales */}
                <div className="row justify-content-end">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr className="table-active">
                          <td><strong>Total:</strong></td>
                          <td className="text-end"><strong>{formatPrice(selectedBoleta.total)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Información de estado */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Estado:</strong> <span className={`badge bg-${getEstadoColor(selectedBoleta.estado)}`}>
                        {getEstadoLabel(selectedBoleta.estado)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowBoletaModal(false)}
                  disabled={loading}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordenes;