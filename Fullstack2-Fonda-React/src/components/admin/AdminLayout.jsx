import Sidebar from './Sidebar';
import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { removeFromLocalstorage } from '../../utils/localstorageHelper';
import DataService from '../../utils/DataService';

const logo = '/src/assets/admin/logoPNG.png';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePopover, setActivePopover] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [userRole, setUserRole] = useState(''); 
  
  // Estado para el perfil del admin conectado a la base de datos
  const [adminProfile, setAdminProfile] = useState({
    usuId: null,
    nombres: '',
    apellidos: '',
    nombreCompleto: '',
    correo: '',
    direccion: 'Av. Principal 123, Santiago, Chile',
    rut: '',
    rol: 'Administrador'
  });

  const navigate = useNavigate();

  // Función para verificar sesión
  const verificarSesion = () => {
    const token = localStorage.getItem('token');
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    if (!token || !usuarioLogueado) {
      console.warn('No hay sesión activa');
      return false;
    }
    
    return true;
  };

  // Cargar perfil real desde localStorage o base de datos
  const cargarPerfilReal = async () => {
    try {
      setLoadingProfile(true);
      
      if (!verificarSesion()) {
        cargarPerfilPorDefecto();
        return;
      }

      // Primero intentar cargar desde localStorage
      const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
      
      if (usuarioLogueado && usuarioLogueado.usuId) {
        console.log('✅ Usuario logueado encontrado en localStorage:', usuarioLogueado);
        
        // AÑADIR: Obtener rol del usuario
        const rolUsuario = usuarioLogueado.rol?.toLowerCase() || '';
        setUserRole(rolUsuario);
        
        // Dividir nombre completo en nombres y apellidos
        const nombreCompleto = usuarioLogueado.nombreCompleto || '';
        const nombresArray = nombreCompleto.split(' ');
        const nombres = nombresArray[0] || '';
        const apellidos = nombresArray.slice(1).join(' ') || nombreCompleto;
        
        // Determinar título del rol para mostrar
        let tituloRol = '';
        if (rolUsuario === 'admin') {
          tituloRol = 'Administrador Principal';
        } else if (rolUsuario === 'vendedor') {
          tituloRol = 'Vendedor';
        } else if (rolUsuario === 'cliente') {
          tituloRol = 'Cliente';
        } else {
          tituloRol = 'Usuario';
        }
        
        const perfilData = {
          usuId: usuarioLogueado.usuId,
          nombres: nombres,
          apellidos: apellidos,
          nombreCompleto: nombreCompleto,
          correo: usuarioLogueado.correo || '',
          direccion: 'Av. Principal 123, Santiago, Chile',
          rut: usuarioLogueado.rut || '',
          rol: tituloRol
        };
        
        setAdminProfile(perfilData);
        localStorage.setItem('adminProfile', JSON.stringify(perfilData));
        
      } else {
        // Si no hay usuario logueado, intentar cargar desde la API
        console.log('🔄 Cargando perfil desde API...');
        const perfil = await DataService.getMiPerfil();
        
        // AÑADIR: Obtener rol del usuario
        const rolUsuario = perfil.rol?.toLowerCase() || '';
        setUserRole(rolUsuario);
        
        const nombreCompleto = perfil.nombreCompleto || '';
        const nombresArray = nombreCompleto.split(' ');
        const nombres = nombresArray[0] || '';
        const apellidos = nombresArray.slice(1).join(' ') || nombreCompleto;
        
        let tituloRol = '';
        if (rolUsuario === 'admin') {
          tituloRol = 'Administrador Principal';
        } else if (rolUsuario === 'vendedor') {
          tituloRol = 'Vendedor';
        } else if (rolUsuario === 'cliente') {
          tituloRol = 'Cliente';
        } else {
          tituloRol = 'Usuario';
        }
        
        const perfilData = {
          usuId: perfil.usuId,
          nombres: nombres,
          apellidos: apellidos,
          nombreCompleto: nombreCompleto,
          correo: perfil.correo || '',
          direccion: 'Av. Principal 123, Santiago, Chile',
          rut: perfil.rut || '',
          rol: tituloRol
        };
        
        setAdminProfile(perfilData);
        localStorage.setItem('adminProfile', JSON.stringify(perfilData));
      }
      
    } catch (error) {
      console.error('❌ Error al cargar perfil:', error);
      cargarPerfilPorDefecto();
    } finally {
      setLoadingProfile(false);
    }
  };

  const esVendedor = () => {
    return userRole === 'vendedor';
  };

    // AÑADIR: Redirigir si es vendedor y está en ruta no permitida
  useEffect(() => {
    const path = window.location.pathname;
    if (esVendedor() && 
        !path.includes('/admin/productos') && 
        !path.includes('/admin/ordenes')) {
      navigate('/admin/productos');
    }
  }, [userRole, navigate]);

  // Cargar perfil por defecto
  const cargarPerfilPorDefecto = () => {
    const savedProfile = localStorage.getItem('adminProfile');
    if (savedProfile) {
      setAdminProfile(JSON.parse(savedProfile));
    } else {
      setAdminProfile({
        usuId: null,
        nombres: 'Administrador',
        apellidos: 'Sistema',
        nombreCompleto: 'Administrador Sistema',
        correo: 'admin@fondaduoc.cl',
        direccion: 'Av. Principal 123, Santiago, Chile',
        rut: '12.345.678-9',
        rol: 'Administrador Principal'
      });
    }
  };

  // Cargar perfil al montar el componente
  useEffect(() => {
    console.log('🔄 AdminLayout montado - Cargando perfil...');
    cargarPerfilReal();
  }, []);

  const chatRef = useRef(null);
  const profileRef = useRef(null);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const togglePopover = (popoverName) => {
    setActivePopover(activePopover === popoverName ? null : popoverName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatRef.current && !chatRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setActivePopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'user', message: 'Hola, tengo un problema con mi envío', time: '10:30 AM', user: 'María González' },
    { id: 2, sender: 'admin', message: '¡Hola María! ¿En qué puedo ayudarte?', time: '10:31 AM', user: 'Soporte' },
    { id: 3, sender: 'user', message: 'Mi pedido #12345 debería haber llegado ayer pero aún no lo recibo', time: '10:32 AM', user: 'María González' },
    { id: 4, sender: 'admin', message: 'Déjame verificar el estado de tu envío...', time: '10:33 AM', user: 'Soporte' }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        sender: 'admin',
        message: newMessage,
        time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        user: 'Soporte'
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage('');
    }
  };

  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
    setActivePopover(null); 
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setIsEditing(false);
  };

  const handleProfileChange = (field, value) => {
    setAdminProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar perfil en la base de datos
  const handleSaveProfile = async () => {
    try {
      setLoadingProfile(true);
      
      // Reconstruir nombre completo
      const nombreCompleto = `${adminProfile.nombres} ${adminProfile.apellidos}`.trim();
      
      const datosActualizacion = {
        nombreCompleto: nombreCompleto,
        correo: adminProfile.correo
      };
      
      console.log('💾 Guardando perfil:', datosActualizacion);
      
      // Verificar que el método existe antes de llamarlo
      if (!DataService.updateMiPerfil) {
        throw new Error('El método updateMiPerfil no está disponible en DataService');
      }
      
      // Actualizar en la base de datos
      await DataService.updateMiPerfil(datosActualizacion);
      
      // Actualizar estado local
      setAdminProfile(prev => ({
        ...prev,
        nombreCompleto: nombreCompleto
      }));
      
      // Guardar en localStorage
      const perfilActualizado = {
        ...adminProfile,
        nombreCompleto: nombreCompleto
      };
      localStorage.setItem('adminProfile', JSON.stringify(perfilActualizado));
      
      // Actualizar usuario en localStorage
      const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
      if (usuarioLogueado.usuId === adminProfile.usuId) {
        usuarioLogueado.nombreCompleto = nombreCompleto;
        usuarioLogueado.correo = adminProfile.correo;
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
      }
      
      // Disparar evento para notificar a otros componentes
      window.dispatchEvent(new Event('adminProfileUpdated'));
      
      alert('✅ Perfil actualizado correctamente');
      setIsEditing(false);
      
    } catch (error) {
      console.error('❌ Error al guardar perfil:', error);
      alert('❌ Error al actualizar perfil: ' + error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    cargarPerfilReal();
    setIsEditing(false);
  };

  const IrAHome = (ruta) => {
    navigate(ruta);
  };

  const handleLogout = () => {
    removeFromLocalstorage("token");
    removeFromLocalstorage("usuarioLogueado");
    removeFromLocalstorage("adminProfile");
    alert("Sesión cerrada");
    IrAHome("/");
  };

  return (
    <div className="admin-layout d-flex">
      {/* Barra lateral */}
      <Sidebar collapsed={collapsed} adminProfile={adminProfile} />
      
      {/* Contenedor principal */}
      <div className={`flex-grow-1 main-content d-flex flex-column ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh' }}>
        {/* Navbar superior */}
        <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${collapsed ? 'collapsed' : ''}`}>
          <div className="container-fluid d-flex align-items-center">
            {/* Bloque izquierdo: hamburguesa, logo y saludo */}
            <div className="d-flex align-items-center">
              {/* Botón hamburguesa */}
              <a
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
                onClick={e => { e.preventDefault(); toggleSidebar(); }}
                style={{ paddingRight: '0.6rem' }}
              >
                <i className="bi bi-list" style={{ fontSize: '2.1em' }}></i>
              </a>
              <img
                src={logo}
                alt="Logo Fonda Duoc"
                style={{ width: '80px', height: '60px', marginLeft: '0.5rem', marginRight: '0.8rem', objectFit: 'contain', borderRadius: '50px' }}
              />
              <span style={{
    fontWeight: 900,
    fontSize: '1.25rem',
    fontFamily: "'Montserrat', sans-serif",
    color: '#d32f2f',
    letterSpacing: '1.5px'
  }}>
    {loadingProfile ? (
      '🔄 Cargando...'
    ) : esVendedor() ? (
      <span dangerouslySetInnerHTML={{
        __html: `👋 ¡Buenos días, <span style="color: #0D47A1">Vendedor</span>! 🎉`
      }} />
    ) : (
      <span dangerouslySetInnerHTML={{
        __html: `👋 ¡Buenos días, pariente <span style="color: #0D47A1">${adminProfile.apellidos}</span>! 🎉`
      }} />
    )}
  </span>
            </div>
            
            {/* Bloque derecho: chat soporte y usuario */}
            <div className="d-flex align-items-center ms-auto">
              {/* Chat Soporte con popover */}
              <div className="position-relative" ref={chatRef}>
                <a 
                  className="nav-link position-relative" 
                  href="#" 
                  style={{ padding: '0 0.8rem' }}
                  onClick={(e) => { e.preventDefault(); togglePopover('chat'); }}
                >
                  <i className="bi bi-chat-dots-fill" style={{ fontSize: '1.5em', color: "#28a745" }}></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{
                    fontSize: '0.6em',
                    padding: '4px 6px',
                    minWidth: '18px'
                  }}>
                    {chatMessages.filter(msg => msg.sender === 'user').length}
                  </span>
                </a>
                
                {/* Popover de Chat */}
                {activePopover === 'chat' && (
                  <div className="popover-container show" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '360px',
                    zIndex: 1060,
                    marginTop: '10px'
                  }}>
                    <div className="card shadow-lg border border-success" style={{ borderWidth: '2px' }}>
                      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="bg-white bg-opacity-20 rounded-circle p-1 me-2">
                            <i className="bi bi-headset"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">Soporte al Cliente</h6>
                            <small className="opacity-75">Conversación con María González</small>
                          </div>
                        </div>
                        <span className="badge bg-light text-success">
                          <i className="bi bi-circle-fill me-1" style={{ fontSize: '6px' }}></i>
                          En línea
                        </span>
                      </div>
                      
                      <div className="card-body p-3 bg-light bg-opacity-25" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {chatMessages.map(msg => (
                          <div key={msg.id} className={`mb-3 ${msg.sender === 'admin' ? 'text-end' : ''}`}>
                            <div className="d-flex align-items-start">
                              {msg.sender === 'user' && (
                                <div className="me-2">
                                  <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-person text-white" style={{ fontSize: '14px' }}></i>
                                  </div>
                                </div>
                              )}
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center mb-1">
                                  <small className="text-muted fw-bold">{msg.user}</small>
                                  <small className="text-muted ms-2">{msg.time}</small>
                                </div>
                                <div 
                                  className={`p-3 rounded-3 ${
                                    msg.sender === 'admin' 
                                      ? 'bg-primary text-white' 
                                      : 'bg-white border border-secondary'
                                  }`}
                                  style={{ 
                                    maxWidth: '85%',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <div className="small">{msg.message}</div>
                                </div>
                              </div>
                              {msg.sender === 'admin' && (
                                <div className="ms-2">
                                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-person-check text-white" style={{ fontSize: '14px' }}></i>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="card-footer border-top border-secondary">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control border-secondary" 
                            placeholder="Escribe tu respuesta..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button 
                            className="btn btn-success"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <i className="bi bi-send"></i>
                          </button>
                        </div>
                        <small className="text-muted mt-2 d-block">
                          <i className="bi bi-info-circle me-1"></i>
                          Responde al problema de envío del pedido #12345
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Perfil de Usuario con popover */}
              <div className="position-relative" ref={profileRef}>
                <a 
                  className="nav-link" 
                  href="#" 
                  style={{ padding: '0 0.8rem' }}
                  onClick={(e) => { e.preventDefault(); togglePopover('profile'); }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: '1.5em', color: "#374850" }}></i>
                </a>
                
                {/* Popover de Perfil */}
                {activePopover === 'profile' && (
                  <div className="popover-container show" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '240px',
                    zIndex: 1060,
                    marginTop: '10px'
                  }}>
                    <div className="card shadow-lg border border-dark" style={{ borderWidth: '2px' }}>
                      <div className="card-body text-center p-4">
                        <img 
                          src="https://pbs.twimg.com/profile_images/378800000162907418/3227125f0f2eade72449e2204da234d4_200x200.jpeg" 
                          alt="Admin" 
                          className="rounded-circle mb-3 border border-3 border-primary"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <h6 className="mb-1 fw-bold text-dark">{adminProfile.nombres} {adminProfile.apellidos}</h6>
                        <p className="text-muted small mb-3">
                          <i className="bi bi-shield-check text-primary me-1"></i>
                          {adminProfile.rol}
                        </p>
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleOpenProfileModal}
                            disabled={loadingProfile}
                          >
                            <i className="bi bi-person-gear me-2"></i>
                            {loadingProfile ? 'Cargando...' : 'Mi cuenta'}
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        {/* Contenido de las páginas */}
        <div className="flex-grow-1 p-3 contenido-admin" style={{ minHeight: 0 }}>
          <Outlet />
        </div>
      </div>

      {/* Modal de Mi Cuenta */}
      {showProfileModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border border-2 border-primary">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-person-gear me-2"></i>
                    {isEditing ? 'Editar Perfil' : 'Mi Cuenta'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseProfileModal}
                    disabled={loadingProfile}
                  ></button>
                </div>
                
                <div className="modal-body">
                  {loadingProfile ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2">Cargando información del perfil...</p>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-4 text-center mb-4">
                        <img 
                          src="https://pbs.twimg.com/profile_images/378800000162907418/3227125f0f2eade72449e2204da234d4_200x200.jpeg" 
                          alt="Admin" 
                          className="rounded-circle border border-4 border-primary mb-3"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <div className="text-muted small">
                          <i className="bi bi-info-circle me-1"></i>
                          ID: {adminProfile.usuId || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="col-md-8">
                        <div className="row g-3">
                          {/* Nombres */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Nombres</label>
                            <input
                              type="text"
                              className="form-control"
                              value={adminProfile.nombres}
                              onChange={(e) => handleProfileChange('nombres', e.target.value)}
                              disabled={!isEditing || loadingProfile}
                              style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                            />
                          </div>
                          
                          {/* Apellidos */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Apellidos</label>
                            <input
                              type="text"
                              className="form-control"
                              value={adminProfile.apellidos}
                              onChange={(e) => handleProfileChange('apellidos', e.target.value)}
                              disabled={!isEditing || loadingProfile}
                              style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                            />
                          </div>
                          
                          {/* Correo */}
                          <div className="col-12">
                            <label className="form-label fw-semibold">Correo Electrónico</label>
                            <input
                              type="email"
                              className="form-control"
                              value={adminProfile.correo}
                              onChange={(e) => handleProfileChange('correo', e.target.value)}
                              disabled={!isEditing || loadingProfile}
                              style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                            />
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Debe terminar en @duocuc.cl, @fondaduoc.cl, @vendedor.cl o @gmail.com
                            </div>
                          </div>
                          
                          {/* Dirección */}
                          <div className="col-12">
                            <label className="form-label fw-semibold">Dirección</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={adminProfile.direccion}
                              onChange={(e) => handleProfileChange('direccion', e.target.value)}
                              disabled={!isEditing || loadingProfile}
                              style={!isEditing ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                            />
                          </div>
                          
                          {/* RUT (Siempre deshabilitado) */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">RUT</label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={adminProfile.rut}
                              disabled
                              style={{ cursor: 'not-allowed', opacity: 0.7 }}
                            />
                            <div className="form-text text-muted">
                              <i className="bi bi-lock me-1"></i>
                              El RUT no puede ser modificado
                            </div>
                          </div>
                          
                          {/* Rol (Siempre deshabilitado) */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Rol</label>
                            <input
                              type="text"
                              className="form-control bg-light"
                              value={adminProfile.rol}
                              disabled
                              style={{ cursor: 'not-allowed', opacity: 0.7 }}
                            />
                            <div className="form-text text-muted">
                              <i className="bi bi-shield-check me-1"></i>
                              Rol del sistema
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer">
                  {!isEditing ? (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCloseProfileModal}
                        disabled={loadingProfile}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Cerrar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                        disabled={loadingProfile}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Editar Perfil
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={handleCancelEdit}
                        disabled={loadingProfile}
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={handleSaveProfile}
                        disabled={loadingProfile}
                      >
                        {loadingProfile ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Guardar Cambios
                          </>
                        )}
                      </button>
                    </>
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

export default AdminLayout;