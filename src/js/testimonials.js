const fallbackReviews = [
  {
    authorAttribution: {
      displayName: 'Ar',
    },
    rating: 5,
    publishTime: 'one year ago',
    originalText: {
      text: "This place is fantastic! It's delicious and the staff is friendly and attentive. I really enjoyed my time here. The coffee is amazing!"
    }
  },
  {
    authorAttribution: {
      displayName: 'Alexandra Pera',
    },
    rating: 5,
    publishTime: 'two years ago',
    originalText: {
      text: "Nice cozy and modern cafe with excellent coffee and a garden/terrace in the back. They serve vegan sweet and salty pastries from Krafin. Nice and kind barista. Definitely recommend!"
    }
  },
  {
    authorAttribution: {
      displayName: 'Dan Brookes',
    },
    rating: 5,
    publishTime: 'one month ago',
    originalText: {
      text: "Really nice and quiet coffee shop; they do a simple thing very well."
    }
  },
  {
    authorAttribution: {
      displayName: 'Olesia Skibinska',
    },
    rating: 5,
    publishTime: 'one year ago',
    originalText: {
      text: "Currently my favorite coffee place in Prague. The best batch I have had in ages, even with constantly growing numbers of cafes in Vinohrady. The staff is very kind and passionate about their craft. Also, the terrace is a hidden gem!"
    }
  },
  {
    authorAttribution: {
      displayName: 'Milan Straka',
    },
    rating: 5,
    publishTime: 'two years ago',
    originalText: {
      text: "Coffe here is absolutely must! Excellent doubleshot or batchbrew is a standart here. Really nice place to be. One of the best in Czech. Iconic garden, see you soon!!"
    }
  }
];

const placeId = 'ChIJ1bBA246VC0cRfdbmYb9lbto',
      apiKey = import.meta.env.VITE_GOOGLE_API_KEY,
      arrowLeft  = document.querySelector('#testimonials .arrow-left'),
      arrowRight = document.querySelector('#testimonials .arrow-right'),
      testimonialSlider = document.querySelector('#testimonials .inner-slider'),
      TRANSITION = 'transform .3s ease-in-out',
      finalTestimonialsArray = [];
let   isAnimating = false;


// FUNCTIONS
const formatDate = (time) => {
  if (!/^\d/.test(time)) return time;
  const year = time.slice(0, 4),
        month = time.slice(5, 7),
        day = time.slice(8, 10);
  return `${day}-${month}-${year}`;
};

const generateTestimonial = (name, rating, date, review) => {
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

  reviewParagraph.textContent = review;
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

const getReviews = (data) => {
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
    generateTestimonial(name, rating, date, text);
  });
};

const slide = (direction) => {
  if (isAnimating) return;
  isAnimating = true;

  const shift = window.innerWidth * 0.49;

  if (direction === 1) {
    testimonialSlider.style.transition = TRANSITION;
    testimonialSlider.style.transform = `translateX(-${shift}px)`;

    testimonialSlider.addEventListener('transitionend', function onEnd() {
      testimonialSlider.removeEventListener('transitionend', onEnd);
      // presuň prvý testimonial na koniec
      testimonialSlider.appendChild(testimonialSlider.firstElementChild);
      // reset bez animácie
      testimonialSlider.style.transition = 'none';
      testimonialSlider.style.transform = 'translateX(0)';
      // force reflow
      void testimonialSlider.offsetWidth;
      // späť animáciu pre ďalší klik
      testimonialSlider.style.transition = TRANSITION;
      isAnimating = false;
    }, { once: true });

  } else {
    // najprv presuň posledný na začiatok a nastav východzí offset
    testimonialSlider.style.transition = 'none';
    testimonialSlider.insertBefore(
      testimonialSlider.lastElementChild,
      testimonialSlider.firstElementChild
    );
    testimonialSlider.style.transform = `translateX(-${shift}px)`;
    void testimonialSlider.offsetWidth; // reflow
    // potom animuj späť na 0
    testimonialSlider.style.transition = TRANSITION;
    testimonialSlider.style.transform = 'translateX(0)';
    testimonialSlider.addEventListener('transitionend', () => {
      isAnimating = false;
    }, { once: true });
  }
};


// FETCH
fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
  headers: {
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "reviews"
  }
})
  .then(res => res.json())
  .then(getReviews)
  .catch(console.error);


// EVENT LISTENERS
arrowRight.addEventListener('click', () => slide(1));
arrowLeft.addEventListener('click', () => slide(-1));