import React from "react";
import { Canvas, useFrame, useSize } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";
import { extend } from "@react-three/fiber";
import vertex from "../../shaders/vertex";
import fragment from "../../shaders/fragment";
import classes from "./Hero.module.css";
import gsap from "gsap";
import { useAnimation } from "@/context/animation-context";

const HeroShaderMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new Vector2(1920, 1080),
    iMouse: new Vector2(0, 0),
    iZoomOffset: 0,
  },
  vertex,
  fragment
);

extend({ HeroShaderMaterial });

const HeroCanvas = () => {
  const shaderRef = React.useRef();
  const { animateHero } = useAnimation();
  const zoomObj = React.useRef({ value: 0 });

  React.useEffect(() => {
    if (animateHero) {
      gsap.to(zoomObj.current, {
        duration: 2,
        value: 1,
        ease: "power1.inOut",
        onUpdate: () => {
          if (shaderRef.current) {
            shaderRef.current.uniforms.iZoomOffset.value = zoomObj.current.value;
          }
        },
      });
    }
  }, [animateHero]);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.iTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <heroShaderMaterial ref={shaderRef} />
    </mesh>
  );
};

const Hero = () => (
  <section className={classes.container}>
    <Canvas>
      <HeroCanvas />
    </Canvas>
  </section>
);

export default Hero;
