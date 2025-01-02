"use client";
import Cursor from "@/Components/Cursor/Cursor";
import Hero from "@/Components/Hero/Hero";
import MainMenu from "@/Components/MainMenu/MainMenu";
import Title from "@/Components/Title/Title";
import VideoSlider from "@/Components/VideoSlider/VideoSlider";
import { useState } from "react";

export default function Home() {
  const [animateSlider, setAnimateSlider] = useState(false);

  const toggleAnimateSlider = () => {
    setAnimateSlider((prev) => !prev);
  };

  return (
    <>
      <Cursor />
      <MainMenu />
      <Title />
      <button onClick={toggleAnimateSlider} style={{ padding: "0.5rem", fontFamily: "Inter", position: "absolute", bottom: "10%", left: "90%", zIndex: 999999 }}>
        Animate Slider
      </button>
      <VideoSlider animateSlider={animateSlider} />
      <Hero animateSlider={animateSlider} />
    </>
  );
}
