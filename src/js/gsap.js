// =========================
// INITIALIZE LENIS AND GSAP
// =========================

import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
});


// =========================
// SECTION-SPECIFIC TRIGGERS
// =========================


// *** GALLERY ***
const galleryStickyElement = document.querySelector('#gallery .gallery-part-one .left'),
      galleryPartTwo = document.querySelector('#gallery .gallery-part-two');

ScrollTrigger.create({
  trigger: galleryStickyElement,
  start: 'center center',
  endTrigger: galleryPartTwo,
  end: 'top bottom',
  pin: true,
  pinSpacing: false,
  scrub: true
});