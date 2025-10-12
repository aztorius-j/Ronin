const projectData = await fetch('/project-data.json', {cache: 'no-cache'}).then(res => res.json());
const {partnersArray} = projectData;

const arrowLeft  = document.querySelector('#partners .arrow-left'),
      arrowRight = document.querySelector('#partners .arrow-right'),
      partnerSlider = document.querySelector('#partners .inner-slider'),
      TRANSITION = 'transform .3s ease-in-out';
let   isAnimating = false,
      shiftMultiplier = .27;


// FUNCTIONS
const createPartner = (name, instagramText, instagramLink, image) => {
  const partner = document.createElement('div'),
        partnerImg = document.createElement('div'),
        partnerInfo = document.createElement('div'),
        partnerName = document.createElement('p'),
        partnerInsta = document.createElement('p'),
        partnerInstaLink = document.createElement('a');

  partnerImg.classList.add('partner-img');
  partnerInfo.classList.add('partner-info');
  partnerName.classList.add('partner-name');
  partnerInsta.classList.add('partner-insta');

  partnerImg.style.background = `url('${image}') center center / cover no-repeat`;
  partnerName.textContent = name;
  partnerInstaLink.target = '_blank';
  partnerInstaLink.href = instagramLink;
  partnerInstaLink.textContent = instagramText;

  partner.classList.add('small-box');
  partnerInsta.appendChild(partnerInstaLink);
  partnerInfo.appendChild(partnerName);
  partnerInfo.appendChild(partnerInsta);
  partner.appendChild(partnerImg);
  partner.appendChild(partnerInfo);

  partnerSlider.appendChild(partner);
};

const gereratePartnerBox = (array) => {
  array.forEach((partnerBox, index) => {
    const [name, instaText, instaLink, img] = [partnerBox.name, partnerBox.instagramText, partnerBox.instagramLink, partnerBox.image];
    createPartner(name, instaText, instaLink, img);

    const createdBox = partnerSlider.lastElementChild;
    if (index === 2) {
      createdBox.classList.remove('small-box');
      createdBox.classList.add('large-box');
    }
  });
};

const enforceSizeClasses = () => {
  const boxes = partnerSlider.children;
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove('large-box', 'small-box');
    boxes[i].classList.add(i === 2 ? 'large-box' : 'small-box');
  }
};

const slide = (direction) => {
  if (isAnimating) return;
  isAnimating = true;

  const shift = window.innerWidth * shiftMultiplier;

  if (direction === 1) {
    partnerSlider.style.transition = 'none';
    partnerSlider.appendChild(partnerSlider.firstElementChild);
    enforceSizeClasses();

    partnerSlider.style.transform = `translateX(${shift}px)`;
    void partnerSlider.offsetWidth;

    partnerSlider.style.transition = TRANSITION;
    partnerSlider.style.transform = 'translateX(0)';

    partnerSlider.addEventListener('transitionend', () => {
      isAnimating = false;
    }, { once: true });

  } else {
    partnerSlider.style.transition = 'none';
    partnerSlider.insertBefore(
      partnerSlider.lastElementChild,
      partnerSlider.firstElementChild
    );
    enforceSizeClasses();

    partnerSlider.style.transform = `translateX(-${shift}px)`;
    void partnerSlider.offsetWidth;

    partnerSlider.style.transition = TRANSITION;
    partnerSlider.style.transform = 'translateX(0)';

    partnerSlider.addEventListener('transitionend', () => {
      isAnimating = false;
    }, { once: true });
  }
};

const updateShiftMultiplier = () => {
  shiftMultiplier = window.innerWidth < 2280 ? .34 : .27;
};


// FUNCTION CALL
gereratePartnerBox(partnersArray);
enforceSizeClasses();


// EVENT LISTENERS
arrowRight.addEventListener('click', () => slide(1));
arrowLeft.addEventListener('click', () => slide(-1));
window.addEventListener('resize', updateShiftMultiplier);
updateShiftMultiplier();