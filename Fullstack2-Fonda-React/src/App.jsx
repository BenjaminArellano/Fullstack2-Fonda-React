import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './pages/Navbar'
import Footer from './components/footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Blog from './pages/Blog'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Contacto from './pages/Contacto'
import Nosotros from './pages/Nosotros'
import Noticia1 from './pages/Noticia1'
import Noticia2 from './pages/Noticia2'
import { loadFromLocalstorage } from "./utils/localstorageHelper.js";
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito.jsx'
import SimulacionPago from './pages/SimulacionPago.jsx'
import Categorias from './pages/Categorias.jsx'
import PagoLogrado from './pages/Pago_logrado.jsx'
import PagoFallido from './pages/Pago_fallido.jsx'
import Oferta from './pages/Oferta.jsx'
import DetalleOferta from './pages/DetalleOferta.jsx'

import AdminLayout from './components/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/dashboard.jsx'
import Users from './pages/admin/users.jsx'
import ProductosAdmin from './pages/admin/Productos.jsx'
import CategoriasAdmin from './pages/admin/Categorias.jsx'
import Ordenes from './pages/admin/Ordenes.jsx'
import Actividad from './pages/admin/Actividad.jsx'


const token = loadFromLocalstorage("token");

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={
          <>
            <Navbar/>
            <div className='container mt-4'>
              <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/productos' element={<Productos/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/registro' element={<Registro/>} />
                <Route path='/categorias' element={<Categorias/>} />
                <Route path='/pago_logrado' element={<PagoLogrado/>} />
                <Route path='/pago_fallido' element={<PagoFallido/>} />
                <Route path='/ofertas' element={<Oferta/>} />
                <Route path='/oferta/:id' element={<DetalleOferta/>} />
                <Route path='/carrito' element={<Carrito/>} />
                <Route path="/simulacionPago" element={<SimulacionPago/>} />
                <Route path='/blog' element={<Blog/>} />
                <Route path="/noticia1" element={<Noticia1 />} />
                <Route path="/noticia2" element={<Noticia2 />} />
                <Route path='/contacto' element={<Contacto/>} />
                <Route path='/nosotros' element={<Nosotros/>} />
                <Route path='/producto/:id' element={<DetalleProducto />} />

              
              </Routes>
            </div>
            <Footer/>
          </>
        } />
        
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="" element={<Navigate to="Dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="ordenes" element={<Ordenes/>} />
          <Route path="registro-actividad" element={<Actividad/>} />
          
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
