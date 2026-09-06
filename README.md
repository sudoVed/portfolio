# Portfolio

A personal portfolio site. Built around a narrative intro sequence and a scroll-driven 3D background, with distinct visual character in every section.

## Run locally

```sh
npm ci
npm run dev
```

The portfolio is at `/`; the standalone contact card is at `/connect` on the same server. To check the production output:

```sh
npm run build
npm run preview
```

## Source layout

| Path | Purpose |
|---|---|
| `src/components/Portfolio.jsx` | Main portfolio sections |
| `src/components/NavDot.jsx` | Four section-scroll buttons with whoosh feedback; no URL hashes |
| `src/components/voxel-connect/` | The main page's gold V ↔ QR section: React controls, Three.js renderer, voxel mapping, styles, QR data, and geometry checks |
| `connect.html` | The separate `/connect` contact page; no JavaScript required |
| `connect/connect.css` | Contact page styles |
| `public/assets/qr.svg`, `qr.png` | Supplied QR artwork encoding `https://vhades.dpdns.org/connect` |
| `public/assets/vedansh-somani.vcf` | Downloadable contact card |
| `public/assets/resume.pdf` | Resume downloaded from the contact page |
| `dist/` | Generated deployment output, excluded from Git |
| `wrangler.jsonc` | Cloudflare Worker `portfolio`, serving static files from `dist` |

`src/components/voxel-connect/` is source code for one portfolio section, not a website route. It is bundled by Vite; visitors do not navigate to that directory. Implementation notes and checks are in [its README](src/components/voxel-connect/README.md).

## Deploy to Cloudflare

### Cloudflare Workers (current hosting)

The repository includes `wrangler.jsonc` for the existing Worker named `portfolio`. It publishes `dist` as static assets. Wrangler is pinned in `package-lock.json` so deployments use the checked version.

In **Workers & Pages → portfolio → Settings → Builds**, use:

| Setting | Value |
|---|---|
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` (or `npm run deploy`) |
| Production branch | The branch connected to this Worker |

Commit and push the changes, including `wrangler.jsonc` and `package-lock.json`, to that branch. The next build deploys the portfolio and contact page together. There is no separate `/connect` upload or DNS record to add. The existing custom domain must remain attached to this Worker.

The build emits `dist/index.html` and `dist/connect.html`. The configured `auto-trailing-slash` HTML handling serves `connect.html` at `/connect`. See [Workers HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).

If the build succeeds but deploy reports `Error parsing file: .../vite.config.js`, check that `wrangler.jsonc` is committed at the configured root. Without it, Wrangler enters [automatic framework configuration](https://developers.cloudflare.com/workers/framework-guides/automatic-configuration/); this site already builds with Vite and only needs its output uploaded.

To validate the deployment package locally without uploading it:

```sh
npm run build
npx wrangler deploy --dry-run
npx wrangler dev --local
```

Open the local address printed by Wrangler and check `/`, `/connect`, and both downloads. For a manual production deployment after building, run `npm run deploy` using a Cloudflare login authorized for the existing Worker.

### Cloudflare Pages (alternative hosting)

Use the existing Pages project connected to this repository:

| Setting | Value |
|---|---|
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | The branch configured in your Pages project |

Commit the new source files, contact page, QR assets, contact card, and any intended resume update along with the existing file changes. Push to the configured production branch; with automatic deployments enabled, Pages builds and publishes both pages together. If using Direct Upload instead, build locally and upload the complete `dist` directory to the existing project. Do not upload only `index.html` or the raw `src` directory.

The build emits `dist/index.html` and `dist/connect.html`. Cloudflare Pages automatically serves the latter at `/connect`; no separate project, subdomain, DNS record, or custom rewrite is needed with the default Pages setup. This is Cloudflare's documented [HTML route matching](https://developers.cloudflare.com/pages/configuration/serving-pages/). Build settings are documented [here](https://developers.cloudflare.com/pages/configuration/build-configuration/).

The QR click target is the root-relative path `/connect`. On localhost it opens the local contact page; on `https://vhades.dpdns.org` it opens `https://vhades.dpdns.org/connect`. The QR image itself always encodes that live URL, including when scanned from a local preview.

After deployment, open `/connect` directly and refresh it, check Save Contact and Resume downloads, and check that the fourth dot scrolls to the V/QR section while the URL stays on `/`. Custom Pages Functions or redirect rules that intercept `/connect` must allow the contact asset through. This repository does not contain the account's dashboard settings, so those settings have not been inspected.

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

The site opens with a full-screen intro before the main portfolio is revealed. It plays through two acts.

### Act 1 — The Die

A 3D icosahedral die (D20) — dark purple-charcoal body, black face numbers — drops into frame from above, decelerating as it lands. It settles and begins slowly rotating on its own. A prompt appears below it: **Roll for Perception**.

Clicking (or pressing Space / Enter) launches the roll. The die briefly winds up in reverse, then launches into a bounce animation — ricocheting off the edges of the viewport at high speed before gradually slowing and snapping to a face. The roll is checked against DC 17.

**On failure (roll 2–16):** The rolled number appears above the word **FAILURE** in deep red with a glowing aura. After a short pause the glass act begins.

**On success (roll 17–19):** The rolled number appears above the word **Success** in gold. Background music starts and the intro dissolves into the portfolio.

**On critical success (roll 20):** Same as success, but the label reads **Critical Success**.

Face 1 is never rolled by design.

### Act 2 — The Glass

Triggered only on a failed roll. The failure fades out and a full-screen video of cracked and shattering glass takes over. A custom hammer cursor replaces the default pointer. Clicking anywhere on the glass triggers the break animation. The crack plays through and the intro dissolves away, revealing the main site beneath it.

On small screens (≤ 569px) a portrait-cropped version of the glass video plays instead of the landscape one.

### Skip intro

A pill button fixed to the top-right corner throughout the entire intro — a FastForward icon (▶▶) followed by the label "Portfolio". Clicking it stops any in-progress audio, plays a woosh, starts the background music, and jumps to the portfolio.

---

## Main Site

### 3D Background

A continuous field of 180 floating tetrahedra fills the entire page behind the content. The scene renders in two GPU draw calls using instanced meshes — one batch for the 154 charcoal fragments, one for the 26 gold accent fragments.

**At rest** the fragments drift gently, each spinning on its own axis at a slightly different rate. A warm gold point light moves slowly with the cursor, casting shifting highlights across the metallic surfaces. Most fragments are dark charcoal; roughly one in eleven is gold.

**On scroll** the field comes alive. Each fragment follows a shared spiral path, but depth determines how far along that path it sits at any moment — close fragments lead, far fragments trail, exactly like differential rotation in a galaxy. As you scroll deeper the close fragments surge toward the camera, growing visibly larger. The orbit radius is wide enough that the nearest pieces exit the screen entirely before the page ends. Fine connective lines float in the mid-ground, adding structure to the depth.

### Hero

The opening section of the portfolio. A large typographic mark dominates the left column. Below it sits a discipline line in gold uppercase and a short personal statement in muted body text. A portrait photograph occupies the right column with a soft gold gradient overlay and a shallow gold border.

### Skills

A horizontal rule introduces a table of five skill groups — *Robotics & Autonomous Systems*, *AI & Machine Learning*, *Computer Vision*, *Software Development*, and *Tools & Infrastructure*. Each row slides in from the left as it enters the viewport. Hovering or focusing a row shifts it right, lights its border gold, and washes it with a faint gold gradient from the left edge. No progress bars or ratings — just plain labels.

### Projects

Project panels stacked vertically. Each panel has a copy column on the left and a project screenshot on the right. The screenshot is contained at its natural aspect ratio, centered in a grid-patterned well — it scales down to fit the panel at any viewport width without ever stretching.

Every panel tilts in 3D toward the cursor while the pointer is inside it (desktop/fine-pointer devices only), with a radial gold highlight that tracks cursor position. The tilt reads the flat layout bounds rather than the bent element bounds, so the hover zone stays stable. Panels without a linked repository have their link icon dimmed.

### Contact

A full-viewport closing section with a rotating gold voxel V. CONNECT rearranges the same cubes into the supplied QR; BACK reverses the transformation. The settled QR is stable for scanning and links to `/connect` when tapped. The canvas is transparent so it blends into the section's dark background without a tinted rectangle. Rendering pauses off-screen, and reduced motion skips the movement.

### Standalone contact page

`/connect` is a separate, mobile-first HTML page with no portfolio scripts, intro, audio, or WebGL. It contains the identity and six immediate actions:

| Action | Destination |
|---|---|
| Save Contact | vCard with name, email, portfolio, LinkedIn, and GitHub |
| LinkedIn | Existing LinkedIn profile, in a new tab |
| GitHub | Existing GitHub profile, in a new tab |
| Resume | Download the existing PDF |
| Portfolio | Main homepage |
| Email | Existing mailto address |

Vite builds both `index.html` and `connect.html`. Both the development server and production preview resolve `/connect`; Cloudflare deployment is covered above. Contact-card details are in `public/assets/vedansh-somani.vcf`; the resume remains `public/assets/resume.pdf`. Visitors can open the downloaded `.vcf` in a contacts app to save the name, email, portfolio, and social links. Social links are also stored in the card's notes for apps that do not display social-profile fields.

---

## Sound Design

All audio respects browser autoplay policy — sounds only play after the first user interaction. Audio bytes are prefetched with `fetch()` on page load and decoded through Web Audio when needed. The glass video is preloaded by mounting a hidden `<video preload="auto">` element at the very start of the intro, giving the browser the full duration of the die-roll sequence (~5 s) to buffer it before it is needed.

The shared audio context pauses when the tab is hidden **or the browser window loses focus** (including switching to another app). It resumes from the same track position only when the page is visible and focused. Loading audio cannot wake an unfocused page; new sound effects are discarded while unfocused. Stopping a pending background start cancels it, preventing an old load from starting another track.

Run `npm run test:audio` for the focus, visibility, and asynchronous-loading regression checks. To check in a browser, start the music, switch tabs, switch to another application while the page remains visible, and return. Music should pause in both cases and resume at the same position.

| Moment | Sound |
|---|---|
| Roll button click | woosh2 (launches bounce) |
| Die hitting viewport wall | impact tick (plays on every bounce, no cooldown) |
| FAILURE reveal | low failure tone |
| Success / Critical Success reveal | success tone + background music starts |
| Hammer click / glass break | glass shatter + background music starts |
| Skip intro click | woosh + background music starts |
| Button / link hover | subtle tick |
| Sidebar nav click | woosh |
| Outbound links (GitHub, LinkedIn, Email, Resume) | woosh |
| Background music | loops through the main portfolio |

---

## Interaction Details

- **Cursor** — the cursor is always the default arrow. The only exception is during the glass act, where a hammer emoji replaces it entirely.
- **Scroll** — the 3D background responds continuously to scroll position. The hero blurs in, section headings translate up, skill rows stagger in horizontally, and project panels blur in. The closing voxel section starts rendering when visible. Each main section occupies at least one full viewport height.
- **Keyboard** — the die can be rolled with Space or Enter. The skip button is always reachable by tab.
- **Tap highlight** — the `-webkit-tap-highlight-color` flash is suppressed globally on all interactive elements and throughout the intro sequence for consistent mobile behaviour.
- **Sidebar nav** — four buttons fixed to the right edge. They scroll to About, Skills, Projects, and the closing V/QR section without adding `#projects` or other fragments to the URL or adding browser-history entries. A pre-existing fragment is removed when a dot is used; the pathname and query parameters are preserved. Scrolling respects reduced motion. Tapping the assembled QR opens `/connect`. Dots retain their hover highlight, keyboard focus, and whoosh sound. The `NavDot` component drives hover via `pointermove`, briefly clearing its transform to read flat layout bounds so the hit zone stays the dot's base size regardless of scale.
- **Responsive** — at 860px the multi-column layouts collapse to single-column and the sidebar nav hides. At 560px type scales down and die/roll-button positions are adjusted for the smaller 160px die.
- **Reduced motion** — if the viewer has reduced motion enabled at the OS level, the intro is skipped entirely, all scroll animations are suppressed, and the 3D background is rendered at 18% opacity (static) instead of animating.

---

## Dev Tools

A `FaceMapper` component is compiled into the bundle and gated behind a `MAPPING_MODE` flag at the top of `src/components/App.jsx`. Setting it to `true` replaces the app with an interactive die inspector: drag the model to any face, click the corresponding number, and export the `FACE_POSITIONS` camera-orbit map to the clipboard. This is how the ground-truth face orientations used by the roll animation were originally calibrated.
