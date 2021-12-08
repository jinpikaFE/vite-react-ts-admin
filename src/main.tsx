import React from 'react';
import ReactDOM from 'react-dom';
import RouterView from '@/components/RouterView';
import 'antd/dist/antd.less';
import './index.less';
import { IntlProvider } from 'react-intl-hooks';
import locale_en from './locales/en-US';
import locale_cn from './locales/zh-CN';
import locale_id from './locales/id-ID';
import locale_jp from './locales/ja-JP';
import locale_br from './locales/pt-BR';
import locale_tw from './locales/zh-TW';

import { localeLanguage } from '@/stores/language';
import { localeMonitor } from '@/stores/monitor';
import { Observer } from 'mobx-react';
import { cookie } from './utils/untils';
import { nanoid } from 'nanoid';
// import ErrorBoundary from './components/ErrorBoundary';
import { creatPv, creatUv } from './services/global';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ErrorPage from './Error';

Sentry.init({
  dsn: 'https://56c62c25b8ad428a9ed612837497a92b@o1074927.ingest.sentry.io/6076409',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const data = {
  zh: locale_cn,
  en: locale_en,
  id: locale_id,
  jp: locale_jp,
  br: locale_br,
  tw: locale_tw,
};

const language = navigator.language.split(/[-_]/)[0];

if (!cookie.getCookie('uid')) {
  cookie.setCookie('uid', nanoid());
}
const uvData = {
  uid: cookie.getCookie('uid'),
  ip: window.returnCitySN.cip,
  address: window.returnCitySN.cname,
  startTime: new Date(),
};
// localeMonitor.setUvData({ uid: '' });
localeMonitor.setUvData(uvData);
window.onunload = async () => {
  if (cookie.getCookie('uid') === localeMonitor?.uvData?.uid) {
    localeMonitor.setUvData({
      endTime: new Date(),
      durationVisit:
        new Date().getTime() -
        (localeMonitor?.uvData?.startTime?.getTime() || new Date().getTime()),
    });
    localStorage.test = JSON.stringify(localeMonitor.uvData);
    // 记录一一次访问记录
    if (localStorage.currentUser) {
      creatUv({
        ...localeMonitor.uvData,
        uid: localeMonitor?.uvData?.uid,
        userName: JSON.parse(localStorage?.currentUser)?.userName,
      });
    }
    // 离开时记录一次
    const pvData = {
      ...localeMonitor.pvData,
      durationVisit:
        new Date().getTime() - localeMonitor.pathStartTime.getTime(),
    };
    creatPv(pvData);
  }
};

window.onerror = (message, source, line, col) => {
  console.log(message, source, line, col);
};

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={(error) => <ErrorPage error={error} />}>
    <Observer>
      {() => (
        <IntlProvider
          locale={language}
          messages={(data as any)?.[localeLanguage?.localeLang || language]}
          defaultLocale="zh"
        >
          <RouterView />
        </IntlProvider>
      )}
    </Observer>
  </Sentry.ErrorBoundary>,
  document.getElementById('root'),
);
