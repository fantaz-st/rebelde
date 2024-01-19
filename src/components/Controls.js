import { useContext } from "react";
import { SlideContext } from "../context/SlideContext";

const Controls = () => {
  const { setSlide } = useContext(SlideContext);

  return <div onClick={setSlide}>Controls</div>;
};
export default Controls;
