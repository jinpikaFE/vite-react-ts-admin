import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';

function useEChart(
  chartRef: React.MutableRefObject<HTMLElement | any>,
  options: echarts.EChartsOption,
  isMap = false,
  renderEcharts$?: EventEmitter<void>,
) {
  let myChart: any = null;

  function renderChart() {
    if (isMap) {
      let districtExplorer;
      window.AMapUI.loadUI(
        ['geo/DistrictExplorer'],
        (DistrictExplorer: any) => {
          districtExplorer = new DistrictExplorer();
          districtExplorer.loadAreaNode(100000, (error: any, areaNode: any) => {
            const geoData: any = {};
            if (error) {
              console.error(error);
            }

            // areaNode对象执行这个方法返回的geoJSON中的features
            geoData.features = areaNode.getSubFeatures();
            echarts.registerMap('china', { geoJSON: geoData } as any);
            const chart = echarts.getInstanceByDom(chartRef.current);
            if (chart) {
              myChart = chart;
            } else {
              myChart = echarts.init(chartRef.current);
            }
            myChart.setOption(options);
          });
        },
      );
    } else {
      setTimeout(() => {
        const chart = echarts.getInstanceByDom(chartRef.current);
        if (chart) {
          myChart = chart;
        } else {
          myChart = echarts.init(chartRef.current);
        }
        myChart.setOption(options);
      });
    }
  }

  renderEcharts$ &&
    renderEcharts$.useSubscription(() => {
      myChart && myChart.dispose();
      renderChart();
    });

  useEffect(() => {
    renderChart();
  }, [options]);

  useEffect(() => {
    return () => {
      myChart && myChart.dispose();
    };
  }, []);

  return;
}

export default useEChart;
