// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { loadFromLocalstorage } from '../utils/localstorageHelper';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const usuario = loadFromLocalstorage('usuarioLogueado');
  const location = useLocation();
  
  // Si no hay usuario, redirigir a login
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verificar rol del usuario
  const userRole = usuario.rol?.toLowerCase() || '';
  
  // Si el rol del usuario no está en los roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirigir según el rol
    if (userRole === 'vendedor') {
      return <Navigate to="/admin/productos" replace />;
    } else if (userRole === 'admin' || userRole === 'administrador') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  // Si todo está bien, mostrar el contenido
  return children;
};

export default ProtectedRoute;