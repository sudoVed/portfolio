export const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("mousemove", (e) => { mousePos.x = e.clientX; mousePos.y = e.clientY; }, { passive: true });
