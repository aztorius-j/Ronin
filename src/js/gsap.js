// =========================
// INITIALIZE GSAP
// =========================

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText);

ScrollSmoother.create({
  smooth: 1.75,
  effects: true,
});

let raf1 = 0, raf2 = 0;

const refreshAfterLayout = (source) => {
  cancelAnimationFrame(raf1);
  cancelAnimationFrame(raf2);

  raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(async () => {
      if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch {}
      }
      const pendingImgs = Array.from(document.images).filter(img => !img.complete);
      if (pendingImgs.length) {
        await Promise.all(
          pendingImgs.map(img => img.decode?.().catch(() => {}) || Promise.resolve())
        );
      }
      ScrollSmoother.get()?.refresh();
      ScrollTrigger.refresh();
    });
  });
};

// =========================
// SECTION-SPECIFIC TRIGGERS
// =========================


// *** ABOUT US ***
const aboutUs = document.getElementById('about-us'),
      aboutUsparallaxImg = document.querySelector('#about-us .parallax-img'),
      aboutUsHeadline = document.querySelector('#about-us .headline'),
      headlineLogo = document.querySelector('#about-us .headline img'),
      aboutUsRedParagraph = document.querySelector('#about-us .left .red-paragraph');

const aboutUsImageParallax = () => {
  gsap.fromTo(
    aboutUsparallaxImg,
    { y: -20 },
    {
      y: -100,
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

const aboutUsScrollTrigger = () => {
  const spin = gsap.to(headlineLogo, {
    rotation: "+=360",
    duration: 20,
    ease: "none",
    repeat: -1
  });

  const BASE = 1;

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      const v = self.getVelocity();
      const dir = Math.sign(v);
      const mag = Math.min(Math.abs(v) / 300, 30);
      const target = BASE + mag * dir;

      gsap.to(spin, { timeScale: target, duration: 0.2, overwrite: "auto" });
    },
    onStop() {
      gsap.to(spin, { timeScale: BASE, duration: 0.8, ease: "power2.out" });
    }
  });
};


(async () => {
  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch {}
  }

  const redSplit = new SplitText(aboutUsRedParagraph, {
    type: "words,chars",
    wordsClass: "word",
    charsClass: "char"
  });

  gsap.fromTo(
    redSplit.chars,
    { opacity: 0 },
    {
      opacity: 1,
      ease: "power2.out",
      stagger: { each: 0.02, from: "start" },
      scrollTrigger: {
        trigger: aboutUsRedParagraph,
        start: "top 90%",
        end: "top 30%",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );
})();

// *** EXPERIENCE ***
const experienceLeftImages = Array.from(document.querySelectorAll('#experience .left img')),
      experienceRightImages = Array.from(document.querySelectorAll('#experience .right img')),
      experienceCenterImage = document.querySelector('#experience .center img'),
      experienceHeadline = document.querySelector('#experience .headline-container');

const experienceScrollTrigger = () => {
  gsap.fromTo(
    experienceLeftImages,
    { x: 0 },
    {
      x: () => -(window.innerWidth / 10),
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
      x: () => window.innerWidth / 10,
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

const expHeadlineScrollTrigger = () => {
  gsap.fromTo(
    experienceHeadline,
    { y: 100, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: experienceHeadline,
        start: 'top 90%',
        once: true
      }
    }
  );
};

// *** GALLERY ***
const gallery = document.getElementById('gallery'),
      galleryPartOneLeft = document.querySelector('#gallery .gallery-part-one .left'),
      StickyElement = document.querySelector('#gallery .gallery-part-one .sticky'),
      galleryPartTwo = document.querySelector('#gallery .gallery-part-two'),
      redCircle = document.querySelector('#gallery .red-circle'),
      imgs = gsap.utils.toArray('#gallery img');

const galleryScrollTrigger = () => {

  ScrollTrigger.create({
    trigger: StickyElement,
    start: () => window.innerHeight > StickyElement.getBoundingClientRect().height + 64 ? 'center center' : 'top-=32 top',
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
    {width: window.innerWidth / 10, height: window.innerWidth / 10},
    {
      width: () => `${Math.hypot(window.innerWidth, galleryPartOneLeft.getBoundingClientRect().height)}px`,
      height: () => `${Math.hypot(window.innerWidth, galleryPartOneLeft.getBoundingClientRect().height)}px`,
      ease: 'power2.in'
    }
  );
};

const MAX_PER_INDEX_VW = 0.3;   // jemnosť efektu (zvýš = výraznejšie)
const SPEED_SCALE      = 1800;   // vyššie = jemnejšia odozva na rýchlosť
const STOP_THRESHOLD   = 20;    // kedy to berieme ako takmer stojí

const galleryVelocityTrigger = () => {
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
};


// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  aboutUsImageParallax();
  aboutUsScrollTrigger();
  experienceScrollTrigger();
  expHeadlineScrollTrigger();
  galleryScrollTrigger();
  galleryVelocityTrigger();
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

document.addEventListener('menu:updated', () => {
  refreshAfterLayout('menu:updated');
});

document.addEventListener('gallery:updated', () => {
  refreshAfterLayout('gallery:updated');
});