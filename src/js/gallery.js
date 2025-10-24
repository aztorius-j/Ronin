const redCircleContainer = document.querySelector('#gallery .circle-container'),
      stickyElement = document.querySelector('#gallery .gallery-part-one .sticky');
let   topPosition;

const containerPosition = () => {
  topPosition = Math.max(32, (window.innerHeight - stickyElement.getBoundingClientRect().height) / 2);
  redCircleContainer.style.top = `-${topPosition}px`;
  console.log(topPosition);
};

document.addEventListener('DOMContentLoaded', containerPosition);
document.dispatchEvent(new Event('gallery:updated'));

// EVENT LISTENERS
window.addEventListener('resize', containerPosition);
