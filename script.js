// === Targets (match CSS) ===
const flapRule = CSSRulePlugin.getRule(".envelope:before"); // the flap
const envelope = document.querySelector(".envelope");
const letter   = document.querySelector(".letter");
const shadow   = document.querySelector(".shadow");

// === Timeline ===
// Paused by default; we play() to open, reverse() to close
const tl = gsap.timeline({ paused: true });

// Ensure known starting state
gsap.set(letter, { y: 0, scale: 1, zIndex: 10 });
gsap.set(shadow, { width: 40, opacity: 0.12 });

// Build animation:
// 1) flap rotates back
// 2) card rises higher (portrait), scales slightly, then comes in front
// 3) shadow widens
tl
  .to(flapRule, { duration: 0.6, cssRule: { rotateX: -180 }, ease: "power2.inOut" }, 0)
  .to(letter,   { duration: 1.0, y: -350, scale: 1.05, ease: "power2.out" }, 0.2)
  .set(letter,  { zIndex: 30, pointerEvents: "auto" }, "<") // once moving, allow clicks and bring to front
  .to(shadow,   { duration: 1.0, width: 120, opacity: 0.2, ease: "power2.out" }, 0.2);

// Public API for inline handlers
let busy = false;
function openCard() {
  if (busy || (!tl.reversed() && tl.progress() > 0)) return;
  busy = true;
  tl.play().then(() => { busy = false; });
}

function closeCard() {
  if (busy || tl.progress() === 0 && tl.reversed()) return;
  busy = true;
  // put card behind flap again as it closes
  tl.eventCallback("onReverseComplete", () => {
    gsap.set(letter, { zIndex: 10, pointerEvents: "none" });
    tl.eventCallback("onReverseComplete", null);
    busy = false;
  });
  tl.reverse();
}

// Optional: keyboard toggle (Enter/Space)
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k === "enter" || k === " ") {
    e.preventDefault();
    if (tl.progress() === 0 || tl.reversed()) openCard();
    else closeCard();
  }
});

// Expose functions if you keep inline handlers in HTML
window.openCard = openCard;
window.closeCard = closeCard;
