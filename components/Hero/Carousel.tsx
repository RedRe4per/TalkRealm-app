import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";

import { Autoplay, Pagination, Navigation } from "swiper";

export default function Carousel() {
  const progressCircle = useRef<SVGSVGElement>(null);
  const progressContent = useRef<HTMLSpanElement>(null);
  const onAutoplayTimeLeft = (
    s: SwiperCore,
    time: number,
    progress: number
  ) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty("--progress", `${1 - progress}`);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image
            src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/chris-montgomery-smgTvepind4-unsplash.jpg"
            fill
            alt="img1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/linkedin-sales-solutions-VtKoSy_XzNU-unsplash.jpg"
            fill
            alt="img1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/_111930009_2.medesktop.jpg"
            fill
            alt="img1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/gabriel-benois-qnWPjzewewA-unsplash.jpg"
            fill
            alt="img1"
          />
        </SwiperSlide>
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
}
