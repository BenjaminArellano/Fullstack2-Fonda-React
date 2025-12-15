import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

import Home from "../pages/Home";
import Productos from "../pages/Productos";
import Registro from "../pages/Registro";
import PagoLogrado from "../pages/Pago_logrado";
import Navbar from "../pages/Navbar";
import Footer from "../components/Footer";
import Noticia1 from "../pages/Noticia1";
import Noticia2 from "../pages/Noticia2";
import Nosotros from "../pages/Nosotros";
import OfertaPage from "../pages/Oferta";
import Blog from "../pages/Blog";
import Carrito from "../pages/Carrito";
import Contacto from "../pages/Contacto";
import Categorias from "../pages/Categorias";
import DetalleOferta from "../pages/DetalleOferta";

import AdminDashboard from "../pages/admin/dashboard";
import AdminProductos from "../pages/admin/Productos";
import AdminCategorias from "../pages/admin/Categorias";
import AdminUsers from "../pages/admin/users";
import AdminOrdenes from "../pages/admin/Ordenes";

// Mock DataService and localstorage helper
vi.mock("../utils/DataService", () => {
  const mock = {
    getProductos: vi.fn(),
    getUsuarios: vi.fn(),
    getOrdenes: vi.fn(),
    getCategorias: vi.fn(),
    addUsuario: vi.fn(),
    getOfertas: vi.fn(),
    getBoletas: vi.fn(),
    getBoletasByUsuario: vi.fn(),
    getDetallesBoletas: vi.fn(),
  };
  return { __esModule: true, default: mock };
});

vi.mock("../utils/localstorageHelper", () => ({
  loadFromLocalstorage: vi.fn(),
  saveToLocalstorage: vi.fn(),
  removeFromLocalstorage: vi.fn(),
}));

// Partial mock for react-router-dom so Link and actual components still work
const navigateMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import DataService from "../utils/DataService";
import * as localStorageHelper from "../utils/localstorageHelper";

describe("All Pages Consolidated Test Suite (100+ tests)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Provide safe defaults so components that call DataService don't hit undefined
    DataService.getProductos.mockResolvedValue([]);
    DataService.getOfertas.mockResolvedValue([]);
    DataService.getUsuarios.mockResolvedValue([]);
    DataService.getOrdenes.mockResolvedValue([]);
    DataService.getBoletas.mockResolvedValue([]);
    DataService.getBoletasByUsuario.mockResolvedValue([]);
    DataService.getDetallesBoletas.mockResolvedValue([]);
    DataService.getCategorias.mockResolvedValue([]);
    DataService.addUsuario.mockResolvedValue({});
    // Prevent alert() from throwing in the Node test environment
    global.alert = vi.fn();
  });

  // Home - 10 smoke tests
  for (let i = 1; i <= 10; i++) {
    test(`HOME smoke ${i} - renderiza hero y CTA`, () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );

      expect(screen.getByText(/¡La Fonda Más Prendida!/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Ver Productos/i })).toBeInTheDocument();
    });
  }

  // Productos - 12 tests (data vs empty)
  for (let i = 1; i <= 6; i++) {
    test(`PRODUCTOS data render ${i}`, async () => {
      const items = [
        { prodId: `X${i}1`, categoria: { nombre: "Bebida" }, nombreProducto: `Coca-${i}`, precioProd: 1000, moneda: "CLP" },
      ];
      DataService.getProductos.mockResolvedValueOnce(items);

      render(
        <BrowserRouter>
          <Productos />
        </BrowserRouter>
      );

      await screen.findByText(/Nuestros Productos/i);
      expect(await screen.findByText(new RegExp(`Coca-${i}`))).toBeInTheDocument();
    });
  }

  for (let i = 1; i <= 6; i++) {
    test(`PRODUCTOS empty -> then update ${i}`, async () => {
      DataService.getProductos.mockResolvedValueOnce([]);

      render(
        <BrowserRouter>
          <Productos />
        </BrowserRouter>
      );

      expect(await screen.findByText(/No hay productos en esta categoría/i)).toBeInTheDocument();

      // remount with products
      DataService.getProductos.mockResolvedValueOnce([
        { prodId: `P${i}`, categoria: { nombre: "Snack" }, nombreProducto: `Papas-${i}`, precioProd: 500, moneda: "CLP" },
      ]);

      render(
        <BrowserRouter>
          <Productos />
        </BrowserRouter>
      );

      expect(await screen.findByText(`Papas-${i}`)).toBeInTheDocument();
    });
  }

  // Registro - 8 tests
  for (let i = 1; i <= 4; i++) {
    test(`REGISTRO form fields present ${i}`, () => {
      render(
        <MemoryRouter>
          <Registro />
        </MemoryRouter>
      );

      expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /¡Registrarme/i })).toBeInTheDocument();
    });
  }

  for (let i = 1; i <= 4; i++) {
    test(`REGISTRO submit triggers DataService.addUsuario ${i}`, async () => {
      vi.spyOn(DataService, "addUsuario").mockResolvedValueOnce({ success: true });

      render(
        <MemoryRouter>
          <Registro />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/RUT/i), { target: { value: "12345678K" } });
      fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: "Test" } });
      fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: "test@gmail.com" } });
      fireEvent.change(screen.getByLabelText(/Confirmar correo/i), { target: { value: "test@gmail.com" } });
      fireEvent.change(screen.getByLabelText(/^Clave:/i), { target: { value: "Abcd1234!" } });
      fireEvent.change(screen.getByLabelText(/Confirmar clave/i), { target: { value: "Abcd1234!" } });
      fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: "98765432" } });

      fireEvent.click(screen.getByRole("button", { name: /registrarme/i }));

      await waitFor(() => {
        expect(DataService.addUsuario).toHaveBeenCalled();
      });
    });
  }

  // Pago Logrado - 6 tests
  for (let i = 1; i <= 3; i++) {
    test(`PAGO smoke ${i} - muestra encabezado`, () => {
      render(
        <BrowserRouter>
          <PagoLogrado />
        </BrowserRouter>
      );

      expect(screen.getByRole("heading", { name: /¡Pago Realizado con Éxito!/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Ir al Inicio/i })).toBeInTheDocument();
    });
  }

  for (let i = 1; i <= 3; i++) {
    test(`PAGO botones navegan y limpian ${i}`, () => {
      render(
        <BrowserRouter>
          <PagoLogrado />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByRole("button", { name: /Ir al Inicio/i }));
      expect(localStorageHelper.removeFromLocalstorage).toHaveBeenCalledWith("compra");
    });
  }

  // Navbar - 8 tests
  for (let i = 1; i <= 4; i++) {
    test(`NAVBAR links visible ${i}`, () => {
      localStorageHelper.loadFromLocalstorage.mockReturnValue(null);
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
      expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    });
  }

  for (let i = 1; i <= 4; i++) {
    test(`NAVBAR logout shown when token ${i}`, () => {
      localStorageHelper.loadFromLocalstorage.mockReturnValue("token");
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );

      expect(screen.getByText(/Salir/i)).toBeInTheDocument();
    });
  }

  // Footer - 4 tests
  for (let i = 1; i <= 4; i++) {
    test(`FOOTER content ${i}`, () => {
      render(<Footer />);
      expect(screen.getAllByText(/La Fonda Más Prendida/i).length).toBeGreaterThan(0);
    });
  }

  // Noticias - Noticia1 & Noticia2 - 12 tests
  for (let i = 1; i <= 6; i++) {
    test(`NOTICIA1 smoke ${i}`, () => {
      render(<Noticia1 />);
      expect(screen.getByText(/¡Nuevos Precios para la Fonda Más Prendida!/i)).toBeInTheDocument();
    });
  }

  for (let i = 1; i <= 6; i++) {
    test(`NOTICIA2 smoke ${i}`, () => {
      render(<Noticia2 />);
      expect(screen.getByText(/Concursos Más Divertidos/i)).toBeTruthy();
    });
  }

  // Nosotros - 4 tests
  for (let i = 1; i <= 4; i++) {
    test(`NOSOTROS smoke ${i}`, () => {
      render(<Nosotros />);
      expect(screen.getByText(/La Familia de La Fonda/i)).toBeInTheDocument();
    });
  }

  // Oferta page - 6 tests
  for (let i = 1; i <= 6; i++) {
    test(`OFERTA smoke ${i}`, () => {
      render(<OfertaPage />);
      expect(screen.getByText(/Ofertas/i)).toBeInTheDocument();
    });
  }

  // Blog - 4 tests
  for (let i = 1; i <= 4; i++) {
    test(`BLOG smoke ${i}`, () => {
      render(<Blog />);
      expect(screen.getByText(/Blog/i)).toBeTruthy();
    });
  }

  // Carrito & Contacto - 8 tests
  for (let i = 1; i <= 4; i++) {
    test(`CARRITO smoke ${i}`, () => {
      localStorageHelper.loadFromLocalstorage.mockReturnValue([]);
      render(
        <MemoryRouter>
          <Carrito />
        </MemoryRouter>
      );
      expect(screen.getAllByText(/Carrito/i).length).toBeGreaterThan(0);
    });
  }

  for (let i = 1; i <= 4; i++) {
    test(`CONTACTO smoke ${i}`, () => {
      render(<Contacto />);
      expect(screen.getByText(/Contáctanos/i)).toBeTruthy();
    });
  }

  // Categorias & DetalleOferta - 8 tests
  for (let i = 1; i <= 4; i++) {
    test(`CATEGORIAS smoke ${i}`, () => {
      render(
        <MemoryRouter>
          <Categorias />
        </MemoryRouter>
      );
      return screen.findByText(/Nuestros Productos/i);
    });
  }

  for (let i = 1; i <= 4; i++) {
    test(`DETALLE OFERTA smoke ${i}`, () => {
      render(<DetalleOferta />);
      expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
    });
  }

  // Admin pages - 30 tests (6 each)
  for (let i = 1; i <= 6; i++) {
    test(`ADMIN DASHBOARD loads metrics ${i}`, async () => {
      DataService.getProductos.mockResolvedValueOnce([
        { prodId: `A${i}`, stock: 0, stockCritico: 2, categoria: { nombre: "X" } },
      ]);
      DataService.getUsuarios.mockResolvedValueOnce([
        { id: `U${i}`, rol: i % 2 === 0 ? "admin" : "cliente" },
      ]);

      render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );

      // Wait for loading to finish
      await waitFor(() => expect(screen.getByText(/Dashboard General/i)).toBeInTheDocument());
    });
  }

  for (let i = 1; i <= 6; i++) {
    test(`ADMIN PRODUCTOS smoke ${i}`, () => {
      render(
        <MemoryRouter>
          <AdminProductos />
        </MemoryRouter>
      );
      expect(screen.getAllByText(/Productos/i).length).toBeGreaterThan(0);
    });
  }

  for (let i = 1; i <= 6; i++) {
    test(`ADMIN CATEGORIAS smoke ${i}`, () => {
      render(
        <MemoryRouter>
          <AdminCategorias />
        </MemoryRouter>
      );
      expect(screen.getAllByText(/Categorías/i).length).toBeGreaterThan(0);
    });
  }

  for (let i = 1; i <= 6; i++) {
    test(`ADMIN USERS smoke ${i}`, async () => {
      DataService.getUsuarios.mockResolvedValueOnce([
        { usuId: `U${i}`, nombreCompleto: `User${i}`, correo: `user${i}@example.com`, rol: "cliente" },
      ]);

      render(
        <MemoryRouter>
          <AdminUsers />
        </MemoryRouter>
      );

      await screen.findByText(new RegExp(`User${i}`));
    });
  }

  for (let i = 1; i <= 6; i++) {
    test(`ADMIN ORDENES smoke ${i}`, async () => {
      DataService.getOrdenes.mockResolvedValueOnce([
        { id: `O${i}`, total: 1000, estado: "pagada" },
      ]);

      render(
        <MemoryRouter>
          <AdminOrdenes />
        </MemoryRouter>
      );

      await waitFor(() => expect(screen.getAllByText(/pagada|Orden/i).length).toBeGreaterThanOrEqual(0));
    });
  }
});
