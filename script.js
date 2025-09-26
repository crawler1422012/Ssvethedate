// GSAP targets
const flapRule = CSSRulePlugin.getRule(".envelope:before");
const envelope = document.querySelector(".envelope");
const letter   = document.querySelector(".letter");
const shadow   = document.querySelector(".shadow");

// Timeline
const tl = gsap.timeline({ paused: true });

// Start states
gsap.set(letter, { y: 0, scale: 1, zIndex: 20, pointerEvents: "none" });
gsap.set(shadow, { width: 40, opacity: 0.12 });

// Build animation
tl
  // flap rotates back
  .to(flapRule, { duration: 0.6, cssRule: { rotateX: -180 }, ease: "power2.inOut" }, 0)
  // card emerges higher (portrait) and scales slightly
  .to(letter,   { duration: 1.0, y: -350, scale: 1.05, ease: "power2.out" }, 0.2)
  // once moving, bring to front & allow clicks
  .set(letter,  { zIndex: 40, pointerEvents: "auto" }, "<")
  // shadow widens
  .to(shadow,   { duration: 1.0, width: 120, opacity: 0.2, ease: "power2.out" }, 0.2);

let busy = false;
function openCard(){
  if (busy || (!tl.reversed() && tl.progress() > 0)) return;
  busy = true;
  tl.play().then(() => busy = false);
}
function closeCard(){
  if (busy || (tl.progress() === 0 && tl.reversed())) return;
  busy = true;
  tl.eventCallback("onReverseComplete", () => {
    gsap.set(letter, { zIndex: 20, pointerEvents: "none" }); // hide back under flap
    tl.eventCallback("onReverseComplete", null);
    busy = false;
  });
  tl.reverse();
}

// Optional keyboard support
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k === "enter" || k === " ") {
    e.preventDefault();
    if (tl.progress() === 0 || tl.reversed()) openCard();
    else closeCard();
  }
});

// Expose for inline handlers
window.openCard = openCard;
window.closeCard = closeCard;
