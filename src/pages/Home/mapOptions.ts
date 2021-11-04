import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

const geoCoordMap = {
  北京市: [116.405289, 39.904987],
  天津市: [117.190186, 39.125595],
  河北省: [114.502464, 38.045475],
  山西省: [112.549248, 37.857014],
  内蒙古自治区: [111.75199, 40.84149],
  辽宁省: [123.429092, 41.796768],
  吉林省: [125.324501, 43.886841],
  黑龙江省: [126.642464, 45.756966],
  上海市: [121.472641, 31.231707],
  江苏省: [118.76741, 32.041546],
  浙江省: [120.15358, 30.287458],
  安徽省: [117.283043, 31.861191],
  福建省: [119.306236, 26.075302],
  江西省: [115.892151, 28.676493],
  山东省: [117.000923, 36.675808],
  河南省: [113.665413, 34.757977],
  湖北省: [114.298569, 30.584354],
  湖南省: [112.982277, 28.19409],
  广东省: [113.28064, 23.125177],
  广西壮族自治区: [108.320007, 22.82402],
  海南省: [110.19989, 20.04422],
  重庆市: [106.504959, 29.533155],
  四川省: [104.065735, 30.659462],
  贵州省: [106.713478, 26.578342],
  云南省: [102.71225, 25.040609],
  西藏自治区: [91.1145, 29.64415],
  陕西省: [108.948021, 34.263161],
  甘肃省: [103.83417, 36.06138],
  青海省: [101.77782, 36.61729],
  宁夏回族自治区: [106.23248, 38.48644],
  新疆维吾尔自治区: [87.61688, 43.82663],
  香港特别行政区: [114.16546, 22.27534],
  澳门特别行政区: [113.54913, 22.19875],
} as any;

export const mapOptions = (
  data: { name: string; value: number }[],
): EChartsOption => {
  const convertData = function (data: { name: string; value: number }[]) {
    const res = [];
    for (let i = 0; i < data?.length; i++) {
      const geoCoord = geoCoordMap?.[data?.[i]?.name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
        });
      }
    }
    return res;
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
        data: convertData(data),
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
