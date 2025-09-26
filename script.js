// GSAP animations
const flap = CSSRulePlugin.getRule(".envelope:before");
const letter = document.querySelector(".letter");
const shadow = document.querySelector(".shadow");

let isOpen = false;

function openCard() {
  if (isOpen) return;
  isOpen = true;

  gsap.to(flap, { duration: 0.6, cssRule: { rotateX: -180 }, ease: "power2.inOut" });
  gsap.to(letter, { duration: 1, y: -160, scale: 1.1, ease: "power2.out", delay: 0.2 });
  gsap.to(shadow, { duration: 1, width: 120, ease: "power2.out", delay: 0.2 });
}

function closeCard() {
  if (!isOpen) return;
  isOpen = false;

  gsap.to(letter, { duration: 1, y: 0, scale: 1, ease: "power2.inOut" });
  gsap.to(flap, { duration: 0.6, cssRule: { rotateX: 0 }, ease: "power2.inOut", delay: 0.5 });
  gsap.to(shadow, { duration: 1, width: 40, ease: "power2.inOut" });
}
