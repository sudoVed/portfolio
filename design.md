# Portfolio Website - Full Design Document

## Concept Summary

A two-act portfolio experience. Act One is a D&D-themed cinematic intro that establishes personality, surprise, and taste. Act Two is not a fantasy UI and not a static resume page; it becomes a dark spatial workshop that presents Ved as a builder across robotics, machine learning, and full-stack systems.

The contrast is the statement: chance, transformation, and play break open into disciplined engineering craft.

---

## Design Read

Reading this as: a developer portfolio for recruiters and technical peers, with a cinematic fantasy-to-craft reveal, leaning toward a dark spatial brand surface with restrained gold accents.

The D&D theme should be strongest in the intro. After the shatter, it becomes structural and subtle: stat-block logic, dice geometry, shattered fragments, gold state changes, and inspectable systems. Act Two should feel hireable, technical, and memorable, not like a themed game menu.

---

## Act One - The Intro Sequence

### Scene 1: The Silhouette

- The page loads into near-total darkness. Background: `#0a0a0a`.
- A dark silhouette of Ved fades in slowly at center screen, slightly below vertical center. The silhouette is pure black against the dark background, barely visible at first, then resolved by a subtle rim light effect.
- Below the silhouette, a tagline types itself out letter by letter:

  > *"Success and failure share one common thing: they change you."*

- Font direction: a dramatic serif or engraved display face is acceptable here because Act One is theatrical. Keep it off-white (`#e8e4dc`) and centered.
- The typing animation should have a slightly irregular cadence, not a mechanical fixed interval.
- A beat of silence. Everything holds still for about 1.5 seconds.

### Scene 2: The D20 Appears

- The silhouette fades out gently.
- A 3D d20 model (`assets/d20.glb`) descends slowly from the top of the screen, as if being lowered by an invisible hand.
- It rotates lazily as it falls. It should not tumble yet. The first movement is deliberate and ceremonial.
- It settles at the center of the screen, gently rocking and slowly rotating.
- Text appears below the die:

  > **Roll for Perception**

- The text is smaller than the tagline, restrained, and softly inviting.
- A faint glow emanates from beneath the die. The rest of the screen remains dark.
- Include a clear skip control that is visible on keyboard focus and unobtrusive visually.

### Scene 3: The Roll

- On click, Enter, or Space, the d20 launches into a roll animation:
  - It lifts upward slightly first for anticipation.
  - It tumbles rapidly across multiple axes.
  - It slows over about 2 seconds and comes to rest.
  - It lands showing **20**.
  - A half-second pause follows.
- Then the 20 pulse is emphasized with the gold accent (`#c9a84c`).
- Text appears:

  > **CRITICAL SUCCESS**

- All caps, wide tracking, gold/amber tone. Keep it dramatic but brief.
- A single flash transitions into the shatter. Avoid repeated strobing.

### Scene 4: The Shatter

- The screen shatters as a full-viewport glass-fracture effect.
- The fracture should radiate from the die, turning the intro into irregular polygonal shards.
- Shards catch brief silver-white highlights, then fall, rotate, and disappear downward over about 0.8 seconds.
- The shatter reveals the portfolio beneath. This should feel like the intro is destroyed to expose the real work, not like a normal page transition.
- The d20 and all intro text shatter with the screen. Nothing theatrical survives into Act Two except the gold accent and a few abstract fragments.

---

## Act Two - The Portfolio

### Direction

Act Two should feel like stepping into a dark interactive engineering workspace. It is spatial, quiet, and technical. The page should suggest systems being assembled: maps, nodes, panels, signals, fragments, and depth.

The 3D layer must support comprehension. It should guide attention, create depth between sections, and respond to scroll and pointer movement without competing with the text.

### Visual Language

- **Background:** `#0d0d0d`, near-black with depth. Never use pure black for the page background.
- **Text:** `#f0ede6`, warm off-white. Never pure white.
- **Muted text:** use a lower-contrast warm gray derived from the same family, for example `#a9a39a`.
- **Accent:** `#c9a84c`, the same gold from the critical success moment.
- **Accent rule:** gold means active, selected, focused, or critical. It should not be sprinkled everywhere as decoration.
- **Surfaces:** `#151515` to `#191919`, with subtle warm or neutral borders around `#2a2a2a`.
- **Texture:** use a very subtle fixed grain/noise layer or soft radial falloff to avoid flat digital black.

### Typography

The original serif direction is useful for Act One, but Act Two should avoid looking like a generic dark editorial template.

- **Act One display:** a dramatic serif or engraved display font is acceptable.
- **Act Two display:** prefer a sharper display sans or restrained serif with less "magazine cover" baggage.
- **Body:** prefer `Geist`, `Satoshi`, `Manrope`, or another highly legible sans over default `Inter` or `DM Sans`.
- **Fallback if using Google Fonts only:** pair `Cinzel` or `Cormorant Garamond` for Act One with `Manrope` or `Geist`-like sans for Act Two.
- **Name treatment:** `VED` should feel like a mark, not a resume heading. Large, spacious, and precise.
- **Body line length:** cap paragraphs around 65-75 characters.

### Layout

- Keep the page single-route and long-scroll.
- Use generous whitespace, but avoid a pure centered-stack layout for every section.
- The hero can center the name immediately after the shatter, but subsequent content should use asymmetry and spatial layering.
- Cards are allowed for projects because they are inspectable work units. Avoid nested cards.
- Section rhythm should vary: hero as reveal, skills as stat block, projects as full-width work panels, contact as quiet endpoint.

### Motion

- All motion must have a purpose: reveal hierarchy, give feedback, support the shatter-to-portfolio transition, or connect sections spatially.
- Use scroll-triggered reveals with small offsets and opacity. Avoid bouncy or playful easing in Act Two.
- Use custom ease-out curves for UI transitions.
- Animate only `transform` and `opacity` where possible.
- Respect `prefers-reduced-motion`: skip the intro animation, disable heavy 3D camera travel, remove parallax, and use simple fades.
- On mobile, simplify motion aggressively.

---

## 3D Portfolio World

The portfolio world should not be a generic particle storm or neon grid. It should be a quiet spatial system built from the story of the page:

- Shattered fragments from the intro drift into the background and become the page's spatial material.
- Dice-like triangular/polygonal geometry becomes abstract panels, map shards, and node surfaces.
- Light behaves like an inspection lamp: subtle, warm near active content, cooler and dimmer elsewhere.
- The background can include faint map lines, node constellations, low-poly fragments, or panel outlines.

Section influence:

- **Hero:** calm central depth, soft rim light, a few drifting fragments behind the name.
- **Skills:** fragments organize into a structured node field or stat-table grid.
- **Projects:** larger 3D panels or preview objects move subtly as each project becomes active.
- **Contact:** the scene quiets down into a simple warm glow.

Implementation note: keep one fixed Three.js canvas behind the content. Use scroll progress to interpolate camera, lighting, and object groups smoothly.

---

## Interaction Principles

- Pointer movement can subtly shift light, perspective, or object rotation.
- Project cards should tilt gently toward the pointer on desktop only.
- Hover/focus states should change depth, border tone, and light, not rely on loud scaling.
- Skills should feel inspectable. Hovering or focusing a category can highlight related background nodes and dim unrelated groups.
- Keyboard focus must receive the same visual importance as hover.
- Sticky navigation can behave like a spatial minimap, but keep it small and quiet.
- Do not animate keyboard-triggered actions in a way that slows interaction.

---

## Section 1 - Hero / About

Immediately after the shatter, the first thing that resolves is:

- **Name:** `VED`, large, centered, high tracking. It should feel like a mark.
- **Discipline line:**

  > Full-Stack Developer / Robotics / Machine Learning

- **About paragraph:**

  > I consider myself someone who is driven by curiosity and desire. I enjoy trying new things, building new things, fixing small inconveniences, and finding the small fun things in life.

- Use `assets/profile.jpg` if it strengthens the composition. On desktop, it can sit offset from the text with subtle pointer-responsive light. On mobile, stack it cleanly.
- The shattered fragments from the intro should drift backward as the name resolves forward.
- The hero should feel revealed, not loaded.

---

## Section 2 - Skills

Not a tag cloud. Not a logo grid. Use a stat-block-inspired data table: a quiet nod to D&D that does not announce itself.

Suggested groupings:

**Systems & Robotics**
- ROS2, Autonomous Navigation, Sensor Fusion, Path Planning, Embedded Systems

**Machine Learning & AI**
- Reinforcement Learning, Deep Learning, PyTorch, Neural Networks, Reward Modeling

**Software & Infrastructure**
- Full-Stack Development, WebSockets, Real-Time Systems, Python, C++, JavaScript

**Tools & Workflow**
- Git, Linux, Docker, VS Code

Behavior:

- Rows fade in with subtle stagger.
- Each category is focusable or contains focusable interactive controls if it changes the scene.
- Hover/focus slightly lifts the group and highlights related background nodes.
- No progress bars. No fake percentages.

---

## Section 3 - Projects

Three project entries. Each is a full-width interactive work panel, not a generic equal-card grid.

Surface style:

- Dark surface slightly lighter than the background (`#151515` to `#191919`).
- Thin full border around `#2a2a2a`.
- On hover/focus, the border catches the gold accent and a subtle light sweep or glow appears.
- Keep corner radius restrained, around 8px or less unless the whole page adopts a different radius rule.

Each project contains:

- Project title
- One-line descriptor
- Two to three sentence description
- Tags for relevant technologies
- A link arrow or icon button
- A truthful visual area

Important visual rule: do not use fake screenshots. If real screenshots are unavailable, use abstract but truthful project visuals:

- Robot project: map lines, LIDAR arcs, route planning paths, or a robot silhouette/render.
- Chain Reaction RL: board-state visualization, orbs/cells, reward graph fragments, or self-play branching paths.
- Chat app: message topology, latency pulses, presence nodes, or synchronization diagrams.

Interaction:

- Cards tilt gently toward the pointer on desktop.
- Project visuals move on a slower parallax layer than text.
- Active card can influence the background 3D scene with a matching object or light state.
- Selection is communicated through depth, border, and lighting, not large scale changes.

### Project 1 - Autonomous Mobile Robot

A fully autonomous mobile robot built with ROS2, capable of real-time navigation, obstacle avoidance, and goal-directed movement. Integrates sensor fusion from LIDAR and camera feeds to build a live map and plan paths dynamically. Built to operate in unstructured environments without human intervention.

### Project 2 - Chain Reaction with Reinforcement Learning

A reinforcement learning agent trained to play Chain Reaction, a combinatorial strategy game, from scratch using self-play and reward shaping. Explores how RL agents develop emergent strategies in adversarial, discrete-action environments. Implemented in Python with PyTorch.

### Project 3 - Chat Application

A real-time chat application with WebSocket-based messaging, user authentication, and persistent message history. Built for low latency and clean UX. Focus on reliable state synchronization across clients.

---

## Section 4 - Contact

Minimal and quiet.

- Primary line:

  > Let's talk.

- Links:
  - GitHub: `github.com/sudoVed`
  - LinkedIn: placeholder for now
  - Optional mailto link if an email is available

Use icon links or compact text links. Off-white by default, gold on hover/focus. No contact form.

---

## Section 5 - Footer

A single muted line:

> Copyright 2026 Ved / Built with intent.

---

## Scroll Behavior

- Single long page. No separate routes.
- Section transitions are scroll-triggered, not click-navigated.
- Sticky nav appears on desktop only, top-right or right-side, with small section indicators.
- Current section indicator turns gold.
- On mobile, hide the sticky nav and use normal document flow.
- The 3D canvas responds to scroll position through camera, lighting, and object arrangement.
- Use smooth interpolation. Avoid abrupt jumps.
- Keyboard navigation must remain clear.

---

## Accessibility & Fallbacks

- Provide a visible skip intro control.
- Allow Enter and Space to trigger the d20 roll.
- Respect `prefers-reduced-motion`.
- Reduced-motion behavior should skip directly to Act Two or use a short fade.
- Do not rely on motion alone to communicate state.
- Focus states must be visible against the dark background.
- Maintain WCAG AA contrast for body text and controls.
- Canvas/WebGL content must not block reading order or keyboard navigation.
- If WebGL fails, show the portfolio content with static background styling.

---

## Assets Required

| Asset | Status |
|---|---|
| `assets/d20.glb` | Provided |
| `assets/silhouette.png` | Provided |
| `assets/profile.jpg` | Provided |
| Project screenshots / mockups | Optional |
| LinkedIn URL | Placeholder for now |
| Email address | Optional |

---

## Technical Stack (Recommended)

- **Framework:** Vite + vanilla JS. React is not necessary because this is a document-style portfolio, not an app.
- **3D / Die:** Three.js with GLTFLoader for `assets/d20.glb`.
- **3D / Portfolio:** One persistent Three.js scene behind Act Two content.
- **Scroll animation:** GSAP ScrollTrigger.
- **Shatter effect:** Custom canvas polygon-fragment animation.
- **Interactive cards:** CSS 3D transforms for panel tilt and depth.
- **Icons:** Use a real icon library if needed. Do not hand-roll social icons.
- **Fonts:** Self-host or load carefully. Avoid defaulting to `Inter` unless intentionally chosen.
- **Hosting:** GitHub Pages or Vercel.

---

## Build Success Criteria

1. Intro runs from silhouette to d20 roll to shatter using the provided assets.
2. The intro has a skip path and reduced-motion path.
3. Act Two is readable and complete without 3D or motion.
4. Desktop has polished 3D depth, pointer response, and section-linked scene changes.
5. Mobile simplifies to clean stacked sections with no heavy parallax.
6. Project visuals are truthful, not fake screenshots.
7. Navigation, contact links, keyboard focus, and responsive layout work.
8. Browser QA confirms no blank canvas, no overlapping text, no broken assets, and acceptable performance.
