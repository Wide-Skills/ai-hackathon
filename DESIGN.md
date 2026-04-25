# Meridian Design System

A professional design language stripped to its essentials. No decoration without purpose. No colour without meaning.

---

## 1. Philosophy

Four principles govern every decision in this system.

**Intention over decoration.** Every element earns its place. If it doesn't communicate something, it doesn't exist. Resist the temptation to add — the discipline is in what you remove.

**Borders, not shadows.** Depth is expressed through border opacity, not box shadows. A `1px` border at `9%` opacity says more than any drop shadow, and ages far better. Shadows are reserved for interactive focus rings only.

**Whitespace is not empty.** The warm cream background means negative space carries warmth. Large open areas feel considered, not absent. Breathing room is a design decision — treat it as one.

**Typography carries hierarchy.** Serif for presence. Sans for utility. Two voices, precisely paired, never competing. Size and weight govern hierarchy — colour alone does not.

---

## 2. Colour

The system uses five tokens. Nothing else is permitted.

| Token | Hex | Role |
|---|---|---|
| Primary | `#192840` | Brand, headings, primary actions, nav |
| Background | `#f4f3ef` | Page canvas — warm off-white, never pure white |
| Surface | `#ffffff` | Cards, panels, inputs — pure white on warm canvas |
| Ink | `#1c1b18` | Body text — warm near-black with yellow undertone |
| Border | `rgba(28,27,24,0.09)` | All structural edges — ink at 9% opacity |

### Ink opacity scale

Derived from `rgba(28,27,24, α)`. Use only these stops.

| Name | Alpha | Use |
|---|---|---|
| Ink full | `1.0` | Primary headings, labels |
| Ink muted | `0.55` | Body copy, secondary text |
| Ink faint | `0.18` | Captions, placeholders, metadata |
| Border default | `0.09` | All structural borders |
| Border emphasis | `0.13` | Hover, focused, or elevated borders |
| Border strong | `0.20` | Featured card edges, primary-tinted borders |
| Surface tint | `0.08` | Subtle tinted backgrounds — Primary at 8% alpha |

### Background scale

Three surface steps, used for section variation and component depth.

| Name | Value | Use |
|---|---|---|
| `--bg` | `#f4f3ef` | Page background |
| `--bg2` | `#eeedea` | Hover states, active pills |
| `--bg3` | `#e7e6e2` | Deepest surface — level 0 depth cards |

### Semantic colour

Used only where status demands it. Not for decoration.

| Status | Background | Text |
|---|---|---|
| Active / Info | `rgba(25,40,64,0.08)` | `#192840` |
| Success | `#eaf5f0` | `#1a7055` |
| Warning | `#faf3e8` | `#8a6020` |
| Error | `#fdf0f0` | `#8a2020` |

### Rules

- Never introduce a colour outside this token set without system-wide justification.
- Never use colour as the sole differentiator between interactive states — pair with border weight or opacity.
- Coloured badges use a tinted background and the darkest shade of that same family for text. Never black on a coloured background.

---

## 3. Typography

Two typefaces. Three voices. One register.

| Voice | Typeface | Fallbacks |
|---|---|---|
| Serif (display) | Instrument Serif | Georgia, ui-serif, Times New Roman |
| Sans (UI + body) | Geist | system-ui, -apple-system, Helvetica Neue, Arial |
| Mono (code) | Geist Mono | ui-monospace, SFMono-Regular, Menlo, Courier New |

### Type scale

| Role | Face | Size | Weight | Line height | Tracking | Colour |
|---|---|---|---|---|---|---|
| Display | Instrument Serif | 52px | 400 | 1.06 | −0.8px | Primary `#192840` |
| Heading | Instrument Serif | 32px | 400 | 1.14 | −0.4px | Primary `#192840` |
| Section title | Instrument Serif | 22px | 400 | 1.22 | −0.2px | Primary `#192840` |
| UI label | Geist | 16px | 500 | 1.4 | −0.02em | Ink full |
| Body | Geist | 14–15.5px | 300 | 1.68–1.72 | −0.01em | Ink muted |
| Caption | Geist | 12px | 400 | 1.5 | −0.01em | Ink faint |
| Eyebrow | Geist | 11px | 500 | 1.5 | +0.06em | Ink faint — uppercase |
| Mono inline | Geist Mono | 12px | 400 | 1.5 | +0.01em | Primary, surface tint bg |

### Principles

- **Italic serif for emphasis.** Instrument Serif's italic swashes add editorial presence without disrupting flow. Use for secondary phrases in hero headings only — `<em>clarity</em>`, never for body emphasis.
- **Weight 300 for body.** At 14–15px, weight 300 reads lighter and more refined than 400. Reserve 400 for UI labels and captions. Reserve 500 for navigation links and button labels only.
- **Letter-spacing decreases as size increases.** Display headings use negative tracking (−0.8px at 52px). Body text uses −0.01em. Eyebrow labels use +0.06em. Never apply positive tracking to headings.
- **Antialiasing.** Always set `-webkit-font-smoothing: antialiased` on the root element.
- **Line length.** Body copy maximum 65 characters (approximately `420px` at 14px). Never let prose run full width.

---

## 4. Spacing

An 8px base system with micro-increments for component-level precision.

| Step | Value | Use |
|---|---|---|
| Micro | 4px | Icon-to-label gaps, badge internal padding |
| Small | 8px | Inline gaps, tight component padding |
| Base | 12px | Default gap between related elements |
| Medium | 16px | Internal component padding |
| Comfortable | 20–24px | Card internal padding |
| Section gap | 36–40px | Between heading and content |
| Section padding | 52–64px | Section vertical rhythm |
| Hero | 80–96px | Top of page breathing room |

Use `rem` for vertical rhythm between sections. Use `px` for all component-internal gaps.

---

## 5. Border & Radius

### Border system

All borders derive from the single ink token at varying opacity. No hex border colours.

| Context | Value |
|---|---|
| Default structural border | `1px solid rgba(28,27,24,0.09)` |
| Hover / focused | `1px solid rgba(28,27,24,0.13)` |
| Elevated / featured | `1.5px solid rgba(25,40,64,0.20)` |
| Divider (hr) | `1px solid rgba(28,27,24,0.09)` |
| Active input | `1px solid rgba(28,27,24,0.18)` |

Never use `border-bottom` or `border-top` alone with rounded corners — round corners only apply when all four sides have a border.

### Radius scale

| Name | Value | Use |
|---|---|---|
| Micro | 4px | Badges, inline code, mono tags, small pills |
| Standard | 6–7px | Buttons, inputs, navigation elements |
| Card | 12px | All card containers and panel groups |
| Full pill | 9999px | Filter pills, status tags |

---

## 6. Elevation

Depth is achieved through border opacity alone. No box shadows on layout elements.

| Level | Treatment | Use |
|---|---|---|
| 0 — Surface | Background `#e7e6e2`, no border | Sits in the page plane — section backgrounds |
| 1 — Raised | White bg + `1px / 9%` border | Standard card, table, or panel |
| 2 — Elevated | White bg + `1px / 13%` border | Hover state or focused card |
| 3 — Featured | White bg + `1.5px / 20%` primary-tinted border | Highlighted item, active selection |

**Focus rings only.** The single exception where a shadow is permitted: `box-shadow: 0 0 0 3px rgba(25,40,64,0.12)` on focused interactive elements.

---

## 7. Components

### Navigation

```
height: 52px
padding: 0 40px
background: rgba(244,243,239,0.92)  /* with backdrop-filter: blur */
border-bottom: 1px solid rgba(28,27,24,0.09)
```

- Logo: Geist 500, 15px, `−0.3px` tracking, Primary colour. Paired with a 18×18px brand mark.
- Links: Geist 400, 13px, Ink muted. Transition to Ink full on hover. No underlines.
- Right slot: ghost button + solid button, never more than two actions.

### Buttons

**Primary**
```
background: #192840
color: #ffffff
font: Geist 500, 13px
padding: 9px 20px
border-radius: 7px
letter-spacing: −0.01em
hover: background #243858, translateY(−1px)
```

**Secondary / Ghost**
```
background: transparent
color: rgba(28,27,24,0.55)
border: 1px solid rgba(28,27,24,0.09)
font: Geist 400, 13px
padding: 9px 16px
border-radius: 7px
hover: border-color rgba(28,27,24,0.18), color ink full
```

Never use more than two button variants in a single context.

### Cards

Cards use white (`#ffffff`) on the warm cream background (`#f4f3ef`). This contrast is the system's only depth mechanism — do not supplement with shadows.

**Standard card group** — cards share a single container perimeter using the `gap: 1px; background: border-colour` technique pioneered by Linear. Individual card borders are not used.

```
Container:
  border: 1px solid rgba(28,27,24,0.09)
  border-radius: 12px
  overflow: hidden
  background: rgba(28,27,24,0.09)   /* gap colour */
  display: grid
  gap: 1px

Each card:
  background: #ffffff
  padding: 28px 24px 24px
  hover: background #fdfcfa
```

**Card anatomy**
- Index label: Geist Mono, 11px, Ink faint — top of card, uppercase `01 / 02 / 03`
- Title: Instrument Serif, 20px, weight 400, Primary
- Body: Geist 300, 13px, Ink muted, line-height 1.68
- Link: Geist 500, 12.5px, Primary at 70% opacity — hover to 100%, arrow shifts 2px right

### Feature list rows

Full-width rows with hairline separators. Used for principles, features, changelog entries.

```
border: 1px solid rgba(28,27,24,0.09)
border-radius: 12px
overflow: hidden

Each row:
  display: flex
  padding: 22px 24px
  border-bottom: 1px solid rgba(28,27,24,0.09)
  background: #ffffff
  hover: background #fdfcfa

  Index:  Geist Mono, 11px, Ink faint, width 16px, flex-shrink 0
  Title:  Geist 500, 14px, Ink full, −0.02em tracking
  Body:   Geist 300, 13px, Ink muted, line-height 1.6
  Tag:    inline badge, surface tint background, Primary text
```

### Inputs

```
background: #f4f3ef  (matches page bg — sits in the plane)
border: 1px solid rgba(28,27,24,0.09)
border-radius: 7px
padding: 8px 12px
font: Geist 400, 13px
color: #1c1b18
placeholder: rgba(28,27,24,0.18)

focus:
  border-color: rgba(28,27,24,0.18)
  background: #ffffff
```

### Badges / status tags

```
font: Geist 500, 11px
padding: 3px 8px
border-radius: 4px
letter-spacing: 0.01em
```

Use only the four semantic states defined in the Colour section. Primary tint for active/info, semantic colours for success/warning/error. Never use arbitrary colours.

### Filter pills

```
border: 1px solid rgba(28,27,24,0.09)
border-radius: 9999px
padding: 4px 12px
font: Geist 400, 12px
color: Ink muted
background: transparent

active / hover:
  border-color: rgba(28,27,24,0.18)
  color: Ink full
  background: #eeedea
```

### Palette strip

Colour swatches use a shared container with `1px` internal dividers — the same flush technique as cards. Individual swatch borders are not used.

```
display: flex
gap: 1px
background: rgba(28,27,24,0.09)
border: 1px solid rgba(28,27,24,0.09)
border-radius: 8px
overflow: hidden

Each swatch colour block: height 52px
Each swatch label block:
  padding: 9px 10px
  background: #ffffff
  border-top: 1px solid rgba(28,27,24,0.09)

Name: Geist 500, 11px, Ink full
Hex:  Geist Mono, 10px, Ink muted
```

---

## 8. Layout

### Container

```
max-width: 760px
margin: 0 auto
padding: 0 40px
```

### Section rhythm

```
Section padding:     64px top and bottom
Section header gap:  36px below header before content
Divider (hr):        Full bleed — extends to page edges, not container
```

Sections are separated by full-width `hr` dividers (`1px solid rgba(28,27,24,0.09)`). No coloured section backgrounds. Section variation comes from spacing alone.

### Grid system

Three-column card grids use `repeat(3, minmax(0, 1fr))` — the `minmax(0, 1fr)` is critical to prevent content overflow. Two-column component grids follow the same pattern.

Never use percentage-based widths for card content. Always use `minmax(0, 1fr)` in grid contexts.

### Hero

```
padding: 96px 40px 80px
max-width: 760px, centred
text-align: left
```

Hero text aligns left, not centred. Centred hero type reads as marketing; left-aligned reads as editorial authority.

---

## 9. Section eyebrow labels

Every section opens with an uppercase eyebrow label above the section title.

```
font: Geist 500, 11px
letter-spacing: 0.06em
text-transform: uppercase
color: rgba(28,27,24,0.18)
margin-bottom: 8px
```

Eyebrows are purely navigational — they tell the reader where they are, not what to feel. Keep them to one or two words: `Colour`, `Typography`, `Elevation`, `Principles`. Never use eyebrows as marketing headlines.

---

## 10. Footer

The footer uses Primary (`#192840`) as its sole background. All text is white at reduced opacity.

```
background: #192840
padding: 40px
display: flex, space-between

Logo:    Geist 500, 14px, rgba(255,255,255,0.9)
Version: Geist 300, 12px, rgba(255,255,255,0.35)
Links:   Geist 400, 12px, rgba(255,255,255,0.35) → 0.65 on hover
```

The footer contains only: logo + version slug on the left, plain text links on the right. No call-to-action. No decoration.

---

## 11. Motion

All transitions are fast and functional. Animation is not decoration.

| Property | Duration | Easing | Use |
|---|---|---|---|
| `color` | 100ms | ease | Text colour on hover |
| `border-color` | 100ms | ease | Border state changes |
| `background` | 120–140ms | ease | Surface colour on hover |
| `opacity` | 100ms | ease | Fades, button hover |
| `transform` | 80ms | ease | Button translateY(−1px) on hover |
| Arrow shift | 100ms | ease | Card link arrow on parent hover |

No entrance animations. No scroll-triggered reveals. No decorative motion. Page loads are instant — trust the typography to hold attention.

---

## 12. Quick token reference

For use in any component prompt or implementation.

```css
--bg:           #f4f3ef;
--bg2:          #eeedea;
--bg3:          #e7e6e2;
--surface:      #ffffff;
--ink:          #1c1b18;
--muted:        rgba(28,27,24,.55);
--faint:        rgba(28,27,24,.18);
--line:         rgba(28,27,24,.09);
--P:            #192840;
--Pa:           rgba(25,40,64,.08);
--Pm:           #243858;

--serif:        'Instrument Serif', Georgia, ui-serif, serif;
--sans:         'Geist', system-ui, -apple-system, sans-serif;
--mono:         'Geist Mono', ui-monospace, monospace;

--r4:           4px;
--r7:           7px;
--r12:          12px;
--rpill:        9999px;
```

### Component prompt template

```
Surface: white (#ffffff) on warm cream (#f4f3ef) background.
Border: 1px solid rgba(28,27,24,0.09) — all structural edges.
Card: 12px radius, white bg, border at 9% ink. Hover: border to 13%.
Heading: Instrument Serif, 20px, weight 400, #192840, −0.2px tracking.
Body: Geist, 13px, weight 300, rgba(28,27,24,.55), line-height 1.68.
Label: Geist Mono, 11px, rgba(28,27,24,.18), uppercase.
Button primary: bg #192840, white text, Geist 500 13px, 9px/20px padding, 7px radius.
Button ghost: transparent, 1px border at 9% ink, Geist 400 13px.
Input: bg #f4f3ef, 1px/9% border, 7px radius. Focus: bg white, border to 18%.
Badge: Geist 500, 11px, 3px/8px padding, 4px radius. Semantic tinted bg only.
Pill: transparent bg, 1px/9% border, 9999px radius. Active: bg #eeedea, border to 18%.
Transition: color/border 100ms ease, background 120ms ease.
No box shadows. No gradients. No decorative colour.
```
