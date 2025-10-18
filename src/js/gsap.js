// =========================
// INITIALIZE GSAP
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


// *** ABOUT US ***
const aboutUs = document.getElementById('about-us'),
      aboutUsparallaxImg = document.querySelector('#about-us .parallax-img'),
      aboutUsHeadline = document.querySelector('#about-us .headline');

const aboutUsScrollTrigger = () => {
  gsap.fromTo(
    aboutUsparallaxImg,
    { y: -20 },
    {
      y: -70,
      ease: 'none',
      scrollTrigger: {
        trigger: aboutUs,
        start: 'top bottom',
        endTrigger: aboutUsHeadline,
        end: 'top top',
        scrub: true
      }
    }
  );
};

// *** EXPERIENCE ***
const experienceLeftImages = Array.from(document.querySelectorAll('#experience .left img')),
      experienceRightImages = Array.from(document.querySelectorAll('#experience .right img')),
      experienceCenterImage = document.querySelector('#experience .center img'),
      experienceHeadline = document.querySelector('#experience h3');

const experienceScrollTrigger = () => {
  gsap.fromTo(
    experienceLeftImages,
    { x: 0 },
    {
      x: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: experienceLeftImages[0],
        start: 'top bottom',
        endTrigger: experienceHeadline,
        end: 'top top',
        scrub: true
      }
    }
  );
  gsap.fromTo(
    experienceCenterImage,
    { scale: 1 },
    {
      scale: 1.25,
      ease: 'none',
      scrollTrigger: {
        trigger: experienceCenterImage,
        start: 'top bottom',
        endTrigger: experienceHeadline,
        end: 'top top',
        scrub: true
      }
    }
  );
  gsap.fromTo(
    experienceRightImages,
    { x: 0 },
    {
      x: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: experienceRightImages[0],
        start: 'top bottom',
        endTrigger: experienceHeadline,
        end: 'top top',
        scrub: true
      }
    }
  )
};

// *** GALLERY ***
const gallery = document.getElementById('gallery'),
      galleryStickyElement = document.querySelector('#gallery .gallery-part-one .left'),
      galleryPartTwo = document.querySelector('#gallery .gallery-part-two'),
      redCircle = document.querySelector('#gallery .red-circle'),
      imgs = gsap.utils.toArray('#gallery img');

const galleryScrollTrigger = () => {

  ScrollTrigger.create({
    trigger: galleryStickyElement,
    start: 'center center',
    endTrigger: galleryPartTwo,
    end: 'top bottom',
    pin: true
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
};

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


// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  aboutUsScrollTrigger();
  experienceScrollTrigger();
  galleryScrollTrigger();
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

document.addEventListener('menu:updated', () => {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => ScrollTrigger.refresh())
  );
});
