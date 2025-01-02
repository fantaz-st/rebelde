import classes from "./SwiperVideoSlider.module.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles

import slides from "./slides";
import VideoCard from "../VideoCard/VideoCard";
import { Autoplay, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const SwiperVideoSlider = () => {
  return (
    <div className={classes.container}>
      <div className={classes.slider}>
        <Swiper
          slidesPerView={2.3}
          spaceBetween={30}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Mousewheel, FreeMode]}
          freeMode={true}
          mousewheel={{
            enabled: true,
            releaseOnEdges: true,
            forceToAxis: true,
          }}
          className='mySwiper'
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <VideoCard portfolioItem={slide} index={slide.id} />
              {/* <div className={classes.card}>
                <div className={classes.card__info}>
                  <h3>{slide.title}</h3>
                  <p>{slide.type}</p>
                </div>
                <video src={slide.video} autoPlay loop muted playsInline />
              </div> */}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperVideoSlider;
