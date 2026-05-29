# Portfolio

A personal portfolio site built around a narrative intro sequence and a scroll-driven 3D background. Every section has a distinct visual character.

> *"Success and failure share one thing: they change you."*

---

## Intro Sequence

The site opens with a full-screen intro before the main portfolio is revealed. It plays through three acts automatically.

### Act 1 — The Quote

A split-screen layout. A silhouette figure sits on one side; on the other, a short italic quote fades in slowly and deliberately. The atmosphere is dark and quiet. After a moment the layout fades out and the die appears.

### Act 2 — The Die

A 3D icosahedral die (D20) drops into frame from above, decelerating as it lands. It settles and begins slowly rotating on its own. A prompt appears below it inviting the viewer to roll.

Clicking (or pressing Space / Enter) launches the roll animation. The die bounces across the screen at high speed, ricocheting off the edges of the viewport before gradually slowing and snapping to a face. It always lands on a failure — the number doesn't matter, the word **FAILURE** materialises beneath it in deep red with a glowing aura.

### Act 3 — The Glass

The failure fades out and a full-screen video of cracked and shattering glass takes over. A custom hammer cursor replaces the default pointer. Clicking anywhere on the glass triggers the break animation. The crack plays through and the intro dissolves away, revealing the main site beneath it.

A **Skip intro** button is present throughout — it hides off-screen but slides into view on hover or keyboard focus, letting the viewer jump straight to the portfolio.

---

## Main Site

### 3D Background

A continuous field of floating tetrahedra fills the entire page behind the content. It is always rendering, always in motion.

**At rest** the fragments drift gently, each spinning on its own axis at a slightly different rate. A warm gold point light moves slowly with the cursor, casting shifting highlights across the metallic surfaces. Most fragments are a dark charcoal; roughly one in eleven is gold.

**On scroll** the field comes alive. Each fragment follows a shared spiral path, but depth determines how far along that path it sits at any moment — close fragments lead, far fragments trail, exactly like differential rotation in a galaxy. As you scroll deeper the close fragments surge forward toward the camera, growing visibly larger as they approach. The orbit radius is wide enough that the nearest pieces exit the screen entirely before the page ends. Fine connective lines float in the mid-ground, adding structure to the depth.

### Hero

The opening section of the portfolio. A large typographic mark dominates the left column. Below it sits a discipline line in gold uppercase and a short personal statement in muted body text. A portrait photograph occupies the right column, slightly rotated, with a soft gold gradient overlay and a shallow border.

### Skills

A horizontal rule introduces a table of skill groups. Each row slides in from the left as it enters the viewport. Hovering or focusing a row shifts it right, lights its border gold, and washes it with a faint gold gradient from the left edge. No progress bars or ratings — just plain labels.

### Projects

Three tall panels stacked vertically. Each panel has a copy column on the left and an abstract visual on the right.

- The **robot** panel shows a concentric ring diagram with a single gold radial line and a glowing centre point — a stylised lidar sweep.
- The **chain reaction** panel shows a set of orbiting nodes connected by a diagonal gradient line.
- The **chat** panel shows staggered message bubble outlines with gold presence indicators.

Every panel tilts in 3D toward the cursor while the pointer is inside it, with a radial gold highlight that tracks cursor position. Panels without a linked repository have their link icon dimmed.

### Contact

A minimal closing section. A large heading on the left, a column of three icon-labelled links on the right. The links slide left on hover and turn gold.

---

## Sound Design

Every interaction has a corresponding sound. All audio respects browser autoplay policy — sounds only play after the first user interaction.

| Moment | Sound |
|---|---|
| Die drop-in | — |
| Roll button click | woosh (launches bounce) |
| Die hitting viewport wall | impact tick (no cooldown — each bounce plays) |
| FAILURE reveal | low failure tone |
| Hammer click / glass break | glass shatter + background music starts |
| Skip intro | woosh + background music starts |
| Button / link hover | subtle tick |
| Sidebar nav click | woosh |
| Outbound links (GitHub, LinkedIn, Email) | woosh |
| Background music | loops through the main portfolio |

---

## Interaction Details

- **Cursor** — the cursor is always the default arrow. The only exception is during the glass act, where a hammer emoji replaces it entirely.
- **Scroll** — the 3D background responds continuously to scroll position. All content sections animate in on first entry via scroll triggers: the hero blurs in, section headings translate up, skill rows stagger in horizontally, project panels blur in, the contact block fades.
- **Keyboard** — the die can be rolled with Space or Enter. The skip button is reachable by tab.
- **Reduced motion** — if the viewer has reduced motion enabled at the OS level, the intro is skipped entirely and all scroll animations are suppressed.
