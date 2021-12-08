import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

export const mapOptions = (
  data: { name: string; value: number }[],
): EChartsOption => {
  const getAddres = (addressName: string) => {
    const tempArr = [];
    for (let index = 0; index < ['省', '市', '区'].length; index++) {
      const element = ['省', '市', '区'][index];

      if (addressName.includes(element)) {
        tempArr.push(element);
      }
    }
    return tempArr;
  };

  const getData = (res: { name: string; value: number }[]) => {
    const newRes = res?.map((item) => {
      const newName = item.name.split(/省|市|区/)[0] + getAddres(item.name)[0];
      return { name: newName, value: item.value };
    });

    const obj: any = {};
    const newarr: any[] = [];
    newRes.map((item) => {
      if (obj[item.name]) {
        newarr.map((node) => {
          if (item.name == node.name) {
            node.value += item.value;
          }
        });
      } else {
        obj[item.name] = 1;
        newarr.push(item);
      }
    });
    return newarr;
  };

  return {
    // 加载 amap 组件
    // amap: {
    //   // 3D模式，无论你使用的是1.x版本还是2.x版本，都建议开启此项以获得更好的渲染体验
    //   viewMode: '3D',
    //   // 高德地图中心经纬度
    //   center: [108.39, 39.9],
    //   // 高德地图缩放
    //   zoom: 4,
    //   // 启用resize
    //   resizeEnable: true,
    //   // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
    //   renderOnMoving: true,
    //   // 自定义地图样式主题
    //   mapStyle: 'amap://styles/whitesmoke',
    //   // ECharts 图层的 zIndex 默认 2000
    //   // 从 v1.9.0 起 此配置项已被弃用 请使用 `echartsLayerInteractive` 代替
    //   echartsLayerZIndex: 2019,
    //   // 设置 ECharts 图层是否可交互 默认为 true
    //   // 设置为 false 可实现高德地图自身图层交互
    //   // 此配置项从 v1.9.0 起开始支持
    //   echartsLayerInteractive: true,
    //   // 是否启用大数据模式 默认为 false
    //   // 此配置项从 v1.9.0 起开始支持
    //   largeMode: false,
    //   // 说明：如果想要添加卫星、路网等图层
    //   // 暂时先不要使用layers配置，因为存在Bug
    //   // 建议使用amap.add的方式，使用方式参见最下方代码
    // },
    title: {
      text: '地域分布(UV)',
      left: 'left',
      textStyle: {
        color: '#000',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    toolbox: {
      show: true,
      //orient: 'vertical',
      left: 'right',
      top: 'top',
      feature: {
        dataView: { readOnly: false },
        saveAsImage: {},
      },
    },
    animation: true,
    visualMap: {
      left: 'right',
      min: 0,
      max: 30,
      inRange: {
        color: ['#f2f2f2', 'yellow', 'orangered', 'red'],
      },
      text: ['High', 'Low'],
      calculable: true,
    },
    series: [
      {
        name: 'UV',
        type: 'map',
        color: 'data',
        zoom: 2,
        roam: true,
        map: 'china',
        data: getData(data),
        // symbolSize: function (val) {
        //   return val[2] < 5 ? val[2] * 3 : val[2];
        // },
        encode: {
          value: 2,
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
      },
    ],
  };
};
