const aboutUsVideo = document.querySelector('#about-us video'),
      figureElement = document.querySelector('#about-us figure');
let   videoHeight = aboutUsVideo.getBoundingClientRect().width;

document.addEventListener('DOMContentLoaded', () => {
  figureElement.style.height = `${videoHeight}px`;
});

window.addEventListener('resize', () => {
  videoHeight = aboutUsVideo.getBoundingClientRect().height;
  figureElement.style.height = `${videoHeight}px`;
});