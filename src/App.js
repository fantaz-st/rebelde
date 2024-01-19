import "./App.css";
import Slider from "./components/Slider/Slider";

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
      <Slider />
    </div>
  );
}
