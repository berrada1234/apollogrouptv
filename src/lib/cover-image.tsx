import { ImageResponse } from "next/og";
import { markSvg } from "@/lib/brand-mark";
import type { Cover } from "@/lib/covers";

const size = { width: 1200, height: 630 };
const mark = `data:image/svg+xml;base64,${Buffer.from(markSvg({ size: 128, id: "cv" })).toString("base64")}`;

/** Renders a 1200×630 cover: the brand mark and name, the page type, the page's title and a short footer line. */
export function renderCover({ eyebrow, title, footer }: Cover) {
  const fontSize = title.length > 70 ? 50 : title.length > 48 ? 58 : 66;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "linear-gradient(135deg, #070A1F 0%, #0A0E27 50%, #1A1446 100%)",
          color: "#F4F6FF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img elements */}
          <img src={mark} width={56} height={56} alt="" />
          <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5 }}>
            <span style={{ fontWeight: 700 }}>Apollo</span>
            <span style={{ color: "#A9B8FF", marginLeft: 10 }}>Group TV</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontSize: 24,
              color: "#0A0E27",
              background: "linear-gradient(90deg, #46E0FF, #7B8CFF, #A77BFF)",
              borderRadius: 999,
              padding: "7px 20px",
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontSize, fontWeight: 700, marginTop: 26, lineHeight: 1.12, maxWidth: 1040, letterSpacing: -1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#A1A8C3" }}>
          <span>{footer}</span>
          <span style={{ color: "#A9B8FF" }}>apollogroupr.tv</span>
        </div>
      </div>
    ),
    { ...size, headers: { "cache-control": "public, max-age=86400, stale-while-revalidate=604800" } },
  );
}
