import React, { useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { TextureLoader } from "three";

import * as THREE from "three";
import vertex from "../shaders/slideshow/vertex.glsl";
import fragment from "../shaders/slideshow/fragment.glsl";

const PARAMS = {
  offsetAmount: 2.25,
  columnsCount: 3,
};

const SlideShow = ({ slides }) => {
  const videoTextures = useRef([]);

  const loadVideoTextures = () => {
    const loader = new THREE.TextureLoader();
    const textures = slides.map((video, index) => {
      const texture = loader.load(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = "RGBFormat"; // Or 'RGBFormat' if THREE.RGBFormat is not available
      videoTextures.current[index] = texture;
      return texture;
    });
    return textures;
  };

  const textures = useMemo(() => loadVideoTextures(), [slides]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: textures[0] },
        uTexture2: { value: textures[1] }, // Using the first video initially
        uOffsetAmount: { value: PARAMS.offsetAmount },
        uColumnsCount: { value: PARAMS.columnsCount },
        uTransitionProgress: { value: 0 },
        uInputResolution: { value: [16, 9] }, // Assuming slide dimensions
        uOutputResolution: { value: [window.innerWidth, window.innerHeight] },
        uAngle: { value: (45 * Math.PI) / 180 },
        uScale: { value: 3 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
  }, [textures]);

  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      // Update the shader uniforms when slides change
      shaderMaterial.uniforms.uTexture1.value = textures[0];
      shaderMaterial.uniforms.uTexture2.value = textures[0];
    }
  }, [slides, shaderMaterial, textures]);

  return (
    <Canvas>
      <mesh ref={meshRef}>
        <planeGeometry args={[window.innerWidth, window.innerHeight, 1, 1]} />
        <shaderMaterial attach='material' args={[shaderMaterial]} />
      </mesh>
    </Canvas>
  );
};

export default SlideShow;
