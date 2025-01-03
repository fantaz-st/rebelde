"use client";
import Cursor from "@/Components/Cursor/Cursor";
import Hero from "@/Components/Hero/Hero";
import HorizontalSlides from "@/Components/HorizontalSlides/HorizontalSlides";
import MainMenu from "@/Components/MainMenu/MainMenu";
import Title from "@/Components/Title/Title";
import { AnimationProvider } from "@/context/animation-context";

export default function Home() {
  return (
    <AnimationProvider>
      <Cursor />
      <MainMenu />
      <Title />
      <HorizontalSlides />
      <Hero />
    </AnimationProvider>
  );
}
