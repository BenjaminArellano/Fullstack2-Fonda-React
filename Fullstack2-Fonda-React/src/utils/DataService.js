// src/services/DataService.js

const BASE_URL = "http://localhost:8088/v1";
const API_KEY = "123456"; 

// Función base para todas las peticiones
const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...(options.headers || {}),
    },
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error en la petición");
  }

  // Si la respuesta no es JSON
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
};

const DataService = {
  // =================== USUARIOS ===================
  addUsuario: (usuario) =>
    request("/addUsuario", {
      method: "POST",
      body: JSON.stringify(usuario),
    }),

  addUsuarios: (usuarios) =>
    request("/addUsuarios", {
      method: "POST",
      body: JSON.stringify(usuarios),
    }),

  getUsuarios: () => request("/usuarios"),

  getUsuarioById: (id) => request(`/usuariosById/${id}`),

  getUsuarioByNombre: (nombre) =>
    request(`/usuariosByNombre/${nombre}`),

  getUsuarioByRut: (rut) =>
    request(`/usuariosByRut/${rut}`),

  getUsuarioByCorreo: (correo) =>
    request(`/usuariosByCorreo/${correo}`),

  updateUsuario: (usuario) =>
    request("/updateUsuario", {
      method: "PUT",
      body: JSON.stringify(usuario),
    }),

  deleteUsuario: (id) =>
    request(`/deleteUsuario/${id}`, {
      method: "DELETE",
    }),

  deleteUsuarioCascada: (id) =>
    request(`/deleteUsuarioCascada/${id}`, {
      method: "DELETE",
    }),

  // =================== PRODUCTOS ===================
  addProducto: (producto) =>
    request("/addProducto", {
      method: "POST",
      body: JSON.stringify(producto),
    }),

  addProductos: (productos) =>
    request("/addProductos", {
      method: "POST",
      body: JSON.stringify(productos),
    }),

  getProductos: () => request("/productos"),

  getProductoById: (id) =>
    request(`/productosById/${id}`),

  getProductoByName: (nombre) =>
    request(`/productoByName/${nombre}`),

  updateProducto: (producto) =>
    request("/updateProducto", {
      method: "PUT",
      body: JSON.stringify(producto),
    }),

  deleteProducto: (id) =>
    request(`/deleteProducto/${id}`, {
      method: "DELETE",
    }),

  deleteProductoCascada: (id) =>
    request(`/deleteProductoCascada/${id}`, {
      method: "DELETE",
    }),

  // =================== CATEGORIAS ===================
  addCategoria: (categoria) =>
    request("/nuevaCategoria", {
      method: "POST",
      body: JSON.stringify(categoria),
    }),

  addCategorias: (categorias) =>
    request("/nuevasCategorias", {
      method: "POST",
      body: JSON.stringify(categorias),
    }),

  getCategorias: () => request("/categorias"),

  getCategoriaById: (id) =>
    request(`/categoria/${id}`),

  updateCategoria: (categoria) =>
    request("/actualizarCategoria", {
      method: "PUT",
      body: JSON.stringify(categoria),
    }),

  deleteCategoria: (id) =>
    request(`/eliminarCategoria/${id}`, {
      method: "DELETE",
    }),

  // =================== BOLETAS ===================
  addBoleta: (boleta) =>
    request("/nuevaBoleta", {
      method: "POST",
      body: JSON.stringify(boleta),
    }),

  addBoletas: (boletas) =>
    request("/nuevasBoletas", {
      method: "POST",
      body: JSON.stringify(boletas),
    }),

  getBoletas: () => request("/boletas"),

  getBoletaById: (id) =>
    request(`/boletas/${id}`),

  getBoletasByCliente: (cliente) =>
    request(`/boletas/cliente/${cliente}`),

  getBoletasByFecha: (fecha) =>
    request(`/boletas/fecha/${fecha}`),

  getBoletasByEstado: (estado) =>
    request(`/boletas/estado/${estado}`),

  getBoletasByRut: (rut) =>
    request(`/boletas/rut/${rut}`),

  getBoletasByUsuario: (usuarioId) =>
    request(`/boletas/usuario/${usuarioId}`),

  updateBoleta: (boleta) =>
    request("/actualizarBoleta", {
      method: "PUT",
      body: JSON.stringify(boleta),
    }),

  deleteBoleta: (id) =>
    request(`/eliminarBoleta/${id}`, {
      method: "DELETE",
    }),

  // =================== DETALLE BOLETAS ===================
  addDetalleBoleta: (detalle) =>
    request("/nuevaDetalleBoleta", {
      method: "POST",
      body: JSON.stringify(detalle),
    }),

  addDetallesBoletas: (detalles) =>
    request("/nuevasDetallesBoletas", {
      method: "POST",
      body: JSON.stringify(detalles),
    }),

  getDetallesBoletas: () => request("/detallesBoletas"),

  getDetalleBoletaById: (id) =>
    request(`/detallesBoletas/${id}`),

  deleteDetalleBoleta: (id) =>
    request(`/eliminarDetalleBoleta/${id}`, {
      method: "DELETE",
    }),

  // =================== OFERTAS ===================
  getOfertas: () => request("/ofertas"),

  getOfertaById: (id) =>
    request(`/ofertaById/${id}`),
};

export default DataService;