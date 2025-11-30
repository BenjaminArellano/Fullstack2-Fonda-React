import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react';

const logo = '/src/assets/admin/logoPNG.png';

const Sidebar = ({ collapsed, adminProfile }) => {
  const [localAdminProfile, setLocalAdminProfile] = useState({
    nombres: 'Administrador',
    apellidos: 'Sistema',
    nombreCompleto: 'Administrador Sistema',
    rol: 'Administrador'
  });

  // Sincronizar con el perfil pasado como prop
  useEffect(() => {
    if (adminProfile && adminProfile.nombres) {
      console.log('🔄 Sidebar recibió perfil:', adminProfile);
      setLocalAdminProfile(adminProfile);
    } else {
      // Cargar desde localStorage si no hay prop
      const savedProfile = localStorage.getItem('adminProfile');
      if (savedProfile) {
        console.log('📁 Sidebar cargando desde localStorage');
        setLocalAdminProfile(JSON.parse(savedProfile));
      } else {
        console.log('⚠️ Sidebar usando datos por defecto');
      }
    }
  }, [adminProfile]);

  // Escuchar cambios en el perfil
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 Sidebar detectó actualización de perfil');
      const savedProfile = localStorage.getItem('adminProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setLocalAdminProfile(parsedProfile);
      }
    };

    // Escuchar evento personalizado
    window.addEventListener('adminProfileUpdated', handleProfileUpdate);
    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('adminProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'open'}`}>
      {/* Brand Logo */}
      <a href="#" className="brand-link">
        <img src={logo} className="brand-image img-fluid" style={{ width: '60px', height: 'auto' }} alt="Logo" />
        <span className="brand-text font-weight-light">Fonda SQL</span>
      </a>

      {/* User Panel */}
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="image">
          <img 
            src="https://pbs.twimg.com/profile_images/378800000162907418/3227125f0f2eade72449e2204da234d4_200x200.jpeg" 
            className="img-circle elevation-2" 
            alt="User" 
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
        </div>
        <div className="info">
          <a href="#" className="d-block" style={{ fontWeight: '600', color: '#fcfcfcff' }}>
            {localAdminProfile.nombres} {localAdminProfile.apellidos}
          </a>
          <small className="text-muted">
            <i className="bi bi-shield-check text-primary me-1"></i>
            {localAdminProfile.rol || 'Administrador'}
          </small>
        </div>
      </div>

      {/* Search Form */}
      <div className="form-inline">
        <div className="input-group" data-widget="sidebar-search">
          <input 
            className="form-control form-control-sidebar" 
            type="search" 
            placeholder="Buscar..." 
            aria-label="Buscar" 
          />
          <div className="input-group-append">
            <button className="btn btn-sidebar">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
          <li className="nav-item">
            <NavLink to="/admin/dashboard" className="nav-link">
              <i className="bi bi-house-door-fill nav-icon"></i>
              <p>Dashboard</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/productos" className="nav-link">
              <i className="bi bi-box-seam nav-icon"></i>
              <p>Productos</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/categorias" className="nav-link">
              <i className="bi bi-tags nav-icon"></i>
              <p>Categorias</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/usuarios" className="nav-link">
              <i className="bi bi-people-fill nav-icon"></i>
              <p>Usuarios</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/ordenes" className="nav-link">
              <i className="bi bi-receipt-cutoff nav-icon"></i>
              <p>Órdenes/Boletas</p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;