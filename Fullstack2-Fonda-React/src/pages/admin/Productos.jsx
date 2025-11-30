import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataService from '../../utils/DataService';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [stockFilter, setStockFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('prodId');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombreProducto: '',
    detalleProd: '',
    precioProd: '',
    moneda: 'CLP',
    imagen: '',
    stock: 0,           
    stockCritico: 5,    
    categoria: { catId: '' } // Inicialmente vacío
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados para categorías - AHORA DESDE LA BD
  const [categorias, setCategorias] = useState([]);

  // Reportes (por ahora estáticos)
  const [reportes] = useState({
    productosMasVendidos: [
      { nombre: 'Polera Banda "Santaferia"', ventas: 45, ingresos: 674550 },
      { nombre: 'Entrada General Zona A', ventas: 38, ingresos: 456000 },
      { nombre: 'Vale "Terremoto"', ventas: 32, ingresos: 128000 },
      { nombre: 'Pañuelo Bordado', ventas: 28, ingresos: 167720 },
      { nombre: 'Vale "Empanada"', ventas: 25, ingresos: 75000 }
    ],
    productosMenosVendidos: [
      { nombre: 'Poncho Tradicional', ventas: 3, ingresos: 119970 },
      { nombre: 'Entrada VIP', ventas: 8, ingresos: 200000 },
      { nombre: 'Chupalla de Paja', ventas: 12, ingresos: 119880 },
      { nombre: 'Polera "Ráfaga"', ventas: 15, ingresos: 224850 },
      { nombre: 'Vale "Mote con Huesillo"', ventas: 18, ingresos: 45000 }
    ],
    tendenciasCategorias: [
      { categoria: 'Merchandising de Bandas', porcentaje: 35, tendencia: '↑' },
      { categoria: 'Entradas', porcentaje: 28, tendencia: '↑' },
      { categoria: 'Tickets de Consumo', porcentaje: 22, tendencia: '→' },
      { categoria: 'Vestimenta Huasa', porcentaje: 10, tendencia: '↓' },
      { categoria: 'Pañuelos de Cueca', porcentaje: 5, tendencia: '→' }
    ]
  });

  // Cargar productos desde el backend
  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await DataService.getProductos();
      console.log("Productos cargados:", data);
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías DESDE LA BASE DE DATOS
  const cargarCategorias = async () => {
    try {
      console.log("🔄 Cargando categorías desde la base de datos...");
      const data = await DataService.getCategorias();
      console.log("✅ Categorías cargadas:", data);
      
      if (data && data.length > 0) {
        setCategorias(data);
        // Si hay categorías, establecer la primera como valor por defecto
        if (!formData.categoria.catId && data[0]) {
          setFormData(prev => ({
            ...prev,
            categoria: { catId: data[0].catId }
          }));
        }
      } else {
        console.warn("⚠️ No se encontraron categorías en la base de datos");
        setCategorias([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
      alert("Error al cargar categorías: " + error.message);
      setCategorias([]);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  useEffect(() => {
    let filtered = productos;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto => 
        producto.nombreProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.detalleProd?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.categoria?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoriaFilter !== 'todas') {
      filtered = filtered.filter(producto => 
        producto.categoria?.nombre === categoriaFilter
      );
    }

    // ✅ FILTRO POR STOCK REAL
    if (stockFilter === 'sin-stock') {
      filtered = filtered.filter(producto => producto.stock === 0);
    } else if (stockFilter === 'stock-critico') {
      filtered = filtered.filter(producto => 
        producto.stock > 0 && producto.stock <= producto.stockCritico
      );
    } else if (stockFilter === 'con-stock') {
      filtered = filtered.filter(producto => producto.stock > 0);
    }

    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'nombreProducto':
          return (a.nombreProducto || '').localeCompare(b.nombreProducto || '');
        case 'precioProd':
          return (b.precioProd || 0) - (a.precioProd || 0);
        case 'categoria':
          return (a.categoria?.nombre || '').localeCompare(b.categoria?.nombre || '');
        case 'stock':
          return (a.stock || 0) - (b.stock || 0);
        case 'prodId':
        default:
          return (a.prodId || 0) - (b.prodId || 0);
      }
    });

    setFilteredProductos(filtered);
  }, [searchTerm, categoriaFilter, stockFilter, sortBy, productos]);

  // Validación del formulario - ACTUALIZADA
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombreProducto.trim()) {
      nuevosErrores.nombreProducto = 'El nombre es obligatorio';
    }

    if (!formData.precioProd || formData.precioProd <= 0) {
      nuevosErrores.precioProd = 'El precio debe ser mayor a 0';
    }

    if (!formData.detalleProd.trim()) {
      nuevosErrores.detalleProd = 'La descripción es obligatoria';
    }

    if (formData.stock < 0) {
      nuevosErrores.stock = 'El stock no puede ser negativo';
    }

    if (!formData.stockCritico || formData.stockCritico <= 0) {
      nuevosErrores.stockCritico = 'El stock crítico debe ser mayor a 0';
    }

    // Validar que se haya seleccionado una categoría
    if (!formData.categoria.catId) {
      nuevosErrores.categoria = 'Debe seleccionar una categoría';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar apertura de modales - ACTUALIZADO
  const handleOpenAddModal = () => {
    // Establecer la primera categoría como valor por defecto si existe
    const primeraCategoria = categorias.length > 0 ? categorias[0].catId : '';
    
    setFormData({
      nombreProducto: '',
      detalleProd: '',
      precioProd: '',
      moneda: 'CLP',
      imagen: '',
      stock: 0,
      stockCritico: 5,
      categoria: { catId: primeraCategoria }
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEditModal = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      nombreProducto: producto.nombreProducto || '',
      detalleProd: producto.detalleProd || '',
      precioProd: producto.precioProd || '',
      moneda: producto.moneda || 'CLP',
      imagen: producto.imagen || '',
      stock: producto.stock || 0,
      stockCritico: producto.stockCritico || 5,
      categoria: producto.categoria || { catId: categorias.length > 0 ? categorias[0].catId : '' }
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedProducto(null);
    setErrors({});
  };

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    if (field === 'categoria') {
      setFormData(prev => ({
        ...prev,
        categoria: { catId: parseInt(value) }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Manejar envío del formulario - ACTUALIZADO CON STOCK
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const productoData = {
        nombreProducto: formData.nombreProducto.trim(),
        detalleProd: formData.detalleProd.trim(),
        precioProd: parseInt(formData.precioProd),
        moneda: formData.moneda,
        imagen: formData.imagen || "",
        stock: parseInt(formData.stock),
        stockCritico: parseInt(formData.stockCritico),
        categoria: { 
          catId: parseInt(formData.categoria.catId)
        }
      };

      console.log("📤 Enviando producto:", productoData);

      if (showAddModal) {
        await DataService.addProducto(productoData);
        alert('✅ Producto creado exitosamente');
      } else if (showEditModal && selectedProducto) {
        productoData.prodId = selectedProducto.prodId;
        await DataService.updateProducto(productoData);
        alert('✅ Producto actualizado exitosamente');
      }

      await cargarProductos();
      handleCloseModals();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
      
      let errorMessage = "Error al guardar producto";
      try {
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || errorData;
      } catch {
        errorMessage = error.message;
      }
      
      alert("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDeleteProducto = async (id) => {
  const producto = productos.find(p => p.prodId === id);
  
  if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${producto?.nombreProducto}"?`)) {
    try {
      setLoading(true);
      
      // Llamar al servicio de eliminación
      const response = await DataService.deleteProducto(id);
      
      console.log("✅ Producto eliminado exitosamente:", response);
      
      // Mostrar mensaje de éxito
      if (typeof response === 'string') {
        alert(response); // Si el backend devuelve texto plano
      } else {
        alert('✅ Producto eliminado exitosamente');
      }
      
      // Recargar la lista de productos
      await cargarProductos();
      
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
      
      // Manejar diferentes tipos de error
      let errorMessage = "Error al eliminar producto";
      
      try {
        // Intentar parsear como JSON primero
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || errorData;
      } catch (parseError) {
        // Si no es JSON, usar el mensaje directamente
        errorMessage = error.message || "Error desconocido al eliminar producto";
      }
      
      alert("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  }
};

  const clearFilters = () => {
    setSearchTerm('');
    setCategoriaFilter('todas');
    setStockFilter('todos');
    setSortBy('prodId');
  };

  // ✅ ESTADÍSTICAS REALES CON STOCK
  const productosSinStock = productos.filter(p => p.stock === 0).length;
  const productosStockCritico = productos.filter(p => 
    p.stock > 0 && p.stock <= p.stockCritico
  ).length;
  const productosDisponibles = productos.filter(p => p.stock > 0).length;

  // Formatear precio
  const formatPrice = (price, currency = 'CLP') => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  // ✅ Función para obtener color del stock
  const getStockColor = (stock, stockCritico) => {
    if (stock === 0) return 'danger';
    if (stock <= stockCritico) return 'warning';
    return 'success';
  };

  // ✅ Función para obtener texto del estado de stock
  const getStockStatus = (stock, stockCritico) => {
    if (stock === 0) return 'Sin Stock';
    if (stock <= stockCritico) return 'Stock Crítico';
    return 'Disponible';
  };

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

      {/* Filtros avanzados */}
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
                      placeholder="Buscar por nombre, descripción o categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loading}
                    />
                    <button className="btn btn-outline-secondary" type="button" disabled={loading}>
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por categoría - AHORA CON CATEGORÍAS REALES */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Categoría</label>
                  <select 
                    className="form-select"
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                    disabled={loading}
                  >
                    <option value="todas">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat.catId} value={cat.nombre}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ FILTRO POR STOCK MEJORADO */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Estado Stock</label>
                  <select 
                    className="form-select"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    disabled={loading}
                  >
                    <option value="todos">Todos</option>
                    <option value="con-stock">Con Stock</option>
                    <option value="stock-critico">Stock Crítico</option>
                    <option value="sin-stock">Sin Stock</option>
                  </select>
                </div>

                {/* Ordenamiento - ACTUALIZADO */}
                <div className="col-md-2">
                  <label className="form-label small fw-bold text-muted">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    disabled={loading}
                  >
                    <option value="prodId">ID</option>
                    <option value="nombreProducto">Nombre</option>
                    <option value="precioProd">Precio</option>
                    <option value="categoria">Categoría</option>
                    <option value="stock">Stock</option>
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
                    <button 
                      className="btn btn-primary flex-fill"
                      onClick={handleOpenAddModal}
                      title="Agregar producto"
                      disabled={loading || categorias.length === 0}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Mostrando <strong>{filteredProductos.length}</strong> de <strong>{productos.length}</strong> productos
                      {categoriaFilter !== 'todas' && ` • Categoría: ${categoriaFilter}`}
                      {stockFilter !== 'todos' && ` • Stock: ${
                        stockFilter === 'sin-stock' ? 'Sin Stock' : 
                        stockFilter === 'stock-critico' ? 'Crítico' : 'Con Stock'
                      }`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    <div className="d-flex gap-2">
                      {categorias.length === 0 && (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          No hay categorías disponibles
                        </span>
                      )}
                      {filteredProductos.length !== productos.length && (
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
      </div>

      {/* ✅ TARJETAS DE ESTADÍSTICAS ACTUALIZADAS CON STOCK REAL */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-danger bg-opacity-10 border-danger">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-danger">{productosSinStock}</h3>
                  <p className="mb-0 text-muted">Sin Stock</p>
                </div>
                <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning bg-opacity-10 border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-warning">{productosStockCritico}</h3>
                  <p className="mb-0 text-muted">Stock Crítico</p>
                </div>
                <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success bg-opacity-10 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-success">{productosDisponibles}</h3>
                  <p className="mb-0 text-muted">Disponibles</p>
                </div>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info bg-opacity-10 border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="text-info">{productos.length}</h3>
                  <p className="mb-0 text-muted">Total Productos</p>
                </div>
                <i className="bi bi-box-seam text-info" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ TABLA DE PRODUCTOS ACTUALIZADA CON STOCK */}
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
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0" style={{ color: '#333', fontSize: '1.25rem' }}>
                  Listado de Productos
                </h3>
                
                {/* Información de filtros activos */}
                <div className="d-flex gap-2">
                  {categoriaFilter !== 'todas' && (
                    <span className="badge bg-primary">
                      Categoría: {categoriaFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setCategoriaFilter('todas')}
                        disabled={loading}
                      ></button>
                    </span>
                  )}
                  {stockFilter !== 'todos' && (
                    <span className="badge bg-info text-dark">
                      Stock: {stockFilter === 'sin-stock' ? 'Sin Stock' : 
                             stockFilter === 'stock-critico' ? 'Crítico' : 'Con Stock'}
                      <button 
                        className="btn-close ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setStockFilter('todos')}
                        disabled={loading}
                      ></button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="badge bg-secondary">
                      Búsqueda: {searchTerm}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSearchTerm('')}
                        disabled={loading}
                      ></button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="card-body table-responsive p-0" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <table className="table table-hover text-nowrap mb-0">
                <thead style={{ backgroundColor: 'rgba(248,249,250,0.9)' }}>
                  <tr>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>ID</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Nombre</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Categoría</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Precio</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Stock</th>
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
                  {filteredProductos.length > 0 ? (
                    filteredProductos.map(producto => (
                      <tr key={producto.prodId} style={{ 
                        backgroundColor: producto.stock === 0 ? 'rgba(220,53,69,0.05)' : 
                                       producto.stock <= producto.stockCritico ? 'rgba(255,193,7,0.05)' : 'rgba(255,255,255,0.8)',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666', fontWeight: '500' }}>
                          {producto.prodId}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>
                          {producto.nombreProducto}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>
                          {producto.categoria?.nombre || 'Sin categoría'}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666', fontWeight: '500' }}>
                          {formatPrice(producto.precioProd, producto.moneda)}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge bg-${getStockColor(producto.stock, producto.stockCritico)}`}>
                            {producto.stock} unidades
                          </span>
                          {producto.stock > 0 && producto.stock <= producto.stockCritico && (
                            <small className="text-warning ms-1">
                              <i className="bi bi-exclamation-triangle"></i>
                            </small>
                          )}
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge bg-${getStockColor(producto.stock, producto.stockCritico)}`}>
                            {getStockStatus(producto.stock, producto.stockCritico)}
                          </span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', textAlign: 'center' }}>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleOpenEditModal(producto)}
                            title="Editar producto"
                            disabled={loading}
                            style={{ 
                              border: '1px solid #007bff',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProducto(producto.prodId)}
                            title="Eliminar producto"
                            disabled={loading}
                            style={{ 
                              border: '1px solid #dc3545',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5" style={{ border: 'none' }}>
                        <i className="bi bi-box display-4 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>
                          {loading ? 'Cargando productos...' : 'No se encontraron productos'}
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

      {/* Reportes de Productos */}
      <div className="row mt-5">
        <div className="col-12">
          <h4 className="mb-4" style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
            <i className="bi bi-graph-up me-2"></i>
            Reportes y Análisis de Productos
          </h4>
        </div>

        {/* Productos Más Vendidos */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">
                <i className="bi bi-trophy me-2"></i>
                Top 5 - Más Vendidos
              </h6>
            </div>
            <div className="card-body">
              {reportes.productosMasVendidos.map((producto, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{producto.nombre}</h6>
                    <small className="text-muted">{producto.ventas} ventas</small>
                  </div>
                  <div className="text-end">
                    <strong className="text-success">{formatPrice(producto.ingresos)}</strong>
                    <div className="badge bg-success bg-opacity-20 text-success ms-2">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos Menos Vendidos */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">
                <i className="bi bi-arrow-down me-2"></i>
                Menos Vendidos
              </h6>
            </div>
            <div className="card-body">
              {reportes.productosMenosVendidos.map((producto, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{producto.nombre}</h6>
                    <small className="text-muted">{producto.ventas} ventas</small>
                  </div>
                  <div className="text-end">
                    <strong className="text-warning">{formatPrice(producto.ingresos)}</strong>
                    <div className={`badge ${
                      producto.ventas < 10 ? 'bg-danger bg-opacity-20 text-danger' : 'bg-warning bg-opacity-20 text-warning'
                    } ms-2`}>
                      {producto.ventas < 10 ? 'Bajo' : 'Medio'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tendencias por Categoría */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                Tendencias por Categoría
              </h6>
            </div>
            <div className="card-body">
              {reportes.tendenciasCategorias.map((categoria, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{categoria.categoria}</h6>
                    <div className="progress" style={{ height: '6px', width: '120px' }}>
                      <div 
                        className={`progress-bar ${
                          categoria.tendencia === '↑' ? 'bg-success' : 
                          categoria.tendencia === '↓' ? 'bg-danger' : 'bg-warning'
                        }`} 
                        style={{ width: `${categoria.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong>{categoria.porcentaje}%</strong>
                    <span className={`badge ${
                      categoria.tendencia === '↑' ? 'bg-success' : 
                      categoria.tendencia === '↓' ? 'bg-danger' : 'bg-warning'
                    } ms-2`}>
                      {categoria.tendencia}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL AGREGAR PRODUCTO ACTUALIZADO CON STOCK */}
      {/* ✅ MODAL AGREGAR PRODUCTO ACTUALIZADO CON CATEGORÍAS REALES */}
{showAddModal && (
  <>
    <div className="modal-backdrop show"></div>
    <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              Agregar Nuevo Producto
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleCloseModals}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Categoría *</label>
                  <select
                    className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
                    value={formData.categoria.catId || ''}
                    onChange={(e) => handleFormChange('categoria', e.target.value)}
                    disabled={loading || categorias.length === 0}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.catId} value={categoria.catId}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
                  {categorias.length === 0 && (
                    <div className="form-text text-warning">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      No hay categorías disponibles. Crea categorías primero.
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre del Producto *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombreProducto ? 'is-invalid' : ''}`}
                    value={formData.nombreProducto}
                    onChange={(e) => handleFormChange('nombreProducto', e.target.value)}
                    placeholder="Ingrese nombre del producto"
                    disabled={loading}
                  />
                  {errors.nombreProducto && <div className="invalid-feedback">{errors.nombreProducto}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción *</label>
                  <textarea
                    className={`form-control ${errors.detalleProd ? 'is-invalid' : ''}`}
                    value={formData.detalleProd}
                    onChange={(e) => handleFormChange('detalleProd', e.target.value)}
                    placeholder="Ingrese descripción del producto"
                    rows="3"
                    disabled={loading}
                  />
                  {errors.detalleProd && <div className="invalid-feedback">{errors.detalleProd}</div>}
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">Precio *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.precioProd ? 'is-invalid' : ''}`}
                    value={formData.precioProd}
                    onChange={(e) => handleFormChange('precioProd', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="1"
                    disabled={loading}
                  />
                  {errors.precioProd && <div className="invalid-feedback">{errors.precioProd}</div>}
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">Moneda</label>
                  <select
                    className="form-select"
                    value={formData.moneda}
                    onChange={(e) => handleFormChange('moneda', e.target.value)}
                    disabled={loading}
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                {/* ✅ CAMPOS DE STOCK AGREGADOS */}
                <div className="col-6">
                  <label className="form-label fw-semibold">Stock *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                    value={formData.stock}
                    onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    disabled={loading}
                  />
                  {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                  <div className="form-text">Cantidad disponible en inventario</div>
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">Stock Crítico *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.stockCritico ? 'is-invalid' : ''}`}
                    value={formData.stockCritico}
                    onChange={(e) => handleFormChange('stockCritico', parseInt(e.target.value) || 0)}
                    placeholder="5"
                    min="1"
                    disabled={loading}
                  />
                  {errors.stockCritico && <div className="invalid-feedback">{errors.stockCritico}</div>}
                  <div className="form-text">Alerta cuando el stock sea menor o igual</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">URL de Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.imagen}
                    onChange={(e) => handleFormChange('imagen', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCloseModals}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i> Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || categorias.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i> Crear Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
)}

      {/* ✅ MODAL EDITAR PRODUCTO ACTUALIZADO CON STOCK */}
      {showEditModal && selectedProducto && (
  <>
    <div className="modal-backdrop show"></div>
    <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              Editar Producto
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleCloseModals}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              {/* Información del producto actual */}
              <div className="alert alert-info">
                <div className="row small">
                  <div className="col-6">
                    <strong>ID:</strong> {selectedProducto.prodId}
                  </div>
                  <div className="col-6">
                    <strong>Stock actual:</strong> {selectedProducto.stock} unidades
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Categoría *</label>
                  <select
                    className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
                    value={formData.categoria.catId || ''}
                    onChange={(e) => handleFormChange('categoria', e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.catId} value={categoria.catId}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Nombre del Producto *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombreProducto ? 'is-invalid' : ''}`}
                    value={formData.nombreProducto}
                    onChange={(e) => handleFormChange('nombreProducto', e.target.value)}
                    placeholder="Ingrese nombre del producto"
                    disabled={loading}
                  />
                  {errors.nombreProducto && <div className="invalid-feedback">{errors.nombreProducto}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción *</label>
                  <textarea
                    className={`form-control ${errors.detalleProd ? 'is-invalid' : ''}`}
                    value={formData.detalleProd}
                    onChange={(e) => handleFormChange('detalleProd', e.target.value)}
                    placeholder="Ingrese descripción del producto"
                    rows="3"
                    disabled={loading}
                  />
                  {errors.detalleProd && <div className="invalid-feedback">{errors.detalleProd}</div>}
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">Precio *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.precioProd ? 'is-invalid' : ''}`}
                    value={formData.precioProd}
                    onChange={(e) => handleFormChange('precioProd', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="1"
                    disabled={loading}
                  />
                  {errors.precioProd && <div className="invalid-feedback">{errors.precioProd}</div>}
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">Moneda</label>
                  <select
                    className="form-select"
                    value={formData.moneda}
                    onChange={(e) => handleFormChange('moneda', e.target.value)}
                    disabled={loading}
                  >
                    <option value="CLP">CLP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                {/* ✅ CAMPOS DE STOCK AGREGADOS */}
                <div className="col-6">
                  <label className="form-label fw-semibold">Stock *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                    value={formData.stock}
                    onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    disabled={loading}
                  />
                  {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                  <div className="form-text">Cantidad disponible en inventario</div>
                </div>

                <div className="col-6">
                  <label className="form-label fw-semibold">Stock Crítico *</label>
                  <input
                    type="number"
                    className={`form-control ${errors.stockCritico ? 'is-invalid' : ''}`}
                    value={formData.stockCritico}
                    onChange={(e) => handleFormChange('stockCritico', parseInt(e.target.value) || 0)}
                    placeholder="5"
                    min="1"
                    disabled={loading}
                  />
                  {errors.stockCritico && <div className="invalid-feedback">{errors.stockCritico}</div>}
                  <div className="form-text">Alerta cuando el stock sea menor o igual</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">URL de Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.imagen}
                    onChange={(e) => handleFormChange('imagen', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCloseModals}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i> Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-warning"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i> Actualizar Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default Productos;