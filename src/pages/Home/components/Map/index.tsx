import React, { useEffect, useRef, useState } from 'react';
import 'echarts-extension-amap';
import useEChart from '@/components/UseECharts';
import { mapOptions } from './mapOptions';
import { findUvMaps } from '../../services';
import { useInterval, useUnmount } from 'ahooks';
import { GlobalType } from '../../type';

const Maps: React.FC<{ globalType: GlobalType }> = (props) => {
  const { globalType } = props;
  const chartRef = useRef(null);
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [interval, setInterval] = useState<number | null>(900000);

  const getDate = async () => {
    const res = await findUvMaps(globalType);
    setData(res.data);
  };

  useEffect(() => {
    getDate();
  }, [globalType]);

  useInterval(() => {
    getDate();
  }, interval);

  useUnmount(() => {
    setInterval(null);
  });

  useEChart(chartRef, mapOptions(data), true);

  return (
    <>
      <div style={{ width: '100%', height: '450px' }} ref={chartRef} />
    </>
  );
};

export default Maps;
