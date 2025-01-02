import classes from "./Title.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const Title = () => {
  const containerRef = useRef();

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
