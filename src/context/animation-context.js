"use client";

import { createContext, useState, useContext, useCallback } from "react";

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [animateHero, setAnimateHero] = useState(false);
  const [animateSlider, setAnimateSlider] = useState(false);

  const triggerAnimations = useCallback(() => {
    setAnimateHero(true);
    setTimeout(() => {
      setAnimateSlider(true);
    }, 2000); // Adjust delay to sync with the hero animation duration
  }, []);

  return <AnimationContext.Provider value={{ animateHero, animateSlider, triggerAnimations }}>{children}</AnimationContext.Provider>;
};

export const useAnimation = () => useContext(AnimationContext);
