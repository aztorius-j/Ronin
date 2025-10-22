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
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});