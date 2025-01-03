import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import slides from "./slides";
import classes from "./HorizontalSlides.module.css";
import VideoCard from "../VideoCard/VideoCard";
import { useAnimation } from "@/context/animation-context";

gsap.registerPlugin(ScrollTrigger);

const HorizontalSlides = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const { animateSlider } = useAnimation();

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current;
    const totalWidth = cards.length * cards[0].offsetWidth;

    gsap.set(container, { x: "100vw", opacity: 0 });

    if (animateSlider) {
      gsap.to(container, {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cards, {
            xPercent: -100 * (cards.length - 1),
            ease: "none",
            scrollTrigger: {
              trigger: container,
              pin: true,
              start: "top top",
              end: () => `+=${totalWidth}`,
              scrub: 1,
            },
          });
        },
      });
    }
  }, [animateSlider]);

  return (
    <div className={classes.container} ref={containerRef}>
      <ul className={classes.slidesWrapper}>
        {slides.map((slide, index) => (
          <li className={classes.card} key={slide.id} ref={(el) => (cardsRef.current[index] = el)}>
            <VideoCard portfolioItem={slide} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HorizontalSlides;
