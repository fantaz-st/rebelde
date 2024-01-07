import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./App.css";
import { SlideProvider } from "./context/SlideContext";

export default function App() {
  return (
    <div className='app'>
      <div className='header'>
        <div className='logo'>
          <h3>REBELDE</h3>
        </div>
        <div className='button'>
          <p>CONTACT US</p>
        </div>
      </div>
      <SlideProvider>
        <div className='slider'>
          <Canvas>
            <Scene />
          </Canvas>
        </div>
      </SlideProvider>
      {/* <div className='controls'>
        <div className='next'>Next slide</div>
      </div> */}
    </div>
  );
}
