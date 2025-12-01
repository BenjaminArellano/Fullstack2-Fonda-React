function Footer() {
  return (
    <footer className="mt-5" style={{
      background: "linear-gradient(135deg, #1e282c, #374850)",
      color: "#fff",
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div className="container">
        <div className="row py-4">
          {/* Sección bienvenida */}
          <div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div className="mb-3">
              <h5 style={{
                color: "#fff",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1.25rem",
                borderBottom: "2px solid #0D47A1",
                paddingBottom: "0.5rem",
                display: "inline-block"
              }}>
                ¡La Fonda Más Prendida!
              </h5>
              <p style={{
                color: "#b8c7ce",
                fontSize: "0.95rem",
                lineHeight: "1.6"
              }}>
                Disfruta de la auténtica experiencia chilena: comida típica, música,
                juegos y diversión para toda la familia. Ven a celebrar con nosotros
                y vive momentos inolvidables.
              </p>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div className="mb-3">
              <h5 style={{
                color: "#fff",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1.25rem",
                borderBottom: "2px solid #0D47A1",
                paddingBottom: "0.5rem",
                display: "inline-block"
              }}>
                Contacto
              </h5>
              <div style={{ color: "#b8c7ce" }}>
                <p className="mb-2">
                  <i className="bi bi-geo-alt me-2" style={{ color: "#4D96FF" }}></i>
                  Dirección: Av. Principal 1234, Santiago
                </p>
                <p className="mb-2">
                  <i className="bi bi-telephone me-2" style={{ color: "#4D96FF" }}></i>
                  Teléfono: (2) 2345 6789
                </p>
                <p className="mb-0">
                  <i className="bi bi-envelope me-2" style={{ color: "#4D96FF" }}></i>
                  Email: contacto@fondamasprendida.cl
                </p>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="col-12 col-md-12 col-lg-4">
            <div className="mb-3">
              <h5 style={{
                color: "#fff",
                fontWeight: "600",
                marginBottom: "1rem",
                fontSize: "1.25rem",
                borderBottom: "2px solid #0D47A1",
                paddingBottom: "0.5rem",
                display: "inline-block"
              }}>
                Síguenos
              </h5>
              <p style={{ color: "#b8c7ce", marginBottom: "1rem" }}>
                Próximamente en redes sociales
              </p>
              <div className="d-flex gap-3">
                {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                  <div
                    key={social}
                    className="social-icon"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "1.2rem"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0D47A1";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <i className={`bi bi-${social}`}></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Derechos */}
        <div className="row">
          <div className="col-12">
            <div className="text-center py-3" style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#b8c7ce",
              fontSize: "0.9rem"
            }}>
              <p className="mb-0">
                &copy; {new Date().getFullYear()} La Fonda Más Prendida. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;