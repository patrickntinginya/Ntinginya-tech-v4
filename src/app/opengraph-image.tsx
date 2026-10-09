import { ImageResponse } from "next/og";

export const alt = "Ntinginya Tech | Technology & Innovation Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const ring = (d: number, right: number, top: number) => (
    <div
      style={{
        position: "absolute",
        right,
        top,
        width: d,
        height: d,
        borderRadius: d,
        border: "2px solid rgba(255,255,255,0.12)",
      }}
    />
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A2A30",
          color: "#FFFFFF",
          padding: 72,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {ring(760, -220, -200)}
        {ring(600, -140, -120)}
        {ring(440, -60, -40)}
        {ring(280, 20, 40)}

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#F5B700",
              color: "#0A2A30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 34, letterSpacing: 6, fontWeight: 700, display: "flex" }}>NTINGINYA TECH</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 900, display: "flex" }}>
            Building Technology for Real-World Problems.
          </div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#9AD3B0", display: "flex" }}>
            Building Technology. Empowering People. Transforming Agriculture.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
