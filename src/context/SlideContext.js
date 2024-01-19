import React, { createContext, useEffect, useRef, useState } from "react";
import slides from "../slides";

export const SlideContext = createContext();

export const SlideProvider = ({ children }) => {
  let slideIndexRef = useRef(0);
  let nextSlideIndex = 1;

  const setSlide = (next) => {
    console.log(nextSlideIndex);
    nextSlideIndex = (slideIndexRef.current + 1) % slides.length;

    slideIndexRef.current = (slideIndexRef.current + 1) % slides.length;
  };

  return <SlideContext.Provider value={{ slideIndexRef, setSlide, nextSlideIndex }}>{children}</SlideContext.Provider>;
};
