import React, { createContext, useEffect, useRef, useState } from "react";
import slides from "../slides";

export const SlideContext = createContext();

export const SlideProvider = ({ children }) => {
  const slideIndexRef = useRef(0);

  return <SlideContext.Provider value={{ slideIndexRef }}>{children}</SlideContext.Provider>;
};
