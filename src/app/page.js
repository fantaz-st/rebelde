"use client";
import Cursor from "@/Components/Cursor/Cursor";
import Hero from "@/Components/Hero/Hero";
import HorizontalSlides from "@/Components/HorizontalSlides/HorizontalSlides";
import MainMenu from "@/Components/MainMenu/MainMenu";
import Title from "@/Components/Title/Title";
import { AnimationProvider, useAnimation } from "@/context/animation-context";

const HomeContent = () => {
  const { triggerAnimations } = useAnimation();

  return (
    <>
      <Cursor />
      <MainMenu />
      <Title />
      <button
        onClick={triggerAnimations}
        style={{
          padding: "0.5rem",
          fontFamily: "Inter",
          position: "absolute",
          bottom: "10%",
          left: "90%",
          zIndex: 999999,
        }}
      >
        Animate Slider
      </button>
      <HorizontalSlides />
      <Hero />
    </>
  );
};

export default function Home() {
  return (
    <AnimationProvider>
      <HomeContent />
    </AnimationProvider>
  );
}
