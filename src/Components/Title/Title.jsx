import classes from "./Title.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { useAnimation } from "@/context/animation-context";

gsap.registerPlugin(useGSAP);

const Title = () => {
  const containerRef = useRef();
  const { animateHero } = useAnimation();

  useGSAP(
    () => {
      const allTitlesSpans = containerRef.current.querySelectorAll(`.${classes.title} span`);
      gsap.to(allTitlesSpans, {
        y: 0,
        stagger: 0.2,
        ease: "power1.out",
      });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (animateHero) {
      gsap.to(containerRef.current, {
        y: "100%",
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [animateHero]);

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.text} data-cursor-size='xxl'>
        <h1 className={classes.title}>
          <span>But my dreams they aren't as empty</span>
        </h1>
        <h1 className={classes.title}>
          <span>As my conscience seems to be</span>
        </h1>
        <h1 className={classes.title}>
          <span>I have hours, only lonely</span>
        </h1>
        <h1 className={classes.title}>
          <span>My love is vengeance That's never free</span>
        </h1>
      </div>
    </div>
  );
};

export default Title;
