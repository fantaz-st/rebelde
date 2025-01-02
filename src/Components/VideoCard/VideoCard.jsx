import React, { useEffect, useRef, useState } from "react";
import classes from "./VideoCard.module.css";

const VideoCard = ({ portfolioItem, animateSlider }) => {
  const videoRef = useRef(null);
  const [mediaStyle, setMediaStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = e.clientX;
      const y = e.clientY;
      const parallaxOffset = 30;

      setMediaStyle({
        transform: `translate(${(1 / width) * x * parallaxOffset * -1}px, ${(1 / height) * y * parallaxOffset * -1}px)`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.pause();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.play();
  };

  return (
    <article role='article' className={`${classes.projectCover} ${animateSlider ? classes.projectCoverActive : ""} ${isHovered ? classes.projectCoverHovered : ""}`} tabIndex='0' aria-label={portfolioItem.title} aria-description={portfolioItem.lead}>
      <div className={classes.projectCoverVideoContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <video ref={videoRef} style={mediaStyle} className={classes.projectCoverVideo} loop muted autoPlay playsInline poster={portfolioItem.poster}>
          <source src={portfolioItem.video} type='video/mp4' />
        </video>
        {isHovered && <img className={classes.projectCoverFeaturedImage} src={portfolioItem.poster} alt='Featured' />}
      </div>

      <div className={classes.titleBar}>
        <div>
          <h3 className={classes.projectCoverTitle}>{portfolioItem.title}</h3>
          <span className={classes.projectCoverType}>{portfolioItem.type}</span>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
