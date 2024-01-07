import { useVideoTexture } from "@react-three/drei";
import { useContext, useEffect, useRef, useState } from "react";
import customVideoShader from "../shaders";
import slides from "../slides";
import gsap from "gsap";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import transparentPixelSrc from "../img/transparent-pixel.png";
import { SlideContext } from "../context/SlideContext";

const CustomVideoMaterial = () => {
  const materialRef = useRef();
  const textures = [useVideoTexture(slides[0].src), useVideoTexture(slides[1].src), useVideoTexture(slides[2].src)];

  const { slideIndexRef } = useContext(SlideContext);

  const transparentPixelTexture = useLoader(TextureLoader, transparentPixelSrc);

  const transition = () => {
    const currentSlideIndex = slideIndexRef.current;
    const nextSlideIndex = (currentSlideIndex + 1) % slides.length;

    const tl = gsap.timeline({
      onUpdate: () => {
        materialRef.current.uniforms.uTransitionProgress.value = tl.progress();
      },
      onComplete: () => {
        materialRef.current.uniforms.uTransitionProgress.value = 0;
        materialRef.current.uniforms.uTexture1.value = textures[currentSlideIndex];
        materialRef.current.uniforms.uTexture2.value = textures[nextSlideIndex];
        slideIndexRef.current = nextSlideIndex;
      },
    });

    tl.to(materialRef.current.uniforms.uTransitionProgress, {
      value: 1,
      duration: 1.5,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    setTimeout(() => {
      transition();
    }, 100);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const interval = setInterval(() => {
      if (isMounted) {
        transition();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const uniforms = {
    uTexture1: { value: transparentPixelTexture },
    uTexture2: { value: textures[0] },
    uOffsetAmount: { value: 2.25 },
    uColumnsCount: { value: 3 },
    uTransitionProgress: { value: 1 },
    uInputResolution: { value: [16, 9] },
    uOutputResolution: { value: [16, 9] },
    uAngle: { value: (45 * Math.PI) / 180 },
    uScale: { value: 3 },
  };

  return <shaderMaterial ref={materialRef} attach='material' args={[customVideoShader]} uniforms={uniforms} toneMapped={false} />;
};

export default CustomVideoMaterial;
