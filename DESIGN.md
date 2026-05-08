# Styio Design System

This file records the current website design tokens and component rules.
Only the Cool theme family is active. The theme switcher still keeps the
family-based shape so more palettes can be added later without changing the
footer or header logic.

## Active Themes

| Theme | Attribute | Role |
|---|---|---|
| Cool Light | `data-theme="cool"` | Light theme with cold white surfaces, cyan structure, and restrained gold highlights |
| Cool Dark | `data-theme="cool-dark"` | Near-black theme with cold gray-blue surfaces, electric cyan details, and molten gold emphasis |

## Cool Light Tokens

| Token | Value | Role |
|---|---|---|
| `--bg` | `#F7FBFC` | Page background |
| `--bg-raised` | `#EAF3F7` | Header, footer, and raised sections |
| `--bg-deep` | `#EDF7FA` | Secondary section layer |
| `--surface` | `#FFFFFF` | Card and code-adjacent surfaces |
| `--ink` | `#0B0C11` | Primary text |
| `--muted` | `#445460` | Body and secondary text |
| `--title` | `#0B0C11` | Primary headings |
| `--doc-title` | `#0F6F84` | Documentation page titles |
| `--doc-body` | `#475966` | Documentation body text |
| `--line` | `#D1E5EB` | Subtle border |
| `--line-strong` | `#A6CFE2` | Visible border |
| `--accent` | `#0F8CA3` | Link and structural highlight |
| `--accent-strong` | `#9A6B00` | Warm highlight where contrast is needed |
| `--electric-cyan` | `#19AAD1` | Cyan syntax and UI accent |
| `--ice-blue` | `#A6CFE2` | Soft button and border ecosystem |
| `--neon-yellow` | `#9A6B00` | Light-theme gold highlight |
| `--code-bg` | `#EAF1F4` | Code block background |
| `--code-ink` | `#0B0C11` | Code text |

## Cool Dark Tokens

| Token | Value | Role |
|---|---|---|
| `--bg` | `#09090B` | Page background |
| `--bg-raised` | `#0D1114` | Header, footer, and raised sections |
| `--bg-deep` | `#050507` | Deep section layer |
| `--surface` | `#10161A` | Card and panel face |
| `--ink` | `#FFFFFF` | Primary text |
| `--muted` | `#FFFFFF` | Homepage body text |
| `--title` | `#FFD45A` | Warm emphasis token |
| `--doc-title` | `#F7FBFC` | Documentation page titles |
| `--doc-heading` | `#EEEEEE` | Documentation section headings |
| `--doc-subheading` | `#DEDEDE` | Documentation nested headings |
| `--doc-body` | `#BAC7CD` | Documentation body text |
| `--line` | `#243137` | Subtle border |
| `--line-strong` | `#314650` | Visible border |
| `--accent` | `#7DCFFF` | Link and structural highlight |
| `--accent-strong` | `#FFD45A` | Gold highlight |
| `--electric-cyan` | `#7DCFFF` | Cyan syntax and UI accent |
| `--ice-blue` | `#A6CFE2` | Soft button and border ecosystem |
| `--neon-yellow` | `#FFD45A` | Dark-theme gold highlight |
| `--code-bg` | `#0B0F12` | Code block background |
| `--code-ink` | `#FFFFFF` | Code text |

## Typography

| Token | Value | Role |
|---|---|---|
| `--font-ui` | Inter/system sans stack | General UI and body text |
| `--font-title` | Inter/system sans stack | Headings and promotional copy |
| `--font-status` | Inter/system sans stack | Badges, labels, and compact status text |
| `--font-code` | SFMono/Consolas monospace stack | Code and terminal-style snippets |

Hero headings use `clamp(44px, 6.2vw, 80px)` with weight about 800.
Section headings use `clamp(30px, 3.4vw, 44px)`.

## Components

| Component | Rule |
|---|---|
| Header | Sticky, translucent, and separated from the page by `--header-border` |
| Hero | Two-column layout on desktop, single-column on mobile |
| Hero code | Uses theme syntax tokens and a subtle electric glass border |
| Primary CTA | Solid ice-blue ecosystem, with a lightweight hover state |
| Pillars | Operator mark and title share one row; body text aligns to the title box |
| Tables | Tags use compact status typography with vertical rhythm between rows |
| Code blocks | Copy button is icon-only and placed at the top-right corner |
| Footer | Rendered by `assets/site-footer.js` on every page |

## Theme Behavior

| Behavior | Storage |
|---|---|
| Active theme | `localStorage.styio-theme` |
| Active family | `localStorage.styio-theme-family` |
| Active mode | `localStorage.styio-theme-mode` |

The header button toggles light and dark within the current family. The footer
swatch selects a family while preserving the current light or dark mode.
