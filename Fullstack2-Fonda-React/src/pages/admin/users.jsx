import React, { useState, useEffect } from 'react';
import DataService from '../../utils/DataService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('id');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [historialUsuario, setHistorialUsuario] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rut: '',
    rol: 'CLIENTE',
    clave: '123456',
    telefono: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  // Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await DataService.getUsuarios();
      console.log("Usuarios cargados:", data);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("Error al cargar usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial real del usuario
  const cargarHistorialUsuario = async (usuarioId) => {
    try {
      setLoadingHistorial(true);
      console.log("🔄 Cargando historial para usuario ID:", usuarioId);
      
      // Obtener boletas del usuario desde el nuevo endpoint
      const boletasUsuario = await DataService.getBoletasByUsuario(usuarioId);
      console.log("📊 Boletas del usuario:", boletasUsuario);
      
      // Transformar boletas a historial
      const historial = boletasUsuario.map(boleta => {
        // Mapear estado de la boleta
        const mapearEstado = (estado) => {
          if (estado === 'PAGADA' || estado === 'Pagado') return 'completada';
          return estado ? estado.toLowerCase() : 'pendiente';
        };

        return {
          id: boleta.boletaId,
          tipo: 'compra',
          descripcion: `Compra realizada - ${boleta.numero || `Boleta ${boleta.boletaId}`}`,
          fecha: new Date(boleta.fecha),
          monto: boleta.total || 0,
          items: [],
          estado: mapearEstado(boleta.estado),
          boletaId: boleta.boletaId,
          numeroBoleta: boleta.numero,
          cliente: boleta.cliente || 'Cliente no especificado'
        };
      });

      // Ordenar por fecha (más reciente primero)
      historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      console.log("📋 Historial transformado:", historial);
      setHistorialUsuario(historial);
      
    } catch (error) {
      console.error("❌ Error al cargar historial:", error);
      setHistorialUsuario([]);
    } finally {
      setLoadingHistorial(false);
    }
  };

  // Cuando abras el modal de historial
  const handleOpenHistorialModal = async (user) => {
    setSelectedUser(user);
    setShowHistorialModal(true);
    
    // Cargar historial real del usuario
    await cargarHistorialUsuario(user.usuId);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        (user.nombreCompleto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.correo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.rut || '').includes(searchTerm)
      );
    }

    // Filtro por rol
    if (roleFilter !== 'todos') {
      filtered = filtered.filter(user => 
        (user.rol || '').toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return (a.nombreCompleto || '').localeCompare(b.nombreCompleto || '');
        case 'email':
          return (a.correo || '').localeCompare(b.correo || '');
        case 'rol':
          return (a.rol || '').localeCompare(b.rol || '');
        case 'id':
        default:
          return (a.usuId || 0) - (b.usuId || 0);
      }
    });

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, sortBy, users]);

  const validarRUT = (rut) => {
    if (!rut) return false;
    
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length < 2) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dvCalculado === dv;
  };

  const validarEmail = (email) => {
    const dominiosPermitidos = ['@duocuc.cl', '@fondaduoc.cl', '@gmail.com','@vendedor.cl'];
    return dominiosPermitidos.some(dominio => email.endsWith(dominio));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!validarEmail(formData.email)) {
      nuevosErrores.email = 'El email debe terminar en @duocuc.cl o @fondaduoc.cl';
    }

    if (showAddModal && !formData.rut.trim()) {
      nuevosErrores.rut = 'El RUT es obligatorio';
    } else if (showAddModal && !validarRUT(formData.rut)) {
      nuevosErrores.rut = 'El RUT no es válido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleOpenAddModal = () => {
    setFormData({
      nombre: '',
      email: '',
      rut: '',
      rol: 'CLIENTE',
      clave: '123456', 
      telefono: 0 
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    
    let roleValue = (user.rol || 'CLIENTE').toUpperCase();
    
    setFormData({
      nombre: user.nombreCompleto || '',
      email: user.correo || '',
      rut: user.rut || '',
      rol: roleValue,
      clave: user.clave || '123456', 
      telefono: user.telefono || 0 
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowHistorialModal(false);
    setSelectedUser(null);
    setHistorialUsuario([]);
    setErrors({});
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    try {
      const fechaObj = new Date(fecha);
      return new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(fechaObj);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price || 0);
  };

  const getIconoHistorial = (tipo) => {
    switch (tipo) {
      case 'compra':
        return 'bi-cart-check text-success';
      case 'consulta':
        return 'bi-chat-dots text-info';
      case 'devolucion':
        return 'bi-arrow-return-left text-warning';
      default:
        return 'bi-activity text-muted';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada':
      case 'atendida':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'procesada':
        return 'info';
      case 'cancelada':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      if (showAddModal) {
        // Preparar datos para crear usuario - CON TODOS LOS CAMPOS REQUERIDOS
        const nuevoUsuario = {
          nombreCompleto: formData.nombre.trim(),
          correo: formData.email.trim().toLowerCase(),
          rut: formData.rut.replace(/[^0-9kK]/g, ''), // RUT limpio
          rol: formData.rol.toUpperCase(),
          clave: formData.clave, // Clave por defecto
          telefono: formData.telefono // Teléfono por defecto
        };

        console.log("Enviando datos para crear usuario:", nuevoUsuario);
        await DataService.addUsuario(nuevoUsuario);
        alert('Usuario creado exitosamente');
      } else if (showEditModal && selectedUser) {
        // Preparar datos para actualizar usuario - SOLO CAMPOS EDITABLES
        const usuarioActualizado = {
          usuId: selectedUser.usuId,
          nombreCompleto: formData.nombre.trim(),
          correo: formData.email.trim().toLowerCase(),
          rol: formData.rol.toUpperCase()
          // No enviar rut, clave ni teléfono para no modificarlos
        };

        console.log("Enviando datos para actualizar usuario:", usuarioActualizado);
        await DataService.updateUsuario(usuarioActualizado);
        alert('Usuario actualizado exitosamente');
      }

      await cargarUsuarios();
      handleCloseModals();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      
      let errorMessage = "Error al guardar usuario. ";
      
      if (error.message.includes("500")) {
        errorMessage += "Error interno del servidor. Verifica la consola del backend.";
      } else if (error.message.includes("409")) {
        errorMessage += "El usuario ya existe (email o RUT duplicado).";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };  

  const handleDeleteUser = async (id) => {
  const user = users.find(u => u.usuId === id);
  if (!user) return;

  if ((user.rol || '').toUpperCase() === 'ADMIN') {
    alert('No se puede eliminar al administrador principal');
    return;
  }

  if (window.confirm(
    `¿Estás seguro de que deseas eliminar al usuario "${user.nombreCompleto}"?\n\n` +
    `⚠️  NOTA: Este usuario tiene registros relacionados (compras, boletas, etc.).\n`
  )) {
    try {
      setLoading(true);
      console.log("Eliminando usuario con ID:", id);
      await DataService.deleteUsuarioCascada(id);
      alert('Usuario eliminado exitosamente');
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      
      // Manejar específicamente el error de restricción
      if (error.message.includes('ORA-02292') || error.message.includes('restricción de integridad')) {
        alert(
          `No se puede eliminar el usuario "${user.nombreCompleto}"\n\n` +
          `Motivo: El usuario tiene registros relacionados en el sistema (compras, boletas, etc.).\n\n` +
          `Solución: Puedes:\n` +
          `• Desactivar el usuario cambiando su estado\n` +
          `• Contactar al administrador de la base de datos`
        );
      } else if (error.message.includes("500")) {
        alert("Error interno del servidor. El usuario podría tener datos relacionados que impiden su eliminación.");
      } else if (error.message.includes("404")) {
        alert("Usuario no encontrado.");
      } else {
        alert("Error al eliminar usuario: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }
};

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('todos');
    setSortBy('id');
  };

  const formatearRUT = (rut) => {
    if (!rut) return '';
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length <= 1) return rutLimpio;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    return `${cuerpo}-${dv}`;
  };

  const handleRUTChange = (value) => {
    const rutFormateado = formatearRUT(value);
    handleFormChange('rut', rutFormateado);
  };

  const getRolTexto = (rol) => {  
    const rolUpper = (rol || '').toUpperCase();
    switch (rolUpper) {
      case 'ADMIN':
        return 'Administrador';
      case 'VENDEDOR':
        return 'Vendedor';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return rol || 'Cliente';
    }
  };

  const getRolColor = (rol) => {
    const rolUpper = (rol || '').toUpperCase();
    switch (rolUpper) {
      case 'ADMIN':
        return 'bg-danger';
      case 'VENDEDOR':
        return 'bg-warning text-dark';
      case 'CLIENTE':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  // Calcula estadísticas del historial
  const calcularEstadisticasHistorial = () => {
    const compras = historialUsuario.filter(h => h.tipo === 'compra');
    const totalCompras = compras.length;
    const totalGastado = compras.reduce((sum, compra) => sum + (compra.monto || 0), 0);
    const comprasCompletadas = compras.filter(c => c.estado === 'completada').length;

    return {
      totalCompras,
      totalGastado,
      comprasCompletadas,
      totalTransacciones: historialUsuario.length
    };
  };

  const estadisticas = calcularEstadisticasHistorial();

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
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted">Búsqueda</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, email o RUT..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Filtro por rol */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Filtrar por Rol</label>
                  <select 
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="todos">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>

                {/* Ordenamiento */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="id">ID</option>
                    <option value="nombre">Nombre</option>
                    <option value="email">Email</option>
                    <option value="rol">Rol</option>
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="col-md-2 d-flex align-items-end">
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
                      title="Agregar usuario"
                      disabled={loading}
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
                      Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
                      {roleFilter !== 'todos' && ` • Filtrado por: ${roleFilter}`}
                      {searchTerm && ` • Búsqueda: "${searchTerm}"`}
                    </small>
                    <div className="d-flex gap-2">
                      {filteredUsers.length !== users.length && (
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

      {/* Tabla de usuarios */}
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
                  Listado de Usuarios
                </h3>
                
                {/* Información de filtros activos */}
                <div className="d-flex gap-2">
                  {roleFilter !== 'todos' && (
                    <span className="badge bg-primary">
                      Rol: {roleFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setRoleFilter('todos')}
                        disabled={loading}
                      ></button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="badge bg-info text-dark">
                      Búsqueda: {searchTerm}
                      <button 
                        className="btn-close ms-1"
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
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Email</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>RUT</th>
                    <th style={{ border: 'none', padding: '12px 16px', fontWeight: '600', color: '#333' }}>Rol</th>
                    <th style={{ 
                      width: '180px', 
                      border: 'none', 
                      padding: '12px 16px', 
                      fontWeight: '600', 
                      color: '#333',
                      textAlign: 'center'
                    }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.usuId} style={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>{user.usuId}</td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#333', fontWeight: '500' }}>{user.nombreCompleto}</td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>{user.correo}</td>
                        <td style={{ border: 'none', padding: '12px 16px', color: '#666' }}>{formatearRUT(user.rut)}</td>
                        <td style={{ border: 'none', padding: '12px 16px' }}>
                          <span className={`badge ${getRolColor(user.rol)}`} style={{ 
                            fontSize: '0.75em',
                            padding: '0.4em 0.8em',
                            fontWeight: '500'
                          }}>
                            {getRolTexto(user.rol)}
                          </span>
                        </td>
                        <td style={{ border: 'none', padding: '12px 16px', textAlign: 'center' }}>
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleOpenHistorialModal(user)}
                              title="Ver historial"
                              disabled={loading}
                              style={{ 
                                border: '1px solid #0dcaf0',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem'
                              }}
                            >
                              <i className="bi bi-clock-history"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleOpenEditModal(user)}
                              title="Editar usuario"
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
                              onClick={() => handleDeleteUser(user.usuId)}
                              disabled={loading || (user.rol || '').toUpperCase() === 'ADMIN'}
                              title={(user.rol || '').toUpperCase() === 'ADMIN' ? 'No se puede eliminar al administrador principal' : 'Eliminar usuario'}
                              style={{ 
                                border: '1px solid #dc3545',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                opacity: (user.rol || '').toUpperCase() === 'ADMIN' ? 0.5 : 1
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5" style={{ border: 'none' }}>
                        <i className="bi bi-people display-4 text-muted d-block mb-3"></i>
                        <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>No se encontraron usuarios</p>
                        <small className="text-muted">Intenta ajustar los filtros de búsqueda</small>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar Usuario */}
      {showAddModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-person-plus me-2"></i>
                    Agregar Nuevo Usuario
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
                    <div className="alert alert-info">
                      <small>
                        <i className="bi bi-info-circle me-1"></i>
                        Se asignará una clave por defecto y teléfono 0 automáticamente
                      </small>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nombre Completo *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                          value={formData.nombre}
                          onChange={(e) => handleFormChange('nombre', e.target.value)}
                          placeholder="Ingrese nombre completo"
                          disabled={loading}
                        />
                        {errors.nombre && (
                          <div className="invalid-feedback">
                            {errors.nombre}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                        
                          disabled={loading}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email}
                          </div>
                        )}
                        <div className="form-text">Debe terminar en @duocuc.cl, @fondaduoc.cl, @vendedor.cl o @gmail.com</div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">RUT *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                          value={formData.rut}
                          onChange={(e) => handleRUTChange(e.target.value)}
                          placeholder="12345678-9"
                          maxLength="12"
                          disabled={loading}
                        />
                        {errors.rut && (
                          <div className="invalid-feedback">
                            {errors.rut}
                          </div>
                        )}
                        <div className="form-text">Formato: 12345678-9 (sin puntos)</div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Rol *</label>
                        <select
                          className="form-select"
                          value={formData.rol}
                          onChange={(e) => handleFormChange('rol', e.target.value)}
                          disabled={loading}
                        >
                          <option value="CLIENTE">Cliente</option>
                          <option value="VENDEDOR">Vendedor</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
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
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Creando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-1"></i> Crear Usuario
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

      {/* Modal Editar Usuario - ACTUALIZADO */}
      {showEditModal && selectedUser && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">
                    <i className="bi bi-person-gear me-2"></i>
                    Editar Usuario: {selectedUser.nombreCompleto}
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
                    <div className="alert alert-info">
                      <div className="row small">
                        <div className="col-6">
                          <strong>ID Usuario:</strong> {selectedUser.usuId}
                        </div>
                        <div className="col-6">
                          <strong>RUT:</strong> {selectedUser.rut}
                        </div>
                      </div>
                      <div className="row small mt-2">
                        <div className="col-6">
                          <strong>Teléfono:</strong> {selectedUser.telefono || 'No asignado'}
                        </div>
                        <div className="col-6">
                          <strong>Rol actual:</strong> 
                          <span className={`badge ${getRolColor(selectedUser.rol)} ms-1`}>
                            {getRolTexto(selectedUser.rol)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Nombre Completo *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                          value={formData.nombre}
                          onChange={(e) => handleFormChange('nombre', e.target.value)}
                          placeholder="Ingrese nombre completo"
                          disabled={loading}
                        />
                        {errors.nombre && (
                          <div className="invalid-feedback">
                            {errors.nombre}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          placeholder="usuario@duocuc.cl"
                          disabled={loading}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email}
                          </div>
                        )}
                        <div className="form-text">Debe terminar en @duocuc.cl, @fondaduoc.cl o @gmail.com</div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Rol *</label>
                        <select
                          className="form-select"
                          value={formData.rol}
                          onChange={(e) => handleFormChange('rol', e.target.value)}
                          disabled={loading}
                        >
                          <option value="CLIENTE">Cliente</option>
                          <option value="VENDEDOR">Vendedor</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                        <div className="form-text">
                          {(selectedUser.rol || '').toUpperCase() !== formData.rol && (
                            <span className="text-warning">
                              <i className="bi bi-exclamation-triangle me-1"></i> 
                              Se cambiará el rol del usuario de "{getRolTexto(selectedUser.rol)}" a "{getRolTexto(formData.rol)}"
                            </span>
                          )}
                        </div>
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
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-1"></i> Guardar Cambios
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

      {/* Modal Historial (se mantiene igual que antes) */}
      {showHistorialModal && selectedUser && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-clock-history me-2"></i>
                    Historial: {selectedUser.nombreCompleto}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseModals}
                    disabled={loadingHistorial}
                  ></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  
                  {/* Información compacta del cliente */}
                  <div className="row mb-3">
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body py-2">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <p className="mb-1 small">
                                <strong>Cliente:</strong> {selectedUser.nombreCompleto}
                              </p>
                              <p className="mb-0 small">
                                <strong>RUT:</strong> {formatearRUT(selectedUser.rut)}
                              </p>
                            </div>
                            <div className="col-md-6 text-md-end">
                              <span className={`badge ${getRolColor(selectedUser.rol)} me-2`}>
                                {getRolTexto(selectedUser.rol)}
                              </span>
                              <span className="badge bg-secondary">
                                ID: {selectedUser.usuId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas compactas */}
                  <div className="row mb-3">
                    <div className="col-6 col-sm-3 mb-2">
                      <div className="card bg-primary text-white text-center">
                        <div className="card-body py-2 px-1">
                          <small className="card-title">Compras</small>
                          <h6 className="mb-0">{estadisticas.totalCompras}</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3 mb-2">
                      <div className="card bg-success text-white text-center">
                        <div className="card-body py-2 px-1">
                          <small className="card-title">Total</small>
                          <h6 className="mb-0">{formatPrice(estadisticas.totalGastado)}</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3 mb-2">
                      <div className="card bg-warning text-dark text-center">
                        <div className="card-body py-2 px-1">
                          <small className="card-title">Completadas</small>
                          <h6 className="mb-0">{estadisticas.comprasCompletadas}</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3 mb-2">
                      <div className="card bg-info text-white text-center">
                        <div className="card-body py-2 px-1">
                          <small className="card-title">Transacciones</small>
                          <h6 className="mb-0">{estadisticas.totalTransacciones}</h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de boletas - Versión compacta */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        <i className="bi bi-receipt me-2"></i>
                        Compras Realizadas
                      </h6>
                      {loadingHistorial && (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {historialUsuario.length > 0 ? (
                    <div className="list-group">
                      {historialUsuario.map((boleta) => (
                        <div key={boleta.id} className="list-group-item py-2">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-1">
                                <div className="mb-1 mb-md-0">
                                  <strong className="text-primary">#{boleta.boletaId}</strong>
                                  {boleta.numeroBoleta && (
                                    <span className="text-muted ms-2 small">
                                      ({boleta.numeroBoleta})
                                    </span>
                                  )}
                                </div>
                                <div className="d-flex gap-1 flex-wrap">
                                  <span className={`badge bg-${getEstadoColor(boleta.estado)}`}>
                                    {boleta.estado}
                                  </span>
                                  <span className={`badge ${boleta.monto > 0 ? 'bg-success' : 'bg-warning'}`}>
                                    {formatPrice(boleta.monto)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                                <small className="text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  {formatFecha(boleta.fecha)}
                                </small>
                                {boleta.cliente && boleta.cliente !== 'Cliente no especificado' && (
                                  <small className="text-muted mt-1 mt-md-0">
                                    <i className="bi bi-person me-1"></i>
                                    {boleta.cliente}
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 ms-2">
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      {loadingHistorial ? (
                        <>
                          <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Cargando historial...</span>
                          </div>
                          <p className="text-muted small">Cargando historial de compras...</p>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-inbox display-6 text-muted d-block mb-2"></i>
                          <p className="text-muted mb-1 small">No hay compras registradas</p>
                          <small className="text-muted">
                            Este {selectedUser.rol === 'CLIENTE' ? 'cliente' : 'usuario'} no tiene compras en el sistema
                          </small>
                        </>
                      )}
                    </div>
                  )}

                  {/* Resumen compacto */}
                  {historialUsuario.length > 0 && (
                    <div className="mt-3 pt-2 border-top">
                      <div className="row text-center">
                        <div className="col-4">
                          <small className="text-muted d-block">Promedio</small>
                          <strong className="text-primary">
                            {formatPrice(estadisticas.totalGastado / estadisticas.totalCompras)}
                          </strong>
                        </div>
                        <div className="col-4">
                          <small className="text-muted d-block">Completación</small>
                          <strong className="text-success">
                            {((estadisticas.comprasCompletadas / estadisticas.totalCompras) * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div className="col-4">
                          <small className="text-muted d-block">Última</small>
                          <strong className="text-info">
                            {historialUsuario.length > 0 ? 
                              new Date(historialUsuario[0].fecha).toLocaleDateString('es-CL') : 
                              'N/A'
                            }
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer py-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary" 
                    onClick={handleCloseModals}
                    disabled={loadingHistorial}
                  >
                    <i className="bi bi-x-circle me-1"></i> Cerrar
                  </button>
                  {historialUsuario.length > 0 && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        // Función para exportar el historial
                        alert('Función de exportación - Próximamente');
                      }}
                    >
                      <i className="bi bi-download me-1"></i> Exportar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;