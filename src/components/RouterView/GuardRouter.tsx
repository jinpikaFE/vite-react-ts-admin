import { creatPv } from '@/services/global';
import { localeMonitor } from '@/stores/monitor';
import { useThrottleFn } from 'ahooks';
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  withRouter,
  useLocation,
} from 'react-router-dom';

const _GuardRouterHelper: React.FC<any> = () => {
  const { pathname } = useLocation();
  const { run } = useThrottleFn(
    async () => {
      // 记录一次
      await creatPv({
        type: 'admin',
        uid: localeMonitor.uvData?.uid,
        ip: localeMonitor.uvData?.ip,
        pathname: localeMonitor.pvData?.pathname,
        startTime: localeMonitor.pvData?.startTime,
        durationVisit:
          new Date().getTime() - localeMonitor.pathStartTime.getTime(),
      });
    },
    { wait: 2000 },
  );
  useEffect(() => {
    if (localeMonitor.pvData?.pathname) {
      run();
    }
    localeMonitor.setPvData({
      uid: localeMonitor.uvData?.uid,
      ip: localeMonitor.uvData?.ip,
      pathname,
      startTime: new Date(),
    });
    localeMonitor.setPathStartTime(new Date());
  }, [pathname]);
  return null;
};

const GuardRouterHelper = withRouter(_GuardRouterHelper);

const GuardRouter: React.FC<any> = (props) => {
  return (
    <Router>
      <GuardRouterHelper />
      {props.children}
    </Router>
  );
};

export default GuardRouter;
