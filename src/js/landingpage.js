const landingPage = document.getElementById('landing-page'),
      landingPageBackground = document.querySelector('.landing-page-background');

let landingPageHeight = landingPage.getBoundingClientRect().height;

window.addEventListener('resize', () => {
  landingPageHeight = landingPage.getBoundingClientRect().height;
});

document.addEventListener('DOMContentLoaded', () => {
  landingPageBackground.style.height = `${landingPageHeight}px`;
});