import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

/**
 * Application fonts (TYPOGRAPHY.md). Geist Sans/Mono are self-hosted through the
 * `geist` package — no build-time network fetch, better performance (QAT-1) and
 * privacy — and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`)
 * that the design tokens' `--font-sans` / `--font-mono` stacks reference.
 *
 * `fontVariables` is applied once on `<html>` by the root layout. The Arabic
 * face is layered in via the locale-aware `[lang="ar"]` stack in `globals.css`
 * (TYPOGRAPHY.md §4); its self-hosted loader is added here when Arabic content
 * ships. Centralizing font wiring here keeps the layout thin and makes adding a
 * face a one-file change.
 */
export const fontVariables = `${GeistSans.variable} ${GeistMono.variable}`;
