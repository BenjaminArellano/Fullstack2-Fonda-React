import React, { useState, useEffect } from 'react';
import VentasPorMesLine from '../../components/charts/VentasPorMesLine';
import UsuariosActivosBar from '../../components/charts/UsuariosActivosBar';
import VentasMerchandisingBar from '../../components/charts/VentasMerchandisingBar';
import ProporcionCategoriaPie from '../../components/charts/ProporcionCategoriaPie';
import RankingProductosBar from '../../components/charts/RankingProductosBar';
import { productos as productosIniciales } from '../../data/admin/productos';
import { usuarios as usuariosIniciales } from '../../data/admin/usuarios';
import DataService from '../../utils/DataService';


const cardStyle = { background: "#fff", padding: "1rem", borderRadius: "10px", boxShadow: "0 5px 18px 0 rgba(0, 0, 0, 0.51)" };

export default function Dashboard() {
  const [metricas, setMetricas] = useState({
    productosSinStock: 0,
    productosStockCritico: 0,
    usuariosRegistrados: 0,
    totalProductos: 0,
    administradoresCount: 0
  });

  const [categoriasCount, setCategoriasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar las métricas de las tarjetas
  const cargarMetricasTarjetas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar productos usando tu endpoint existente
      const productos = await DataService.getProductos();
      
      // Cargar usuarios usando tu endpoint existente
      const usuarios = await DataService.getUsuarios();

      // Calcular métricas de productos
      const productosSinStock = productos.filter(producto => 
        producto.stock === 0 || producto.stock === '0'
      ).length;
      
      const productosStockCritico = productos.filter(producto => {
        const stock = parseInt(producto.stock) || 0;
        const stockCritico = parseInt(producto.stockCritico) || 5; // Valor por defecto si no existe
        return stock > 0 && stock <= stockCritico;
      }).length;

      // Calcular métricas de usuarios
      const administradoresCount = usuarios.filter(u => 
        u.rol === 'admin' || u.rol === 'ADMIN' || u.rol === 'Administrador'
      ).length;

      // Calcular categorías únicas - adaptado a tu estructura de datos
      const categoriasUnicas = new Set(
        productos.map(p => {
          // Manejar diferentes estructuras posibles de categoría
          if (p.categoria && typeof p.categoria === 'object') {
            return p.categoria.nombre || p.categoria.catNombre || 'Sin categoría';
          }
          return p.categoria || 'Sin categoría';
        })
      ).size;

      // Actualizar estado
      setMetricas({
        productosSinStock,
        productosStockCritico,
        usuariosRegistrados: usuarios.length,
        totalProductos: productos.length,
        administradoresCount
      });

      setCategoriasCount(categoriasUnicas);

      console.log('Métricas de tarjetas cargadas:', {
        productosTotal: productos.length,
        productosSinStock,
        productosStockCritico,
        usuariosTotal: usuarios.length,
        administradoresCount,
        categoriasUnicas
      });

    } catch (error) {
      console.error('Error al cargar métricas de tarjetas:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Cargar métricas al montar el componente
  useEffect(() => {
    cargarMetricasTarjetas();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-admin" style={{ padding: '1rem', position: 'relative', zIndex: 5 }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando métricas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-admin" style={{ padding: '1rem', position: 'relative', zIndex: 5 }}>
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={cargarMetricasTarjetas}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-admin" style={{ padding: '1rem', position: 'relative', zIndex: 5 }}>
      
      {/* Botón de actualizar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: '#333', fontWeight: '600' }}>Dashboard General</h2>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={cargarMetricasTarjetas}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>
      
      {/* Tarjetas de Métricas */}
      <div className="metricas-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px',
        position: 'relative', 
        zIndex: 5 
      }}>
        
        {/* Tarjeta Amarilla - Productos sin stock */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.productosSinStock}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Productos sin stock</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            De {metricas.totalProductos} productos totales
          </div>
        </div>

        {/* Tarjeta Roja - Stock crítico */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.productosStockCritico}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Stock crítico</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-speedometer2" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            Necesitan reposición urgente
          </div>
        </div>

        {/* Tarjeta Azul - Usuarios registrados */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #4D96FF, #6BC5FF)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(77, 150, 255, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.usuariosRegistrados}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Usuarios registrados</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-people-fill" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            {metricas.administradoresCount} administradores
          </div>
        </div>

        {/* Tarjeta Verde - Total productos */}
        <div className="card-metrica" style={{ 
          background: 'linear-gradient(135deg, #2ED573, #7BED9F)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(46, 213, 115, 0.3)',
          color: '#fff',
          border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>
                {metricas.totalProductos}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Total productos</p>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <i className="bi bi-box-seam" style={{ fontSize: '1.8rem' }}></i>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.8rem', opacity: 0.8 }}>
            {categoriasCount} categorías
          </div>
        </div>

      </div>

      {/* Gráficos existentes */}
      <div className="dashboard-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '16px', 
        position: 'relative', 
        zIndex: 5 
      }}>
        <div className="card-dashboard" style={cardStyle}><VentasPorMesLine /></div>
        <div className="card-dashboard" style={cardStyle}><UsuariosActivosBar /></div>
        <div className="card-dashboard" style={cardStyle}><VentasMerchandisingBar /></div>
        <RankingProductosBar />
        <ProporcionCategoriaPie />
      </div>
    </div>
  );
}