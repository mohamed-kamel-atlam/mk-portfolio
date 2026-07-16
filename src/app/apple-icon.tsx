import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#081423",
        fontSize: 96,
        fontWeight: 600,
        fontFamily: "sans-serif",
      }}
    >
      <span style={{ color: "#5b7cfa" }}>M</span>
      <span style={{ color: "#f7f8f8" }}>K</span>
    </div>,
    { ...size },
  );
}
