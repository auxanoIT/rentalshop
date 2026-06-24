import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ITShop Equipment Leasing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f7faf8",
          color: "#111812",
          padding: 72,
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ color: "#087443", fontSize: 28, fontWeight: 700 }}>rent.itshop.ng</div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginTop: 28 }}>
          IT equipment rental in Nigeria
        </div>
        <div style={{ fontSize: 30, color: "#46524a", marginTop: 28 }}>
          Laptop rental, bulk rental, training, CBT exams, and temporary teams.
        </div>
      </div>
    ),
    size
  );
}
