import { ImageResponse } from "next/og";
import { markSvg } from "@/lib/brand-mark";

const markData = `data:image/svg+xml;base64,${Buffer.from(markSvg({ size: 144, id: "og" })).toString("base64")}`;

export const alt = "Apollo Group TV: live TV, sports and movies on your own screens";
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
          background: "linear-gradient(135deg, #05060f 0%, #0A0C0F 55%, #0B3A46 100%)",
          color: "#F4F6F8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img elements */}
          <img src={markData} width={72} height={72} alt="" />
          <div style={{ display: "flex", fontSize: 36, letterSpacing: -1 }}>
            <span style={{ color: "#F4F6FF", fontWeight: 700 }}>Apollo</span>
            <span style={{ color: "#A9B8FF", marginLeft: 12 }}>Group TV</span>
          </div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 24, lineHeight: 1.1, maxWidth: 900 }}>
          Live TV, sports and movies on your own screens.
        </div>
        <div style={{ fontSize: 30, color: "#A1A8B3", marginTop: 28 }}>Fire TV · Android · iPhone · Windows · Mac</div>
      </div>
    ),
    size,
  );
}
