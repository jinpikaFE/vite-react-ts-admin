import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import SwiperCore, {
  Scrollbar,
  Navigation,
  Mousewheel,
  Keyboard,
  Autoplay,
} from 'swiper';
import useEChart from '@/components/UseECharts';
import { useEventEmitter } from 'ahooks';
import { Radio, RadioChangeEvent } from 'antd';

SwiperCore.use([Scrollbar, Navigation, Mousewheel, Keyboard, Autoplay]);

type dateSelectValType = 'day' | 'week' | 'month' | 'year';

const Banner: React.FC = () => {
  const [dateSelectVal, setDateSelectVal] = useState<dateSelectValType>();
  const linePvRef = useRef(null);
  const lineUvRef = useRef(null);
  const renderEcharts$ = useEventEmitter();

  const eventScroll = () =>
    onScroll({
      activeClassName: 'swiper-content',
      cb: () => {
        renderEcharts$.emit();
        setTimeout(() => {
          window.removeEventListener('scroll', eventScroll);
        }, 100);
      },
      offset: -100,
    });

  // 监听滚动
  const onScroll = (obj: {
    activeClassName: string;
    offset: number;
    dom?: typeof window;
    cb: () => void;
  }): void => {
    const { activeClassName, offset = 10, dom = window, cb } = obj;
    const slideItems = document.querySelectorAll(`.${activeClassName}`);

    slideItems.forEach((item: any) => {
      const slideBCR = item.getBoundingClientRect();
      // 进入视区或在视区之上
      if (slideBCR.top <= dom.innerHeight + offset) {
        cb();
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', eventScroll);

    return () => {
      window.removeEventListener('scroll', eventScroll);
    };
  }, []);

  const [optionInit, setOptionInit] = useState<echarts.EChartsOption>({
    animationDuration: 1500,
    title: {
      text: '流量趋势(PV)',
      textAlign: 'left',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  });

  const options = [
    { label: '一天', value: 'day' },
    { label: '一周', value: 'week' },
    { label: '一个月', value: 'month' },
    { label: '一年', value: 'year' },
  ];

  useEChart(linePvRef, optionInit, false, renderEcharts$);
  useEChart(
    lineUvRef,
    {
      ...optionInit,
      title: {
        text: '访问趋势(UV)',
        textAlign: 'left',
      },
      series: [
        {
          data: [300, 170, 68, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    },
    false,
    renderEcharts$,
  );

  const dateSelectChange = (e: RadioChangeEvent) => {
    setDateSelectVal(e.target.value);
  };

  return (
    <>
      <Radio.Group
        options={options}
        onChange={dateSelectChange}
        value={dateSelectVal}
        defaultValue="week"
        optionType="button"
        buttonStyle="solid"
        style={{ marginBottom: '10px' }}
      />
      <Swiper
        scrollbar={{
          hide: true,
        }}
        // loop
        autoplay={{ delay: 10000 }}
        navigation
        mousewheel
        keyboard
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        className="swiper-content"
      >
        <SwiperSlide style={{ height: '300px' }}>
          <div ref={linePvRef} style={{ width: '100%', height: '100%' }}></div>
        </SwiperSlide>
        <SwiperSlide style={{ height: '300px' }}>
          <div ref={lineUvRef} style={{ width: '100%', height: '100%' }}></div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Banner;
