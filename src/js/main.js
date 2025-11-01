// *** CUSTOM CURSOR ***
const customCursor = document.getElementById('custom-cursor');
let lastX = 0, lastY = 0, isCursorActive = false, headerAnimationDone = false;

document.addEventListener('headerAnimation:finished', () => {
  setTimeout(() => {
    headerAnimationDone = true;
    introSection.style.display = 'none';
    body.style.overflow = 'visible';
  }, 1000);
});

const onFirstMove = () => {
  if (!headerAnimationDone) return;
  isCursorActive = true;
  customCursor.style.opacity = 1;
  window.removeEventListener('mousemove', onFirstMove);
};

window.addEventListener('mousemove', onFirstMove);

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

// *** INTRO ANIMATION ***
const body = document.querySelector('body'),
      introSection = document.getElementById('intro'),
      introImage = document.querySelector('img.intro-img'),
      header = document.querySelector('header');

const introImgOpacity = () => {
    introImage.style.opacity = 1;
    introImage.addEventListener('transitionend', introSectionHide, {once: true});
};

const introSectionHide = () => {
  introSection.style.transform = 'translateY(-102vh)';
  introSection.addEventListener('transitionend', () => {
    setTimeout(() => {
      header.style.transform = 'translateY(0px)';
      document.dispatchEvent(new Event('headerAnimation:finished'));
    }, 750); 
  }, {once: true});
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(introImgOpacity, 500);
});

// *** LANDING PAGE ***
const landingPage = document.getElementById('landing-page'),
      landingPageBackground = document.querySelector('.landing-page-background');

let landingPageHeight = landingPage.getBoundingClientRect().height;

window.addEventListener('resize', () => {
  landingPageHeight = landingPage.getBoundingClientRect().height;
});

document.addEventListener('DOMContentLoaded', () => {
  landingPageBackground.style.height = `${landingPageHeight}px`;
});

// *** GALLERY ***
const redCircleContainer = document.querySelector('#gallery .circle-container'),
      stickyElement = document.querySelector('#gallery .gallery-part-one .sticky');
let   topPosition;

const containerPosition = (source) => {
  topPosition = Math.max(32, (window.innerHeight - stickyElement.getBoundingClientRect().height) / 2);
  redCircleContainer.style.top = `-${topPosition}px`;
};

document.addEventListener('menu:updated', containerPosition);
window.addEventListener('resize', containerPosition);

document.dispatchEvent(new Event('gallery:updated'));