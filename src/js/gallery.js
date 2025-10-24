const redCircleContainer = document.querySelector('#gallery .circle-container'),
      stickyElement = document.querySelector('#gallery .gallery-part-one .sticky');
let   topPosition;

const containerPosition = () => {
  topPosition = Math.max(32, (window.innerHeight - stickyElement.getBoundingClientRect().height) / 2);
  redCircleContainer.style.top = `-${topPosition}px`;
  console.log(topPosition);
};

// setTimeout(() => {
//   containerPosition();
// }, 1000);

document.addEventListener('menu:updated', containerPosition);

document.dispatchEvent(new Event('gallery:updated'));

// EVENT LISTENERS
window.addEventListener('resize', containerPosition);
