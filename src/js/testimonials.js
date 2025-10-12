const projectData = await fetch('/project-data.json', {cache: 'no-cache'}).then(res => res.json());
const {fallbackReviews} = projectData;

const placeId = 'ChIJ1bBA246VC0cRfdbmYb9lbto',
      apiKey = import.meta.env.VITE_GOOGLE_API_KEY,
      arrowLeft  = document.querySelector('#testimonials .arrow-left'),
      arrowRight = document.querySelector('#testimonials .arrow-right'),
      testimonialSlider = document.querySelector('#testimonials .inner-slider'),
      TRANSITION = 'transform .3s ease-in-out',
      finalTestimonialsArray = [];
let   isAnimating = false,
      shiftMultiplier = .326666666666;


// FUNCTIONS
const formatDate = (time) => {
  if (!/^\d/.test(time)) return time;

  const currentYear = new Date().getFullYear(),
        year = parseInt(time.slice(0, 4)),
        month = time.slice(5, 7),
        day = time.slice(8, 10),
        diff = currentYear - year;

  if (diff === 1) return 'one year ago';
  if (diff === 2) return 'two years ago';
  if (diff > 2) return `${diff} years ago`;

  return `${day}-${month}-${year}`;
};

const createTestimonial = (name, rating, date, review) => {
  const testimonial = document.createElement('div'),
        starsBox = document.createElement('div'),
        star = document.createElement('img'),
        reviewParagraph = document.createElement('p'),
        sourceBox = document.createElement('div'),
        nameSpan = document.createElement('span'),
        dateSpan = document.createElement('span');

  testimonial.classList.add('testimonial'); 
  starsBox.setAttribute('aria-label', `Hodnotenie: ${rating} z 5`);
  star.classList.add('star');
  star.alt = 'star';
  star.src = 'img/star.png';
  reviewParagraph.classList.add('review');
  sourceBox.classList.add('source-box');
  nameSpan.classList.add('name');
  dateSpan.classList.add('date');

  reviewParagraph.textContent = shortenText(review);
  nameSpan.textContent = name;
  dateSpan.textContent = date;

  for (let i = 0; i < rating; i++) {
    starsBox.appendChild(star.cloneNode(true));
  }

  testimonial.appendChild(starsBox);
  testimonial.appendChild(reviewParagraph);
  sourceBox.appendChild(nameSpan);
  sourceBox.appendChild(dateSpan);
  testimonial.appendChild(sourceBox);

  testimonialSlider.appendChild(testimonial);
};

const generateReviews = (data) => {
  const reviews = data.reviews;

  reviews.forEach((review) => {
    if (review.rating < 4) return;
    finalTestimonialsArray.push(review);
  });

  if (finalTestimonialsArray.length < 5) {
    const missing = 5 - finalTestimonialsArray.length;
    finalTestimonialsArray.push(...fallbackReviews.slice(0, missing));
  }

  finalTestimonialsArray.forEach((testimonial) => {
    const [name, rating, date, text] = [testimonial.authorAttribution.displayName, testimonial.rating, formatDate(testimonial.publishTime), testimonial.originalText.text];
    createTestimonial(name, rating, date, text);
  });
};

const slide = (direction) => {
  if (isAnimating) return;
  isAnimating = true;

  const shift = window.innerWidth * shiftMultiplier;

  if (direction === 1) {
    testimonialSlider.style.transition = TRANSITION;
    testimonialSlider.style.transform = `translateX(-${shift}px)`;

    testimonialSlider.addEventListener('transitionend', function onEnd() {
      testimonialSlider.removeEventListener('transitionend', onEnd);
      testimonialSlider.appendChild(testimonialSlider.firstElementChild);
      testimonialSlider.style.transition = 'none';
      testimonialSlider.style.transform = 'translateX(0)';
      void testimonialSlider.offsetWidth;
      testimonialSlider.style.transition = TRANSITION;
      isAnimating = false;
    }, { once: true });

  } else {
    testimonialSlider.style.transition = 'none';
    testimonialSlider.insertBefore(
      testimonialSlider.lastElementChild,
      testimonialSlider.firstElementChild
    );
    testimonialSlider.style.transform = `translateX(-${shift}px)`;
    void testimonialSlider.offsetWidth;
    testimonialSlider.style.transition = TRANSITION;
    testimonialSlider.style.transform = 'translateX(0)';
    testimonialSlider.addEventListener('transitionend', () => {
      isAnimating = false;
    }, { once: true });
  }
};

const shortenText = (text) => {
  return text.length > 235 ? text.slice(0, 235) + '...' : text;
};

const updateShiftMultiplier = () => {
  shiftMultiplier = window.innerWidth < 1200 ? .98 
                   : window.innerWidth < 2280 ? .49 
                   : .326666666666;
};


// FETCH
fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
  headers: {
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "reviews"
  }
})
  .then(res => res.json())
  .then(generateReviews)
  .catch(console.error);


// EVENT LISTENERS
arrowRight.addEventListener('click', () => slide(1));
arrowLeft.addEventListener('click', () => slide(-1));
window.addEventListener('resize', updateShiftMultiplier);
updateShiftMultiplier();