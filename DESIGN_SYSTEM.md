# Mavlono 4.0 — Design System

> *تarjumai ҳol — A literary platform for Tajik poetry. Every pixel should feel like parchment and ink.*

Generated using ui-ux-pro-max + frontend-design + web-design-guidelines skills.

---

## Concept & Aesthetic Direction

**Theme:** Dark Editorial / Literary Noir
**Mood:** Midnight library. Candlelight over aged manuscripts. Classical poetry meets modern digital publishing.
**Differentiator:** Most poetry apps are whites and grays. We use **deep ink black + aged-gold** — the colour of calligraphy and candlelight, making verses feel *sacred and important*.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0D0B09` | Main background (near-black warm) |
| `--color-surface` | `#1A1714` | Cards, sidebar, panels |
| `--color-surface-2` | `#252119` | Hover states, nested cards |
| `--color-border` | `#2E2A24` | Dividers, card borders |
| `--color-gold` | `#C9A84C` | Primary accent (CTA, highlights) |
| `--color-gold-soft` | `#D4B483` | Muted accents, tags |
| `--color-text-primary` | `#F0EBE0` | Headings, primary text |
| `--color-text-muted` | `#8C8278` | Secondary text, metadata |
| `--color-text-faint` | `#544E48` | Placeholders, inactive |
| `--color-heart` | `#C0392B` | Like/heart button |
| `--color-link` | `#9B8ECD` | Soft indigo for links |

---

## Typography

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
```

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Poem Title | `Cormorant Garamond` | 500–700 | 2rem–4rem |
| Poem Body Text | `Cormorant Garamond Italic` | 400 | 1.4rem–1.8rem |
| Poet Name / Headings | `Libre Baskerville` | 400–700 | 1.1rem–1.6rem |
| UI Labels / Nav / Meta | `Inter` | 400–600 | 0.75rem–1rem |

**Rules:**
- Poem content renders in `Cormorant Garamond italic` at minimum `1.5rem` with `2rem` line-height
- General UI (buttons, labels) uses `Inter`
- Never mix more than 3 fonts

---

## Spacing Scale (8pt grid)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## Component Patterns

### Poem Card
- Background: `--color-surface`
- Border: `1px solid --color-border` + left accent `3px solid --color-gold`
- Hover: background shifts to `--color-surface-2`, subtle upward `translateY(-2px)` lift
- Poem text: Cormorant Garamond Italic, `1.4rem`, line-height `2rem`
- Poet name: Libre Baskerville, `0.95rem`

### Sidebar
- Full height, dark bg `--color-surface`
- Gold separator lines between sections
- Active link: `--color-gold` left border highlight
- Width: `280px` desktop

### Buttons
- Primary: gold bg (`--color-gold`) + dark text, border-radius `4px`, inner shadow
- Secondary: transparent + gold border, gold text
- Hover: transition `200ms ease`

### Inputs / Textareas
- Background: transparent, border-bottom `1px solid --color-border`
- Focus: border becomes `--color-gold`, glow `0 0 0 2px rgba(201,168,76,0.2)`

---

## Animations & Transitions

- **Page enter:** `opacity 0→1` + `translateY(8px→0)` over `300ms ease-out`
- **Card hover:** `translateY(-2px)` + box-shadow over `200ms ease`
- **Button:** `background`, `color` over `150ms ease`
- **Fadein stagger:** poem cards stagger by `60ms` on home feed load
- **Respect `prefers-reduced-motion`:** Always wrap in media query

---

## Layout

- **Max container width:** `768px` (reading-optimized, like a book column)
- **Sidebar:** `280px` fixed on desktop, collapsible on mobile
- **Overall wrapper:** Sidebar + Content side-by-side via CSS Grid `280px 1fr`
- **Mobile:** Full-width, bottom tab navigation (5-item): Home, Catalog, Write, AI, Profile

---

## Icons
Use **Lucide icons** (via CDN or npm) consistently at `20px` size. No emojis.

```html
<!-- Example -->
<i data-lucide="heart" class="icon"></i>
```

---

## Mobile Bottom Nav
Items: Асосӣ (Home), Каталог, Нависед, AI, Профил
Style: fixed bottom bar, `--color-surface` bg, gold active indicator dot

---

## Pre-Delivery Checklist (from skill)
- [ ] No emojis as icons — use Lucide SVG
- [ ] `cursor-pointer` on all interactive elements
- [ ] Hover transitions `150-300ms`  
- [ ] Text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Focus states visible  
- [ ] `prefers-reduced-motion` handled  
- [ ] Responsive at `375px`, `768px`, `1024px`, `1440px`  
- [ ] Poem text minimum `1.4rem` for legibility
