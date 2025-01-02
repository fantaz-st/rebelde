import React, { useState, useEffect } from "react";
import styles from "./MainMenu.module.css";

const MainMenu = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(0); // Default to 0
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth > 0) {
      // Ensure windowWidth is valid
      const shouldOpenNav = mousePosition.y < 300 && mousePosition.x > Math.min(windowWidth / 2, windowWidth - 800);

      setIsNavOpen(shouldOpenNav);
    }
  }, [mousePosition, windowWidth]);

  return (
    <div className={`${styles.navContainer} ${isNavOpen ? styles.navContainerOpen : ""}`}>
      <div className={styles.navIcon}>
        <div className={styles.navIconLine}></div>
        <div className={styles.navIconLine}></div>
        <div className={styles.navIconLine}></div>
      </div>
      <nav className={styles.navLinks}>
        <a href='/about' data-cursor-size='lg'>
          About
        </a>
        <a href='/explore' data-cursor-size='lg'>
          Explore
        </a>
        <a href='/contact' data-cursor-size='lg'>
          Contact
        </a>
      </nav>
    </div>
  );
};

export default MainMenu;
