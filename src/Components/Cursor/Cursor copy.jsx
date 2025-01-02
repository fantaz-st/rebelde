import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Cursor.module.css";

export default function Cursor() {
  // Reference to the cursor <div>
  const cursorRef = useRef(null);

  // Visibility: hidden until the user moves the mouse
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  // Raw mouse positions
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Lerped positions
  const outputX = useRef(0);
  const outputY = useRef(0);

  // === 1) Track Mouse Movement & Show Cursor on First Move ===
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!isCursorVisible) setIsCursorVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isCursorVisible]);

  // === 2) Smooth Cursor Movement via GSAP Ticker ===
  useEffect(() => {
    const updateCursor = () => {
      // ~30% ease each frame
      const dt = 1 - Math.pow(1 - 0.3, gsap.ticker.deltaRatio());

      // Lerp from current output -> raw mouse
      outputX.current += (mouseX.current - outputX.current) * dt;
      outputY.current += (mouseY.current - outputY.current) * dt;

      // Update the DOM element's transform
      if (cursorRef.current) {
        // Combine translate & existing scale from GSAP
        cursorRef.current.style.transform = `translate(${outputX.current}px, ${outputY.current}px) ${cursorRef.current.style.transform.replace(/translate\([^)]+\)/, "")}`;
      }
    };

    gsap.ticker.add(updateCursor);
    return () => gsap.ticker.remove(updateCursor);
  }, []);

  // === 3) Handle MouseOver/MouseOut for .mouse-lg, etc. ===
  useEffect(() => {
    const handleMouseOver = (e) => {
      if (!cursorRef.current) return;
      if (e.target.classList.contains("mouse-lg")) {
        gsap.to(cursorRef.current, { scale: 3.5, duration: 0.2 });
      } else if (e.target.classList.contains("mouse-md")) {
        gsap.to(cursorRef.current, { scale: 2, duration: 0.2 });
      } else if (e.target.classList.contains("mouse-sm")) {
        gsap.to(cursorRef.current, { scale: 1.5, duration: 0.2 });
      }
    };

    const handleMouseOut = (e) => {
      if (!cursorRef.current) return;
      if (e.target.classList.contains("mouse-lg") || e.target.classList.contains("mouse-md") || e.target.classList.contains("mouse-sm")) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.05 });
      }
    };

    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const combinedClasses = [styles.cursor, !isCursorVisible && styles.cursorHidden].filter(Boolean).join(" ");

  return <div ref={cursorRef} className={combinedClasses} style={{ transform: "translate(0px, 0px) scale(1)" }} />;
}
