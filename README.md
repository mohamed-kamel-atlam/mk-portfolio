# mk-portfolio

A premium, production-grade engineering portfolio built with the Next.js App
Router. The documentation is part of the product and is the single source of
truth — start at **[`docs/README.md`](./docs/README.md)** and the keystone
**[`docs/engineering/ARCHITECTURE.md`](./docs/engineering/ARCHITECTURE.md)**.

## Status

Milestone **M0 — Repository foundation** (see
[`docs/product/ROADMAP.md`](./docs/product/ROADMAP.md)). Tooling and the design-
token layer are initialized; feature implementation begins at M1.

## Stack

- **Next.js (App Router)** + **React** — server-first (RSC)
- **TypeScript** (strict)
- **Tailwind CSS** driven by design tokens
- **ESLint · Prettier · Husky · lint-staged**
- Deployed to **Vercel**

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script              | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start the dev server                              |
| `npm run build`     | Production build                                  |
| `npm run start`     | Serve the production build                        |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript + a11y) |
| `npm run typecheck` | `tsc --noEmit`                                    |
| `npm run format`    | Prettier write                                    |

## Project structure

Application code lives under `src/`, organized by the four architectural layers
(routing / feature / shared / content). See
[`docs/engineering/FOLDER_STRUCTURE.md`](./docs/engineering/FOLDER_STRUCTURE.md).

## Contributing

Every change follows
[`docs/engineering/DEVELOPMENT_GUIDELINES.md`](./docs/engineering/DEVELOPMENT_GUIDELINES.md)
and [`docs/developer/CODING_STANDARDS.md`](./docs/developer/CODING_STANDARDS.md).
Version control is managed manually by the owner.
