// =========================
// INITIALIZE LENIS AND GSAP
// =========================

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

ScrollSmoother.create({
  smooth: 1.75,
  effects: true,
});


// =========================
// SECTION-SPECIFIC TRIGGERS
// =========================


// *** GALLERY ***
const gallery = document.getElementById('gallery'),
      galleryStickyElement = document.querySelector('#gallery .gallery-part-one .left'),
      galleryPartTwo = document.querySelector('#gallery .gallery-part-two'),
      redCircle = document.querySelector('#gallery .red-circle'),
      imgs = gsap.utils.toArray('#gallery img');

const galleryScrollTrigger = () => {
  if (!gallery || !galleryPartTwo || !galleryStickyElement || !redCircle) return;

  ScrollTrigger.create({
    trigger: galleryStickyElement,
    start: 'center center',
    endTrigger: galleryPartTwo,
    end: 'top bottom',
    pin: true,
    pinSpacing: false,
    scrub: true
  });

  const timeLine = gsap.timeline({
    scrollTrigger: {
      trigger: gallery,
      start: 'top bottom',
      endTrigger: galleryPartTwo,
      end: 'top bottom',
      scrub: true,
      invalidateOnRefresh: true
    }
  });

  timeLine.fromTo(
    redCircle,
    {width: 0, height: 0},
    {
      width: () => `${Math.hypot(window.innerWidth, window.innerHeight)}px`,
      height: () => `${Math.hypot(window.innerWidth, window.innerHeight)}px`,
      ease: 'none'
    }
  );
}

const MAX_PER_INDEX_VW = 0.3;   // jemnosť efektu (zvýš = výraznejšie)
const SPEED_SCALE      = 1800;   // vyššie = jemnejšia odozva na rýchlosť
const STOP_THRESHOLD   = 20;    // kedy to berieme ako takmer stojí

ScrollTrigger.create({
  trigger: gallery,
  start: 'top bottom',
  end: 'bottom top',
  onUpdate: (self) => {
    const v = gsap.utils.clamp(-2000, 2000, self.getVelocity());

    const baseDeltaVW = gsap.utils.clamp(
      -MAX_PER_INDEX_VW,
      MAX_PER_INDEX_VW,
      v / SPEED_SCALE
    );

    gsap.to(imgs, {
      y: (i) => `${i * baseDeltaVW}vw`,
      duration: 0.44,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    if (Math.abs(v) < STOP_THRESHOLD) {
      gsap.to(imgs, {
        y: '0vw',
        duration: 0.6,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto'
      });
    }
  }
});


// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  galleryScrollTrigger();
});

// Unified resize handler
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
