# Portfolio

A personal portfolio site. Built around a narrative intro sequence and a scroll-driven 3D background, with distinct visual character in every section.

> *"Success and failure share one thing: they change you."*

---

## Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| 3D background | Three.js 0.179 (instanced mesh rendering) |
| Animation | GSAP 3.13 + ScrollTrigger |
| Die | model-viewer 4.2 (Google/Polymer) |
| Build | Vite 7 |
| Icons | Phosphor Icons |
| Fonts | Manrope (body), Cinzel (serif accents) |

---

## Intro Sequence

The site opens with a full-screen intro before the main portfolio is revealed. It plays through three acts automatically.

### Act 1 — The Quote

A split-screen layout. A silhouette figure sits on one side; on the other, a short italic quote fades in slowly and deliberately. The atmosphere is dark and quiet. After a moment the layout fades out and the die appears.

On screens under 560px the layout stacks vertically — quote on top, silhouette below.

### Act 2 — The Die

A 3D icosahedral die (D20) — dark purple-charcoal body, black face numbers — drops into frame from above, decelerating as it lands. It settles and begins slowly rotating on its own. A prompt appears below it inviting the viewer to roll.

Clicking (or pressing Space / Enter) launches the roll animation. The die bounces across the screen at high speed, ricocheting off the edges of the viewport before gradually slowing and snapping to a face. It always lands on a failure — the die is only ever rolled to faces 1–19 (face 20, the critical success, is excluded by design). The word **FAILURE** materialises beneath it in deep red with a glowing aura.

### Act 3 — The Glass

The failure fades out and a full-screen video of cracked and shattering glass takes over. A custom hammer cursor replaces the default pointer. Clicking anywhere on the glass triggers the break animation. The crack plays through and the intro dissolves away, revealing the main site beneath it.

On small screens (≤ 569px) a portrait-cropped version of the glass video plays instead of the landscape one.

### Skip intro

An X icon button is fixed to the top-right corner throughout the entire intro. Clicking it stops any in-progress audio, plays a woosh, starts the background music, and jumps to the portfolio.

---

## Main Site

### 3D Background

A continuous field of 180 floating tetrahedra fills the entire page behind the content. The scene renders in two GPU draw calls using instanced meshes — one batch for the 163 charcoal fragments, one for the 17 gold accent fragments.

**At rest** the fragments drift gently, each spinning on its own axis at a slightly different rate. A warm gold point light moves slowly with the cursor, casting shifting highlights across the metallic surfaces. Most fragments are dark charcoal; roughly one in eleven is gold.

**On scroll** the field comes alive. Each fragment follows a shared spiral path, but depth determines how far along that path it sits at any moment — close fragments lead, far fragments trail, exactly like differential rotation in a galaxy. As you scroll deeper the close fragments surge toward the camera, growing visibly larger. The orbit radius is wide enough that the nearest pieces exit the screen entirely before the page ends. Fine connective lines float in the mid-ground, adding structure to the depth.

### Hero

The opening section of the portfolio. A large typographic mark dominates the left column. Below it sits a discipline line in gold uppercase and a short personal statement in muted body text. A portrait photograph occupies the right column with a soft gold gradient overlay and a shallow gold border.

### Skills

A horizontal rule introduces a table of four skill groups — *Systems & Robotics*, *Machine Learning & AI*, *Software & Infrastructure*, and *Tools & Workflow*. Each row slides in from the left as it enters the viewport. Hovering or focusing a row shifts it right, lights its border gold, and washes it with a faint gold gradient from the left edge. No progress bars or ratings — just plain labels.

### Projects

Three tall panels stacked vertically. Each panel has a copy column on the left and an abstract visual on the right.

- The **robot** panel shows a concentric ring diagram with a single gold radial line and a glowing centre point — a stylised lidar sweep.
- The **chain reaction** panel shows a set of orbiting nodes connected by a diagonal gradient line.
- The **chat** panel shows staggered message bubble outlines with gold presence indicators.

Every panel tilts in 3D toward the cursor while the pointer is inside it (desktop/fine-pointer devices only), with a radial gold highlight that tracks cursor position. The tilt reads the flat layout bounds rather than the bent element bounds, so the hover zone stays stable. Panels without a linked repository have their link icon dimmed.

### Contact

A minimal closing section. A large heading on the left, a column of four icon-labelled links on the right. The links slide left on hover and turn gold.

| Link | Action |
|---|---|
| Resume | PDF download |
| GitHub | github.com/sudoVed |
| LinkedIn | linkedin.com/in/vedansh-somani-583a91316 |
| Email | vedansh.somani.study@gmail.com |

---

## Sound Design

All audio respects browser autoplay policy — sounds only play after the first user interaction. All audio files are preloaded into the browser cache on page load via `Audio()` objects (audio), and the 3D model and glass videos are declared in `<link rel="preload">` tags (video, GLB).

The background track pauses automatically when the tab is hidden and resumes when the tab regains focus.

| Moment | Sound |
|---|---|
| Die drop-in | — |
| Roll button click | woosh2 (launches bounce) |
| Die hitting viewport wall | impact tick (plays on every bounce, no cooldown) |
| FAILURE reveal | low failure tone |
| Hammer click / glass break | glass shatter + background music starts |
| Skip intro click | woosh + background music starts |
| Button / link hover | subtle tick |
| Sidebar nav click | woosh |
| Outbound links (GitHub, LinkedIn, Email, Resume) | woosh |
| Background music | loops through the main portfolio |

---

## Interaction Details

- **Cursor** — the cursor is always the default arrow. The only exception is during the glass act, where a hammer emoji replaces it entirely.
- **Scroll** — the 3D background responds continuously to scroll position. All content sections animate in on first entry via scroll triggers: the hero blurs in, section headings translate up, skill rows stagger in horizontally, project panels blur in, the contact block fades.
- **Keyboard** — the die can be rolled with Space or Enter. The skip button is always reachable by tab.
- **Tap highlight** — the `-webkit-tap-highlight-color` flash is suppressed globally on all interactive elements and throughout the intro sequence for consistent mobile behaviour.
- **Sidebar nav hover** — each nav dot is a `NavDot` component that drives its own hover state via `pointermove` rather than CSS `:hover`. On each pointer move it briefly clears the element's inline transform, reads the flat `getBoundingClientRect()`, then restores — so the active zone is always the dot's base size, never the scaled-up size. Same technique used by the project panels.
- **Responsive** — at 860px the multi-column layouts collapse to single-column and the sidebar nav hides. At 560px type scales down, the silhouette layout stacks vertically, and die/roll-button positions are adjusted for the smaller 160px die.
- **Reduced motion** — if the viewer has reduced motion enabled at the OS level, the intro is skipped entirely, all scroll animations are suppressed, and the 3D background is rendered at 18% opacity (static) instead of animating.

---

## Dev Tools

A `FaceMapper` component is compiled into the bundle and gated behind a `MAPPING_MODE` flag at the top of `main.jsx`. Setting it to `true` replaces the app with an interactive die inspector: drag the model to any face, click the corresponding number, and export the `FACE_POSITIONS` camera-orbit map to the clipboard. This is how the ground-truth face orientations used by the roll animation were originally calibrated.
