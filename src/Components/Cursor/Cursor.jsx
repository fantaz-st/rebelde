import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import classes from "./Cursor.module.css";

export default function Cursor() {
  const cursorRef = useRef(null);

  const [cursorVisible, setCursorVisible] = useState(false);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!cursorVisible) {
        setCursorVisible(true);
        gsap.set(cursorRef.current, {
          x: mouseX.current,
          y: mouseY.current,
        });
        gsap.to(cursorRef.current, { scale: 1, duration: 0.2, ease: "power3.out" });
      }
    };

    const animateCursor = () => {
      cursorX.current += (mouseX.current - cursorX.current) * 0.1; // Smooth movement
      cursorY.current += (mouseY.current - cursorY.current) * 0.1;

      gsap.set(cursorRef.current, {
        x: cursorX.current,
        y: cursorY.current,
      });

      requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animateCursor();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorVisible]);

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (!cursorRef.current) return;
      const target = e.target.closest("[data-cursor-size]"); // Look for the closest parent with the attribute
      if (target) {
        const size = target.dataset.cursorSize;
        const scale = size === "xxl" ? 6 : size === "lg" ? 4 : size === "md" ? 3 : size === "sm" ? 2 : 1;
        gsap.to(cursorRef.current, { scale, duration: 0.25 });
      }
    };

    const handleMouseOut = (e) => {
      if (!cursorRef.current) return;
      const target = e.target.closest("[data-cursor-size]"); // Check if the element leaving had the attribute
      if (target) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.1 }); // Reset scale
      }
    };

    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return <div ref={cursorRef} className={classes.cursor} />;
}
