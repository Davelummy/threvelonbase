"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Landing-page motion:
 * - Hero staggered entrance on load
 * - Scroll-triggered fade / scale once, never reversed
 * - Honours prefers-reduced-motion, including mid-session changes
 *
 * Mark elements with data-gs="hero|fade-up|fade-left|fade-right|scale|stagger"
 * and class "gs-hidden". That class is a hook only; CSS must not hide the
 * node before this component successfully owns it.
 */
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCROLL = {
  start: "top 85%",
  toggleActions: "play none none none" as const,
  once: true,
};

function revealMotionNodes() {
  document.querySelectorAll(".gs-hidden").forEach((node) => {
    node.classList.remove("gs-hidden");
    if (node instanceof HTMLElement) {
      gsap.set(node, { clearProps: "opacity,transform,translate,scale" });
    }
  });
}

export function ScrollMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = window.matchMedia(MOTION_QUERY);
    const owned: gsap.core.Tween[] = [];

    function killOwned() {
      while (owned.length) {
        owned.pop()?.kill();
      }
    }

    function track(tween: gsap.core.Tween) {
      owned.push(tween);
      return tween;
    }

    function setupMotion() {
      killOwned();

      if (media.matches) {
        revealMotionNodes();
        return;
      }

      const defaults = { duration: 0.8, ease: "power2.out" as const };
      const heroEls = document.querySelectorAll<HTMLElement>('[data-gs="hero"]');
      if (heroEls.length) {
        track(
          gsap.fromTo(
            heroEls,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.15,
              delay: 0.15,
              onStart: () => {
                heroEls.forEach((el) => el.classList.remove("gs-hidden"));
              },
            },
          ),
        );
      }

      document.querySelectorAll<HTMLElement>('[data-gs="fade-up"]').forEach((el) => {
        track(
          gsap.fromTo(
            el,
            { y: 50, opacity: 0 },
            {
              ...defaults,
              y: 0,
              opacity: 1,
              scrollTrigger: { trigger: el, ...SCROLL },
              onStart: () => el.classList.remove("gs-hidden"),
            },
          ),
        );
      });

      document.querySelectorAll<HTMLElement>('[data-gs="fade-left"]').forEach((el) => {
        track(
          gsap.fromTo(
            el,
            { x: -60, opacity: 0 },
            {
              ...defaults,
              x: 0,
              opacity: 1,
              scrollTrigger: { trigger: el, ...SCROLL },
              onStart: () => el.classList.remove("gs-hidden"),
            },
          ),
        );
      });

      document.querySelectorAll<HTMLElement>('[data-gs="fade-right"]').forEach((el) => {
        track(
          gsap.fromTo(
            el,
            { x: 60, opacity: 0 },
            {
              ...defaults,
              x: 0,
              opacity: 1,
              scrollTrigger: { trigger: el, ...SCROLL },
              onStart: () => el.classList.remove("gs-hidden"),
            },
          ),
        );
      });

      document.querySelectorAll<HTMLElement>('[data-gs="scale"]').forEach((el) => {
        track(
          gsap.fromTo(
            el,
            { scale: 0.92, opacity: 0 },
            {
              ...defaults,
              scale: 1,
              opacity: 1,
              duration: 1,
              scrollTrigger: { trigger: el, ...SCROLL },
              onStart: () => el.classList.remove("gs-hidden"),
            },
          ),
        );
      });

      document.querySelectorAll<HTMLElement>('[data-gs="stagger"]').forEach((parent) => {
        const children = parent.children;
        if (!children.length) return;
        track(
          gsap.fromTo(
            children,
            { y: 40, opacity: 0 },
            {
              ...defaults,
              y: 0,
              opacity: 1,
              stagger: 0.12,
              scrollTrigger: { trigger: parent, ...SCROLL },
              onStart: () => parent.classList.remove("gs-hidden"),
            },
          ),
        );
      });
    }

    function onPreferenceChange() {
      if (media.matches) {
        killOwned();
        revealMotionNodes();
      }
    }

    setupMotion();
    media.addEventListener("change", onPreferenceChange);

    return () => {
      media.removeEventListener("change", onPreferenceChange);
      killOwned();
    };
  }, []);

  return null;
}
