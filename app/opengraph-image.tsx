import { ImageResponse } from "next/og";
import { business } from "./data/business";

export const alt = "Threvelonbase — electronics repairs, devices and training in Akure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #071f42 0%, #0B2D5B 52%, #123a6e 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "#ffffff",
              border: "6px solid #0B2D5B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0B2D5B",
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            TB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 42, fontWeight: 750, letterSpacing: -0.5 }}>
              {business.name}
            </div>
            <div style={{ fontSize: 22, color: "#FF7A00", fontWeight: 650 }}>
              {business.tagline}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 750,
              lineHeight: 1.08,
              letterSpacing: -1.4,
            }}
          >
            Expert repairs for phones, laptops & everyday electronics
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.82)", lineHeight: 1.35 }}>
            Workshop in Akure · WhatsApp enquiries · Practical technical training
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(255,122,0,0.55)",
            paddingTop: 28,
            fontSize: 22,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <span>
            {business.address.shop}, {business.address.locality}
          </span>
          <span style={{ color: "#FF7A00", fontWeight: 700 }}>Repair · Train · Empower</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
