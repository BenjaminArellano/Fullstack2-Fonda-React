// src/services/DataService.js
const BASE_URL = "http://localhost:8088/v1";

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error en la petición");
  }
  return res.json();
};

const DataService = {

  // =================== USUARIOS ===================
  addUsuario: async (usuario) => {
    const res = await fetch(`${BASE_URL}/addUsuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    return handleResponse(res);
  },

  getMiPerfil: async () => {
  try {
    // Obtener el ID del usuario logueado del localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const usuarioId = usuarioLogueado.usuId;
    
    if (!usuarioId) {
      throw new Error('No hay usuario logueado. Por favor, inicia sesión nuevamente.');
    }
    
    console.log('Obteniendo perfil para usuario ID:', usuarioId);
    
    const res = await fetch(`${BASE_URL}/usuariosById/${usuarioId}`);
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const perfil = await res.json();
    console.log('Perfil obtenido:', perfil);
    
    return perfil;
  } catch (error) {
    console.error('Error en getMiPerfil:', error);
    throw error;
  }
},

updateMiPerfil: async (perfilData) => {
  try {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') || '{}');
    const usuarioId = usuarioLogueado.usuId;
    
    if (!usuarioId) {
      throw new Error('No hay usuario logueado. Por favor, inicia sesión nuevamente.');
    }

    // PREPARAR DATOS COMPLETOS para el backend
    const datosActualizacion = {
      usuId: usuarioId, // ← ESTE ES EL CAMPO CRÍTICO QUE FALTABA
      nombreCompleto: perfilData.nombreCompleto,
      correo: perfilData.correo,
      rol: usuarioLogueado.rol // ← Mantener el rol actual
    };

    console.log('📤 Enviando datos de actualización al backend:', datosActualizacion);

    const res = await fetch(`${BASE_URL}/updateUsuario`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosActualizacion),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error ${res.status}: ${errorText}`);
    }
    
    const resultado = await res.json();
    console.log('✅ Perfil actualizado exitosamente:', resultado);
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en updateMiPerfil:', error);
    throw error;
  }
},

  getUsuarios: async () => {
    const res = await fetch(`${BASE_URL}/usuarios`);
    return handleResponse(res);
  },

  getUsuarioById: async (id) => {
    const res = await fetch(`${BASE_URL}/usuarios/${id}`);
    return handleResponse(res);
  },

  deleteUsuario: async (id) => {
    const res = await fetch(`${BASE_URL}/deleteUsuario/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },

  deleteUsuarioCascada: async (id) => {
    const res = await fetch(`${BASE_URL}/deleteUsuarioCascada/${id}`, { 
      method: "DELETE" 
    });
    return handleResponse(res);
  },

  updateUsuario: async (usuario) => {
    const res = await fetch(`${BASE_URL}/updateUsuario`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    return handleResponse(res);
  },

  // =================== PRODUCTOS ===================
  addProducto: async (producto) => {
    const res = await fetch(`${BASE_URL}/addProducto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    return handleResponse(res);
  },

  addProductos: async (productos) => {
    const res = await fetch(`${BASE_URL}/addProductos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productos),
    });
    return handleResponse(res);
  },

  getProductos: async () => {
    const res = await fetch(`${BASE_URL}/productos`);
    return handleResponse(res);
  },

  getProductoById: async (id) => {
    const res = await fetch(`${BASE_URL}/productosById/${id}`);
    return handleResponse(res);
  },

  getProductoByName: async (nombre) => {
    const res = await fetch(`${BASE_URL}/productoByName/${nombre}`);
    return handleResponse(res);
  },

  updateProducto: async (producto) => {
    const res = await fetch(`${BASE_URL}/updateProducto`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    return handleResponse(res);
  },

  deleteProducto: async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/deleteProducto/${id}`, { 
      method: "DELETE" 
    });
    
    // Intentar parsear como JSON primero
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await handleResponse(res);
    } else {
      // Si no es JSON, devolver el texto plano
      const textResponse = await res.text();
      if (!res.ok) {
        throw new Error(textResponse || "Error en la eliminación");
      }
      return textResponse || "Producto eliminado exitosamente";
    }
  } catch (error) {
    console.error('Error en deleteProducto:', error);
    throw error;
  }
},

deleteProductoCascada: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/deleteProductoCascada/${id}`, { 
        method: "DELETE" 
      });
      
      // Intentar parsear como JSON primero
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        return await handleResponse(res);
      } else {
        // Si no es JSON, devolver el texto plano
        const textResponse = await res.text();
        if (!res.ok) {
          throw new Error(textResponse || "Error en la eliminación con cascada");
        }
        return textResponse || "Producto y registros relacionados eliminados exitosamente";
      }
    } catch (error) {
      console.error('Error en deleteProductoCascada:', error);
      throw error;
    }
  },

  // =================== CATEGORIAS ===================
  addCategoria: async (categoria) => {
    const res = await fetch(`${BASE_URL}/nuevaCategoria`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    });
    return handleResponse(res);
  },

  addCategorias: async (categorias) => {
    const res = await fetch(`${BASE_URL}/nuevasCategorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categorias),
    });
    return handleResponse(res);
  },

  getCategorias: async () => {
    const res = await fetch(`${BASE_URL}/categorias`);
    return handleResponse(res);
  },

  getCategoriaById: async (id) => {
    const res = await fetch(`${BASE_URL}/categoria/${id}`);
    return handleResponse(res);
  },

  updateCategoria: async (categoria) => {
    const res = await fetch(`${BASE_URL}/actualizarCategoria`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    });
    return handleResponse(res);
  },

  deleteCategoria: async (id) => {
    const res = await fetch(`${BASE_URL}/eliminarCategoria/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },

  // =================== BOLETAS ===================
  addBoleta: async (boleta) => {
    const res = await fetch(`${BASE_URL}/nuevaBoleta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(boleta),
    });
    return handleResponse(res);
  },

  addBoletas: async (boletas) => {
    const res = await fetch(`${BASE_URL}/nuevasBoletas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(boletas),
    });
    return handleResponse(res);
  },

  getBoletas: async () => {
    const res = await fetch(`${BASE_URL}/boletas`);
    return handleResponse(res);
  },

  getBoletaById: async (id) => {
    const res = await fetch(`${BASE_URL}/boletas/${id}`);
    return handleResponse(res);
  },

  getBoletasByCliente: async (cliente) => {
    const res = await fetch(`${BASE_URL}/boletas/cliente/${cliente}`);
    return handleResponse(res);
  },

  getBoletasByFecha: async (fecha) => {
    const res = await fetch(`${BASE_URL}/boletas/fecha/${fecha}`);
    return handleResponse(res);
  },

  getBoletasByEstado: async (estado) => {
    const res = await fetch(`${BASE_URL}/boletas/estado/${estado}`);
    return handleResponse(res);
  },

  getBoletasByRut: async (rut) => {
    const res = await fetch(`${BASE_URL}/boletas/rut/${rut}`);
    return handleResponse(res);
  },

  updateBoleta: async (boleta) => {
    const res = await fetch(`${BASE_URL}/actualizarBoleta`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(boleta),
    });
    return handleResponse(res);
  },

  deleteBoleta: async (id) => {
    const res = await fetch(`${BASE_URL}/eliminarBoleta/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },

  getBoletasByUsuario: async (usuarioId) => {
  try {
    const res = await fetch(`${BASE_URL}/boletas/usuario/${usuarioId}`);
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error en getBoletasByUsuario:', error);
    throw error;
  }
},

  // =================== DETALLE BOLETAS ===================
  addDetalleBoleta: async (detalle) => {
    const res = await fetch(`${BASE_URL}/nuevaDetalleBoleta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalle),
    });
    return handleResponse(res);
  },

  addDetallesBoletas: async (detalles) => {
    const res = await fetch(`${BASE_URL}/nuevasDetallesBoletas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detalles),
    });
    return handleResponse(res);
  },

  getDetallesBoletas: async () => {
    const res = await fetch(`${BASE_URL}/detallesBoletas`);
    return handleResponse(res);
  },

  getDetalleBoletaById: async (id) => {
    const res = await fetch(`${BASE_URL}/detallesBoletas/${id}`);
    return handleResponse(res);
  },

  deleteDetalleBoleta: async (id) => {
    const res = await fetch(`${BASE_URL}/eliminarDetalleBoleta/${id}`, { method: "DELETE" });
    return handleResponse(res);
  },

  // =================== OFERTAS (NUEVO) ===================
  getOfertas: async () => {
    const res = await fetch(`${BASE_URL}/ofertas`);
    return handleResponse(res);
  },
  getOfertaById: async (id) => {
  const res = await fetch(`${BASE_URL}/ofertaById/${id}`);
  return handleResponse(res);
}
};

export default DataService;
