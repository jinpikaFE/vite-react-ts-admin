import ProCard from '@ant-design/pro-card';
import { Button, Select, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import RcResizeObserver from 'rc-resize-observer';
import Maps from './maps';
import { findPvAll, findUvAll } from './services';
import type { GlobalType, PvStatisticsType, UvStatisticsType } from './type';
import moment from 'moment';

const { Option } = Select;

const Home: React.FC = () => {
  const [responsive, setResponsive] = useState(false);
  const [uvStatistics, setUvStatistics] = useState<UvStatisticsType>();
  const [pvStatistics, setPvStatistics] = useState<PvStatisticsType>();
  const history = useHistory();

  const [globalType, setGlobalType] = useState<GlobalType>('all');

  useEffect(() => {
    const getData = async () => {
      const resUv = await findUvAll({ type: globalType });
      const resPv = await findPvAll({ type: globalType });
      setUvStatistics(resUv?.data);
      setPvStatistics(resPv?.data);
    };
    getData();
  }, [globalType]);

  const onSelect = (val: GlobalType) => {
    setGlobalType(val);
  };

  return (
    <>
      <ProCard>
        <Button
          onClick={() => {
            history.push('/manager/menu');
          }}
        >
          菜单管理
        </Button>
        <Select
          defaultValue="all"
          style={{ width: 150, marginLeft: 20 }}
          onSelect={onSelect}
        >
          <Option value="all">全部</Option>
          <Option value="admin">金皮卡后台(admin)</Option>
          <Option value="blog">个人博客(blog)</Option>
        </Select>
      </ProCard>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard
          style={{ marginTop: 8 }}
          ghost
          gutter={8}
          split={responsive ? 'horizontal' : 'vertical'}
        >
          <ProCard
            split="horizontal"
            colSpan={{ xs: 24, sm: 12, md: 12, lg: 10, xl: 10 }}
          >
            <ProCard split="horizontal">
              <ProCard split={responsive ? 'horizontal' : 'vertical'}>
                <ProCard title="总访问量(UV)">
                  <Statistic value={uvStatistics?.uvTotal || 0} />
                </ProCard>
                <ProCard title="总流量(PV)">
                  <Statistic value={pvStatistics?.pvTotal || 0} />
                </ProCard>
              </ProCard>
              <ProCard split={responsive ? 'horizontal' : 'vertical'}>
                <ProCard title="昨日全部流量(PV)">
                  {pvStatistics?.pvLastDay || 0}
                </ProCard>
                <ProCard title="本月累计流量(PV)">
                  {pvStatistics?.pvThisMonth || 0}
                </ProCard>
                <ProCard title="今年累计流量(PV)">
                  {pvStatistics?.pvThisYear || 0}
                </ProCard>
              </ProCard>
              <ProCard split="vertical">
                <ProCard title="历史峰值(PV)">
                  <Statistic value={pvStatistics?.pvPeak || 0} />
                </ProCard>
                <ProCard title="平均访问时长(UV)">
                  {uvStatistics?.uvAverageTime
                    ? moment(Number(uvStatistics?.uvAverageTime)).format(
                        'hh:mm:ss',
                      )
                    : '00:00:00'}
                </ProCard>
              </ProCard>
            </ProCard>
            <ProCard title="流量趋势">
              <div>图表</div>
              <div>图表</div>
              <div>图表</div>
              <div>图表</div>
              <div>图表</div>
            </ProCard>
          </ProCard>
          <ProCard title="地域分布情况">
            <Maps globalType={globalType} />
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </>
  );
};

export default Home;
