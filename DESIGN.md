---
name: Abhishek Singh
description: AI systems engineer, Prague. Measured results counted out as pictorial statistics.
colors:
  paper: "#ffffff"
  ink: "#141414"
  ink-2: "#3d4046"
  blue: "#2c5da8"
  blue-deep: "#23498a"
  red: "#c8352a"
  ochre: "#b97c14"
  green: "#2f7d47"
  slot: "#e4e7ec"
  rule: "#c9ced6"
typography:
  display:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "clamp(2.75rem, 1.1rem + 6vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "clamp(3rem, 1.8rem + 4.6vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "clamp(1.875rem, 1.3rem + 2.2vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.005em"
  lede:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
  figure:
    fontFamily: "Jost, Futura, Century Gothic, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  none: "0"
spacing:
  gutter: "clamp(1.25rem, 0.5rem + 3.5vw, 4rem)"
  section: "clamp(5rem, 3rem + 6vw, 9rem)"
  measure: "78rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "1.1rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
  button-small:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.6rem 1rem"
  button-small-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-on-blue:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.1rem 1.75rem"
  button-on-blue-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
  toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.9rem"
  toggle-hover:
    backgroundColor: "{colors.slot}"
  toggle-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0.35rem 0"
---

# Design System: Abhishek Singh

## Overview

**Creative North Star: "The Vienna Method"**

The site is a sheet of pictorial statistics in the Isotype tradition. Results are counted out, not described: each figure is a row of identical flat pictograms where one symbol is one fixed unit, grouped in fives, labelled at the left, totalled at the right, and keyed underneath ("Each clock is 10 minutes"). A visitor can read the work at a glance and check the arithmetic if they care to.

The material is print: white ground, near-black ink, and a small set of flat Isotype colours that carry meaning (blue for the baseline, red for the result and the action). Structure comes from heavy ink rules and caps headings in one geometric sans (Jost, Futura lineage), not from boxes, cards, shadows or rounded corners. Density is low and scale contrast is high: very large caps headlines over small tracked caps labels, with long-form detail folded into drawers.

Honesty is visual too. Indexed figures are labelled as indexed in the key line, half units are drawn as half symbols, and nothing is decorated that is not counting something.

**Key Characteristics:**
- One symbol = one fixed unit; every chart has a key line naming the unit.
- Flat filled pictogram silhouettes with paper knock-outs, from one inline sprite.
- Blue = before/baseline, red = after/result/action; ochre and green are further categories only.
- One family (Jost, variable 100-900), caps for headings and labels.
- Ink rules (6/3/2/1px) as the only framing device; zero radius, zero shadow, zero gradient.

## Colors

A white sheet, black ink and four flat Isotype inks, each with a job.

### Primary
- **Isotype Red** (red): the result, the "after" row, the highlighted total, and every hiring action (header "Hire me", button hovers, focus outline, text selection, list markers, the "Fix." lead-in).
- **Isotype Blue** (blue): the baseline, the "before" row, lit squares in the indexed grid, pipeline strip, and the full-bleed contact block ground.

### Secondary
- **Deep Blue** (blue-deep): small caps metadata text only (year and status line, drawer subheads, table captions), where the brighter blue would be too light for text at label size.

### Tertiary
- **Ochre** (ochre) and **Signal Green** (green): extra categories in a multi-category chart (for example "other" photos). They carry no before/after meaning.

### Neutral
- **Paper** (paper): page ground, button text on ink, knock-outs inside pictograms.
- **Ink** (ink): text, headings, rules, primary button, footer ground.
- **Soft Ink** (ink-2): secondary prose, ledes, key lines, notes.
- **Slot Grey** (slot): unlit cells of the indexed grid, toggle hover, scrollbar track.
- **Rule Grey** (rule): hairline row dividers in tables, kit and method lists.

### Named Rules
**The Blue Before, Red After Rule.** In any comparison the baseline is blue and the result is red. Red is never used for a baseline, and blue is never used for a call to action.

**The Flat Ink Rule.** Colours are solid fills. No gradients, tints-as-decoration, glows or transparency effects.

## Typography

**Display Font:** Jost (self-hosted variable woff2, with Futura, Century Gothic, sans-serif)
**Body Font:** Jost, same file
**Label/Mono Font:** Jost in tracked caps; numbers use lining figures, tabular in totals and tables.

**Character:** A single geometric sans in the Futura lineage, as on Isotype charts: caps and semibold for anything that names, lowercase regular for anything that explains.

### Hierarchy
- **Display** (600, clamp 2.75-6rem, 0.94, caps, max 17ch): the hero headline only.
- **Headline** (600, clamp 3-6rem, 0.9, caps): section heads (Work, Method, Kit) and the contact headline, each sitting under a 6px ink rule.
- **Title** (600, clamp 1.875-3.25rem, 1.02, caps): system names; principle heads use a smaller caps step (clamp 1.375-2rem).
- **Lede** (400, clamp 1.25-1.5rem, 1.4, max 44ch): sublines and the hero facts.
- **Body** (400, clamp 1.0625-1.1875rem, 1.55, 52-70ch): explanation and drawer prose.
- **Label** (500-600, 0.875rem, 0.08em tracking, caps): nav, chart titles, row labels, table heads, buttons, footer.
- **Figure** (600, 1.25-2.5rem, tabular): row totals, grid readout, pipeline step values.

### Named Rules
**The One Family Rule.** Jost is the only face. Hierarchy comes from size, weight and case, never from a second family.

**The Caps Name, Lowercase Explains Rule.** Headings, labels and buttons are uppercase and tracked; sentences are sentence case.

## Layout

Full-bleed sections with a centred measure: horizontal padding is `max(gutter, (100% - 78rem) / 2)`, so rules and coloured grounds run edge to edge while content holds the measure. Sections are separated by the fluid section space and opened by a 6px ink rule above the heading.

Charts are grids: a label column (7-11rem), the pictogram run, and a right-aligned total. Pictograms are grouped in fives by an extra gap so a row reads without counting; the indexed 10x10 grid is split into quarters of 25 the same way. Smaller system charts flow in an auto-fit grid (min 30rem columns); the hero chart spans the full measure.

Sizing is fluid via `clamp()`. One width breakpoint exists (46rem): the nav wraps onto its own row, chart rows restack to label + total above the pictogram run, the contact block becomes a single column, and kit rows stack.

## Elevation & Depth

The system is flat. There are no shadows anywhere. Depth is replaced by ink weight and by grounds: the sticky masthead is a paper strip closed by a 3px ink rule, the contact block is a full-bleed blue ground, and the footer is an ink ground.

### Named Rules
**The Printed Sheet Rule.** Nothing floats. Separation comes from rules and solid grounds, never from shadow, blur or lift.

## Shapes

Every corner is square (radius 0). The recurring form is the rule, in a fixed weight ladder: 6px ink above section heads, 3px ink under the masthead and above chart titles, 2px ink around drawers, toggles and kit lists, 1px rule grey between rows. Pictograms are flat filled silhouettes on a 48-unit grid with paper knock-outs for detail; a half unit is the left half of the symbol (clipped). The pipeline strip uses a solid triangular arrowhead between steps; the portrait is a hard-edged 4:5 crop in greyscale.

### Named Rules
**The Ruled, Not Boxed Rule.** Content groups are opened and closed by horizontal rules. The only enclosed shape is the segmented toggle, a single 2px ink frame divided by 2px ink lines.

## Components

### Buttons
Solid blocks of colour that turn red on hover.
- **Shape:** square (0).
- **Primary:** ink block, paper text, semibold tracked caps, 1.1rem x 1.75rem at clamp 1.125-1.5rem; carries a pictogram arrow that slides 0.25em right on hover.
- **Small (header Hire me):** red block, paper label text, 0.6rem x 1rem; hover inverts to ink.
- **On blue ground:** paper block, ink text, sentence case (shows the email address); hover goes red.
- **Hover / Focus:** background and colour transition 180ms on the shared ease; focus is the global 3px red outline at 3px offset (paper on blue ground); active nudges 1px down.

### Segmented toggle
- **Style:** one 2px ink frame, buttons divided by 2px ink lines, paper ground, label type.
- **State:** hover slot grey; pressed (`aria-pressed`) is solid ink with paper text. Switching recounts the grid.

### Navigation
- **Style:** sticky paper masthead with a 3px ink bottom rule; name left in semibold tracked caps, label-size caps links right, then the small red button.
- **Hover:** a 3px red underline appears (border, 200ms).
- **Mobile:** links wrap to a full-width second row, spaced between.

### Isotype chart (signature)
- Chart title in label caps under a 3px ink rule; rows of label, pictogram run, total; key line in small soft ink below.
- Pictograms take blue, red, ochre, green or ink fills from the sprite; grouped in fives.
- The result total is red; others are ink.
- **Motion:** when a chart enters view each symbol counts in (opacity and 0.4rem rise from 0.7 scale, 480-520ms, staggered 40-120ms per symbol on `cubic-bezier(0.16, 1, 0.3, 1)`). Disabled under reduced motion; symbols are visible by default.

### Indexed grid
- 10x10 squares, 4px gaps, quarters offset by 6px; unlit slot grey, lit blue, highlighted red; cells change colour with a 5ms per-cell stagger. Large tabular readout below.

### Pipeline strip
- Numbered steps across, each under a 2px blue top rule with a blue arrowhead between steps; values in large blue figures; the final/result step switches to red.

### Drawer
- Native disclosure between 2px ink rules; caps summary with a plus pictogram that rotates 45 degrees when open; summary hover turns red. Body holds prose, red-marker lists, "Fix." lines and ruled data tables.

### Contact block
- Full-bleed blue ground, paper text, greyscale 4:5 portrait left, headline-size caps question, paper button, underlined caps links.

## Do's and Don'ts

### Do:
- **Do** draw every number as identical pictograms where one symbol is one stated unit, and write the unit in a key line under the chart.
- **Do** colour the baseline blue and the result red, and keep red for the result and the hiring action.
- **Do** group pictograms in fives and draw fractional units as a clipped half symbol.
- **Do** label indexed or estimated figures as such in the key line.
- **Do** separate sections with the 6px ink rule and group content with the rule ladder (6/3/2/1px).
- **Do** add new pictograms to the inline sprite as flat filled 48x48 silhouettes with paper knock-outs.
- **Do** keep the count-in motion opt-in to `prefers-reduced-motion: no-preference`, with symbols visible by default.

### Don't:
- **Don't** add rounded corners, drop shadows, gradients or glows to any element.
- **Don't** put content in cards or boxed tiles; the segmented toggle is the only framed control.
- **Don't** draw pictograms as outline strokes or mix in icon-font or emoji glyphs.
- **Don't** introduce a second typeface.
- **Don't** use ochre or green to mean before/after; they are categories only.
- **Don't** scale a single pictogram to show a bigger number; show more symbols.
