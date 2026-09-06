# Voxel connection

This closing section replaces the former Contact section. `VoxelConnect.jsx`
owns visibility and the controls; `scene.js` owns Three.js and animation;
`geometry.js` owns the two configurations and their reversible travel paths.

The 29 × 29 module matrix in `qr-data.js` was sampled from the supplied
`public/assets/qr.svg`. The supplied PNG and rendered desktop/mobile screenshots
were decoded with ZXing to confirm `https://vhades.dpdns.org/connect`.
If the source asset changes, resample the matrix and decode its destination
together. The geometry test catches a matrix that no longer matches the SVG.

There are three persistent cubes behind each lit QR module. The sculpture uses
all 1,317 cubes; the QR stacks them along the viewing axis. A fixed orthographic
view ensures the projection remains square, and the entire sculpture's rotation
aligns to zero during assembly. The final material bypasses lighting and resolves
to #C9A84C on #0D0D0D, with at least four modules of quiet zone. The scalar
transition follows the same staggered curved paths in either direction, including
when the control is pressed before completion.

The renderer clears to transparency, allowing the section's #0D0D0D background
to show through without an opaque canvas rectangle.
The scene initializes on first entry, pauses off-screen and in hidden tabs, and
stops rendering once the QR settles. Reduced motion disables rotation and travel.
If WebGL fails, the original QR remains available as a scan/tap fallback.

The QR's encoded destination is the canonical `https://vhades.dpdns.org/connect`.
Its tap target uses `/connect` so local previews and the deployed site both open
their own standalone contact page. The fourth portfolio navigation dot scrolls
to this V/QR section without changing the URL. `connect.html` is a separate Vite build entry
with no JavaScript or portfolio media dependencies. Deploy the complete `dist`
directory so `/connect` resolves to `connect.html` through the host's clean URLs.

Run the source/mapping/endpoint checks from the repository root:

```sh
node --test src/components/voxel-connect/geometry.test.js
npm run build
```

Browser checks covered desktop, a 390px mobile viewport, touch at 3× pixel density,
mid-transition reversal, QR stability, reduced motion, off-screen pause/resume,
and context loss. Screenshot decoding passed; physical phone-camera scanning and
performance on physical mobile hardware still need device testing.
