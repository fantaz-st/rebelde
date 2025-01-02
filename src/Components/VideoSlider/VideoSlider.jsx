import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import slides from "./slides";

import { Draggable } from "gsap/all";
import classes from "./VideoSlider.module.css";
import VideoCard from "../VideoCard/VideoCard";
import { useGSAP } from "@gsap/react";
import horizontalLoop from "./horizontalHelper";

gsap.registerPlugin(ScrollTrigger, Observer, Draggable);

const VideoSlider = ({ animateSlider }) => {
  const containerRef = useRef(null);
  const marqueeWrapperRef = useRef(null);

  useGSAP(
    () => {
      horizontalLoop(`.${classes.card}`, {
        repeat: -1,
        speed: 1.7,
        paddingRight: 32,
        draggable: true,
      });
    },
    { scope: containerRef }
  );
  return (
    <div className={classes.container} style={{ overflow: "hidden" }} ref={containerRef}>
      <div className={classes.marqueeWrapper} ref={marqueeWrapperRef}>
        <div className={classes.marqueeInner}>
          {slides.map((slide, index) => (
            <li className={classes.card} key={slide.id}>
              <VideoCard portfolioItem={slide} index={index} animateSlider={animateSlider} />
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSlider;
