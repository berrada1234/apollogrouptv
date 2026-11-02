import { ImageResponse } from "next/og";

export const alt = "Apollo Group TV — Digital Entertainment Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #050607 0%, #0A0C0F 55%, #0B3A46 100%)",
          color: "#F4F6F8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#22D3EE", fontWeight: 700, letterSpacing: 4 }}>APOLLO GROUP TV</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 24, lineHeight: 1.1, maxWidth: 900 }}>
          Entertainment, beautifully organized.
        </div>
        <div style={{ fontSize: 30, color: "#A1A8B3", marginTop: 28 }}>Flexible plans · Organized catalog · Real support</div>
      </div>
    ),
    size,
  );
}
