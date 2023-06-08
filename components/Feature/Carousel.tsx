import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";

import { EffectCube, Pagination, Autoplay } from "swiper";

export default function Carousel() {
  return (
    <>
      <Swiper
        effect={"cube"}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        pagination={true}
        modules={[EffectCube, Pagination, Autoplay]}
        autoplay={{ delay: 3000 }}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/123.jpg" fill alt="img1"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/321.jpg" fill alt="img1"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/1234.jpg" fill alt="img1"/>
        </SwiperSlide>
        <SwiperSlide>
        <Image src="https://my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com/web-development/3211.jpg" fill alt="img1"/>
        </SwiperSlide>
      </Swiper>
    </>
  );
}