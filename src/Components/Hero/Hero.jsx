import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import { Vector2 } from "three";
import { extend } from "@react-three/fiber";
import vertex from "../../shaders/vertex";
import fragment from "../../shaders/fragment";
import classes from "./Hero.module.css";
import gsap from "gsap";

// HeroShaderMaterial initialization
let HeroShaderMaterial = null;

if (typeof window !== "undefined") {
  HeroShaderMaterial = shaderMaterial(
    {
      iTime: 0,
      iResolution: new Vector2(window.innerWidth, window.innerHeight),
      iMouse: new Vector2(0, 0),
      iZoomOffset: 0,
      iInitialXOffset: 0,
      iPortfolioScrollPercentage: 0,
    },
    vertex,
    fragment
  );

  extend({ HeroShaderMaterial });
}

const HeroCanvas = ({ animateSlider }) => {
  const zoomObj = useRef({ value: 0 });
  const [zoomOffset, setZoomOffset] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const shaderRef = useRef();
  const rawMouse = useRef(new Vector2(0, 0));
  const smoothedMouse = useRef(new Vector2(0, 0));

  const wormhole = () => {
    setIsZoomed((prev) => !prev);
    gsap.to(zoomObj.current, {
      duration: 2,
      value: isZoomed ? 0 : 1,
      ease: "power1.inOut",
      onUpdate: () => {
        setZoomOffset(zoomObj.current.value);
      },
    });
  };

  useEffect(() => {
    if (animateSlider) {
      wormhole();
    }
  }, [animateSlider]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const normalizedX = e.clientX / window.innerWidth;
      const normalizedY = 1 - e.clientY / window.innerHeight;
      rawMouse.current.set(normalizedX, normalizedY);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (!shaderRef.current) return;

    shaderRef.current.uniforms.iTime.value = state.clock.getElapsedTime();

    const lerpFactor = 0.08;
    smoothedMouse.current.x += (rawMouse.current.x - smoothedMouse.current.x) * lerpFactor;
    smoothedMouse.current.y += (rawMouse.current.y - smoothedMouse.current.y) * lerpFactor;

    shaderRef.current.uniforms.iMouse.value = smoothedMouse.current;

    shaderRef.current.uniforms.iZoomOffset.value = zoomOffset;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {HeroShaderMaterial && <heroShaderMaterial ref={shaderRef} />}
    </mesh>
  );
};

const Hero = ({ animateSlider }) => {
  return (
    <section className={classes.container}>
      <div className={classes.canvas}>
        <Canvas>
          <HeroCanvas animateSlider={animateSlider} />
        </Canvas>
      </div>
    </section>
  );
};

export default Hero;
