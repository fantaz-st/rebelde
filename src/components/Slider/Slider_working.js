import gsap from "gsap";
import { Suspense, useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import { TextureLoader } from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useAspect, useVideoTexture } from "@react-three/drei";

import FallbackMaterial from "../FallbackMaterial";

import transparentPixelSrc from "../../img/transparent-pixel.png";
import customVideoShader from "../../shaders";
import slides from "../../slides";
import classes from "./Slider.module.css";

const Mesh = forwardRef((props, ref) => {
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

  useImperativeHandle(ref, () => ({
    transition,
    isTransitioning: isTransitioningRef,
    getCurrentSlide: () => slideIndexRef.current,
  }));

  useEffect(() => {
    setTimeout(() => {
      transition();
    }, 100);
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
});

const Slider = () => {
  const meshRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (!meshRef.current.isTransitioning.current) {
      meshRef.current.transition();
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.slideFooter}>
        <div className={classes.controls}>
          <div className={classes.slideIndex}>
            <p>
              0{currentSlide} <span>|</span> 0{slides.length}{" "}
            </p>
          </div>
          <div className={classes.buttons}>
            <div className={classes.previous}>
              <p>&lt;</p>
            </div>
            <div className={classes.next} onClick={nextSlide}>
              <p>&gt;</p>
            </div>
          </div>
        </div>
      </div>
      <Canvas>
        <Mesh ref={meshRef} />
      </Canvas>
    </div>
  );
};
export default Slider;
