import { Suspense } from "react";
import { useAspect } from "@react-three/drei";
import slides from "../slides";
import FallbackMaterial from "./FallbackMaterial";
import CustomVideoMaterial from "./CustomVideoMaterial";

const Scene = () => {
  const size = useAspect(1800, 1000);

  return (
    <mesh scale={size}>
      <planeGeometry />
      <Suspense fallback={<FallbackMaterial url={slides[0].poster} />}>
        <CustomVideoMaterial />
      </Suspense>
    </mesh>
  );
};

export default Scene;
