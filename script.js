// Targets (match your HTML/CSS class names)
const flapRule = CSSRulePlugin.getRule(".envelope:before"); // the triangular flap
const envelope = document.querySelector(".envelope");
const letter   = document.querySelector(".letter");
const shadow   = document.querySelector(".shadow");

// Timeline (paused; we play or reverse it)
const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

// Initial state (in case browser styles differ)
gsap.set(letter, { y: 0, scale: 1 });
gsap.set(shadow, { width: 40, opacity: 0.12 });

// Build the open animation
tl
  // 1) Flap folds back
  .to(flapRule, { duration: 0.6, cssRule: { rotateX: -180 } }, 0)
  // 2) Card emerges upward and scales
  .to(letter,   { duration: 1.0, y: -280, scale: 1.05, ease: "power2.out" }, 0.2)
  // 3) Shadow widens as card comes forward
  .to(shadow,   { duration: 1.0, width: 120, opacity: 0.2, ease: "power2.out" }, 0.2);

// Public functions (used by onclick in index.html)
let isAnimating = false;

function openCard() {
  if (isAnimating || tl.progress() > 0 && !tl.reversed()) return;
  isAnimating = true;
  tl.play().then(() => { isAnimating = false; });
}

function closeCard() {
  if (isAnimating || tl.progress() === 0 && tl.reversed()) return;
  isAnimating = true;
  tl.reverse().then(() => { isAnimating = false; });
}

// Optional: also wire up click handlers here (in case you remove inline onclick)
if (envelope) {
  envelope.addEventListener("click", () => openCard());
}

// Optional: keyboard accessibility (Enter/Space toggles)
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "enter" || key === " ") {
    e.preventDefault();
    if (tl.reversed() || tl.progress() === 0) openCard();
    else closeCard();
  }
});

// Expose to window if you keep inline HTML handlers
window.openCard = openCard;
window.closeCard = closeCard;
