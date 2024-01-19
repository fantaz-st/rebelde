import { Canvas, useLoader, useThree } from "@react-three/fiber";
import slides from "../../slides";
import { useAspect, useVideoTexture } from "@react-three/drei";
import FallbackMaterial from "../FallbackMaterial";
import { Suspense, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import transparentPixelSrc from "../../img/transparent-pixel.png";

import classes from "./Slider.module.css";
import { TextureLoader } from "three";
import gsap from "gsap";
import customVideoShader from "../../shaders";

const Mesh = () => {
  const viewport = useThree((state) => state.viewport);
  const size = useAspect(viewport.width, viewport.height);

  const materialRef = useRef();
  const textures = [useVideoTexture(slides[0].src), useVideoTexture(slides[1].src), useVideoTexture(slides[2].src)];

  const slideIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const transparentPixelTexture = useLoader(TextureLoader, transparentPixelSrc);

  const transition = () => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    const currentSlideIndex = slideIndexRef.current;
    const nextSlideIndex = (currentSlideIndex + 1) % slides.length;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onUpdate: () => {
          materialRef.current.uniforms.uTransitionProgress.value = tl.progress();
        },
        onComplete: () => {
          materialRef.current.uniforms.uTransitionProgress.value = 0;
          materialRef.current.uniforms.uTexture1.value = textures[currentSlideIndex];
          materialRef.current.uniforms.uTexture2.value = textures[nextSlideIndex];
          slideIndexRef.current = nextSlideIndex;
          isTransitioningRef.current = false;
        },
      });

      tl.to(materialRef.current.uniforms.uTransitionProgress, {
        value: 1,
        duration: 1.5,
        ease: "power2.out",
      });
    }, materialRef);

    return () => ctx.revert();
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
    uOutputResolution: { value: size.slice(0, 2) },
    uAngle: { value: (45 * Math.PI) / 180 },
    uScale: { value: 3 },
  };
  return (
    <mesh scale={size}>
      <planeGeometry />
      <Suspense fallback={<FallbackMaterial url={slides[0].poster} />}>
        <shaderMaterial ref={materialRef} attach='material' args={[customVideoShader]} uniforms={uniforms} toneMapped={false} />
      </Suspense>
    </mesh>
  );
};

const Slider = () => {
  const nextSlide = () => {};

  return (
    <div className={classes.container}>
      <div className={classes.slideFooter}>
        <div className={classes.controls}>
          <div className={classes.slideIndex}>
            <p>
              0 <span>|</span> 0{slides.length}
            </p>
          </div>
          <div className={classes.buttons}>
            <div className={classes.previous}>
              <p>prev</p>
            </div>
            <div className={classes.next} onClick={nextSlide}>
              <p>next</p>
            </div>
          </div>
        </div>
      </div>
      <Canvas>
        <Mesh />
      </Canvas>
    </div>
  );
};
export default Slider;
