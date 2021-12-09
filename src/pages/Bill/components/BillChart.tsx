import useEChart from '@/components/UseECharts';
import { useEventEmitter } from 'ahooks';
import moment from 'moment';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import type { BillChartPorps } from '../type';
import { Card } from 'antd';

const BillChart: React.FC<BillChartPorps> = (props) => {
  const { data } = props;
  const chartRef = useRef(null);
  const renderEcharts$ = useEventEmitter();
  const [total, setTotal] = useState<number>(0);
  const [optionInit, setOptionInit] = useState<echarts.EChartsOption>({
    animationDuration: 1500,
    title: {
      text: '流量趋势(PV)',
      textAlign: 'left',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        data: [],
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        label: {
          show: true,
          position: 'inside',
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
      },
    ],
  });
  useEffect(() => {
    const xTemp: any[] = [];
    const serDataTemp: any[] = [];
    let tempTotal = 0;
    data?.forEach((item) => {
      xTemp.push(moment(item.date).format('YYYY-MM-DD'));
      serDataTemp.push(item.totalConsume);
      tempTotal += +item.totalConsume;
    });
    setTotal(tempTotal);
    optionInit.xAxis.data = xTemp;
    optionInit.series[0].data = serDataTemp;
    setOptionInit({ ...optionInit });
  }, [data]);

  useEChart(chartRef, optionInit, false, renderEcharts$);
  return (
    <>
      <Card>
        <h3>
          总消费：
          <span style={{ color: total > 5500 ? 'red' : 'unset' }}>
            {total}
          </span>{' '}
          元
        </h3>
      </Card>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '500px', marginTop: '20px' }}
      ></div>
    </>
  );
};

export default BillChart;
