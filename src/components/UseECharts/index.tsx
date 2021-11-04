import React, { useEffect } from 'react';
import * as echarts from 'echarts';

function useEChart(
  chartRef: React.MutableRefObject<HTMLElement | any>,
  options: echarts.EChartsOption,
) {
  let myChart: any = null;

  function renderChart() {
    let districtExplorer;
    window.AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer: any) => {
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
    });
    // 获取 ECharts 高德地图组件
    // var amapComponent = myChart.getModel().getComponent('amap');
    // 获取高德地图实例，使用高德地图自带的控件
    // var amap = amapComponent.getAMap();
    // // 添加控件 和高德地图API用法相同
    // amap.addControl(new window.AMap.Scale());
    // amap.addControl(new window.AMap.ToolBar());
  }

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
