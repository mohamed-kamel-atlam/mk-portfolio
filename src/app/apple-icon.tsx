import { ImageResponse } from "next/og";

/**
 * Apple touch icon (180×180) — generated with `next/og`, so there is no binary
 * asset to maintain and it stays in sync with the brand mark (`icon.svg`). iOS
 * masks/rounds it, so the artwork is full-bleed. Colors are the brand-mark
 * literals (accent-500 M, neutral-50 K on neutral-950) — a data-generated image
 * cannot read CSS variables.
 */
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
        backgroundColor: "#0b0d0f",
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
