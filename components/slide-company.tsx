"use client";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://mecaluxbr.cdnwm.com/img/blog/distribuicao-armazem.1.18.jpg",
    title: "Distribuição em grande escala",
    sub: "Conectando indústrias ao varejo com eficiência e volume",
  },
  {
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80",
    title: "Estoque sempre disponível",
    sub: "Mais de 5.000 SKUs prontos para entrega imediata",
  },
  {
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80",
    title: "Compre no atacado com confiança",
    sub: "Preços competitivos para revendedores e empresas",
  },
];

export default function SliderCompany() {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCur((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goTo = (n: number) => setCur((n + slides.length) % slides.length);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "12px",
        height: "340px",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
          transform: `translateX(-${cur * 100}%)`,
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            style={{
              minWidth: "100%",
              height: "100%",
              backgroundImage: `url('${s.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding: "1.5rem 2rem",
                color: "#fff",
              }}
            >
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  margin: 0,
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "6px",
                  opacity: 0.88,
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
              >
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => goTo(cur - 1)}
        aria-label="Anterior"
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "rgba(255,255,255,0.2)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.38)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.2)")
        }
      >
        ‹
      </button>
      <button
        onClick={() => goTo(cur + 1)}
        aria-label="Próximo"
        style={{
          position: "absolute",
          right: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "rgba(255,255,255,0.2)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          color: "#fff",
          fontSize: "22px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.38)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.2)")
        }
      >
        ›
      </button>

      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === cur ? "22px" : "8px",
              height: "8px",
              borderRadius: "99px",
              border: "none",
              background: i === cur ? "#fff" : "rgba(255,255,255,0.45)",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}