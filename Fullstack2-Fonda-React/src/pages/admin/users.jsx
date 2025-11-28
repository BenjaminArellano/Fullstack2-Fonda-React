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
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rut: '',
    rol: 'CLIENTE',
    clave: '123456', // Clave por defecto
    telefono: 0 // Teléfono por defecto
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Datos estáticos para el historial (por ahora)
  const historialClientes = {
    1: [ 
      {
        id: 1,
        tipo: 'compra',
        descripcion: 'Compra realizada - Boleta B001',
        fecha: new Date('2024-01-15T14:30:00'),
        monto: 49956,
        items: ['Polera Banda "Santaferia"', 'Entrada General Zona A'],
        estado: 'completada'
      },
      {
        id: 2,
        tipo: 'consulta',
        descripcion: 'Consulta sobre productos',
        fecha: new Date('2024-01-10T11:20:00'),
        monto: 0,
        items: [],
        estado: 'atendida'
      }
    ],
    2: [
      {
        id: 1,
        tipo: 'compra',
        descripcion: 'Compra realizada - Boleta B002',
        fecha: new Date('2024-01-14T16:45:00'),
        monto: 42828,
        items: ['Vale "Terremoto"', 'Pañuelo Bordado', 'Vale "Empanada"'],
        estado: 'completada'
      },
      {
        id: 2,
        tipo: 'devolucion',
        descripcion: 'Devolución parcial - Vale "Empanada"',
        fecha: new Date('2024-01-13T09:15:00'),
        monto: -3000,
        items: ['Vale "Empanada"'],
        estado: 'procesada'
      }
    ],
    3: [
      {
        id: 1,
        tipo: 'compra',
        descripcion: 'Compra realizada - Boleta B003',
        fecha: new Date('2024-01-14T11:20:00'),
        monto: 77338,
        items: ['Entrada VIP', 'Polera "Ráfaga"'],
        estado: 'pendiente'
      }
    ]
  };

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

  const handleOpenHistorialModal = (user) => {
    setSelectedUser(user);
    setShowHistorialModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowHistorialModal(false);
    setSelectedUser(null);
    setErrors({});
  };

  const getHistorialUsuario = () => {
    if (!selectedUser) return [];
    return historialClientes[selectedUser.usuId] || [];
  };

  const formatFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
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

    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.nombreCompleto}"?\nEsta acción no se puede deshacer.`)) {
      try {
        setLoading(true);
        console.log("Eliminando usuario con ID:", id);
        await DataService.deleteUsuario(id);
        alert('Usuario eliminado exitosamente');
        await cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        
        let errorMessage = "Error al eliminar usuario. ";
        
        if (error.message.includes("500")) {
          errorMessage += "Error interno del servidor. El usuario podría tener datos relacionados que impiden su eliminación.";
        } else if (error.message.includes("404")) {
          errorMessage += "Usuario no encontrado.";
        } else {
          errorMessage += error.message;
        }
        
        alert(errorMessage);
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
                    Historial del Cliente: {selectedUser.nombreCompleto}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseModals}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Contenido del historial (igual que antes) */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Información del Cliente</h6>
                          <p className="mb-1"><strong>Nombre:</strong> {selectedUser.nombreCompleto}</p>
                          <p className="mb-1"><strong>Email:</strong> {selectedUser.correo}</p>
                          <p className="mb-1"><strong>RUT:</strong> {selectedUser.rut}</p>
                          <p className="mb-0"><strong>Rol:</strong> 
                            <span className={`badge ${getRolColor(selectedUser.rol)} ms-1`}>
                              {getRolTexto(selectedUser.rol)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Resumen de Actividad</h6>
                          <p className="mb-1"><strong>Total de transacciones:</strong> {getHistorialUsuario().length}</p>
                          <p className="mb-1"><strong>Compras realizadas:</strong> {getHistorialUsuario().filter(h => h.tipo === 'compra').length}</p>
                          <p className="mb-0"><strong>Consultas:</strong> {getHistorialUsuario().filter(h => h.tipo === 'consulta').length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Historial de Actividades</h6>
                  {getHistorialUsuario().length > 0 ? (
                    <div className="list-group">
                      {getHistorialUsuario().map(historial => (
                        <div key={historial.id} className="list-group-item">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                              <i className={`bi ${getIconoHistorial(historial.tipo)}`} style={{ fontSize: '1.5rem' }}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1" style={{ color: '#333', fontWeight: '500' }}>
                                    {historial.descripcion}
                                  </h6>
                                  <div className="d-flex align-items-center gap-2">
                                    <span className={`badge bg-${getEstadoColor(historial.estado)}`}>
                                      {historial.estado}
                                    </span>
                                    {historial.monto !== 0 && (
                                      <span className={`badge ${historial.monto > 0 ? 'bg-success' : 'bg-warning'}`}>
                                        {formatPrice(historial.monto)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <small className="text-muted text-nowrap">
                                  {formatFecha(historial.fecha)}
                                </small>
                              </div>
                              
                              {historial.items && historial.items.length > 0 && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    <strong>Productos:</strong> {historial.items.join(', ')}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-2">No hay historial registrado</p>
                      <small className="text-muted">Este usuario no tiene actividades registradas en el sistema</small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModals}
                  >
                    <i className="bi bi-x-circle me-1"></i> Cerrar
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

export default Users;