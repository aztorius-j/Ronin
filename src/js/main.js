const landingPage = document.getElementById('landing-page'),
      landingPageBackground = document.querySelector('.landing-page-background');

let landingPageHeight = landingPage.getBoundingClientRect().height;

window.addEventListener('resize', () => {
  landingPageHeight = landingPage.getBoundingClientRect().height;
});

document.addEventListener('DOMContentLoaded', () => {
  landingPageBackground.style.height = `${landingPageHeight}px`;
});


// *** CUSTOM CURSOR ***
const customCursor = document.getElementById('custom-cursor');
let lastX = 0, lastY = 0, isCursorActive = false;

const onFirstMove = () => {
  isCursorActive = true;
  customCursor.style.opacity = 1;
  window.removeEventListener('mousemove', onFirstMove);
};

window.addEventListener('mousemove', onFirstMove, { once: true });

const checkPointerTarget = (el) => {
  const style = window.getComputedStyle(el);
  return (
    style.cursor === "pointer" ||
    el.tagName === "A" ||
    el.tagName === "BUTTON"
  );
};

document.body.addEventListener("mouseleave", () => {
  customCursor.style.opacity = 0;
});

window.addEventListener("mousemove", (event) => {
  const posX = event.clientX;
  const posY = event.clientY;
  lastX = posX;
  lastY = posY;

  if (isCursorActive) customCursor.style.opacity = 1;

  customCursor.animate(
    { left: `${posX}px`, top: `${posY}px` },
    { duration: 500, fill: "forwards" }
  );

  const isPointer = checkPointerTarget(event.target);
  customCursor.style.transform = `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`;
});

window.addEventListener("scroll", () => {
  if (!isCursorActive) return;
  const hovered = document.elementFromPoint(lastX, lastY);
  if (!hovered) return;

  const isPointer = checkPointerTarget(hovered);
  customCursor.style.transform = `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`;
});


const redCircleContainer = document.querySelector('#gallery .circle-container'),
      stickyElement = document.querySelector('#gallery .gallery-part-one .sticky');
let   topPosition;

const containerPosition = (source) => {
  topPosition = Math.max(32, (window.innerHeight - stickyElement.getBoundingClientRect().height) / 2);
  redCircleContainer.style.top = `-${topPosition}px`;
  console.log(source, topPosition, performance.now());
};

document.dispatchEvent(new Event('gallery:updated'));

// EVENT LISTENERS
document.addEventListener('menu:updated', containerPosition('menu:updated'));
window.addEventListener('load', containerPosition('load'));
window.addEventListener('resize', containerPosition);