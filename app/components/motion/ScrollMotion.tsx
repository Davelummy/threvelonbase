"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * CTMDS landing-page motion model:
 * - Hero staggered entrance on load
 * - Scroll-triggered fade-up / fade-left / fade-right / scale
 * - Stagger children for grids
 * - Honours prefers-reduced-motion
 *
 * Mark elements with data-gs="hero|fade-up|fade-left|fade-right|scale|stagger"
 * and class "gs-hidden" (removed when animation starts).
 */
export function ScrollMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".gs-hidden").forEach((el) => {
        el.classList.remove("gs-hidden");
      });
      return;
    }

    const defaults = { duration: 0.8, ease: "power2.out" as const };
    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    const heroEls = document.querySelectorAll<HTMLElement>('[data-gs="hero"]');
    if (heroEls.length) {
      tweens.push(
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
      const tween = gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          ...defaults,
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          onStart: () => el.classList.remove("gs-hidden"),
        },
      );
      tweens.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    document.querySelectorAll<HTMLElement>('[data-gs="fade-left"]').forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { x: -60, opacity: 0 },
        {
          ...defaults,
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          onStart: () => el.classList.remove("gs-hidden"),
        },
      );
      tweens.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    document.querySelectorAll<HTMLElement>('[data-gs="fade-right"]').forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { x: 60, opacity: 0 },
        {
          ...defaults,
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          onStart: () => el.classList.remove("gs-hidden"),
        },
      );
      tweens.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    document.querySelectorAll<HTMLElement>('[data-gs="scale"]').forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { scale: 0.92, opacity: 0 },
        {
          ...defaults,
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          onStart: () => el.classList.remove("gs-hidden"),
        },
      );
      tweens.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    document.querySelectorAll<HTMLElement>('[data-gs="stagger"]').forEach((parent) => {
      const children = parent.children;
      if (!children.length) return;
      const tween = gsap.fromTo(
        children,
        { y: 40, opacity: 0 },
        {
          ...defaults,
          y: 0,
          opacity: 1,
          stagger: 0.12,
          scrollTrigger: {
            trigger: parent,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          onStart: () => parent.classList.remove("gs-hidden"),
        },
      );
      tweens.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
