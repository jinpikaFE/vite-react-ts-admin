/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_MODE: string;
  // 更多环境变量...
}

interface Window {
  reloadAuthorized: () => void;
  returnCitySN: {
    cip: string;
    cid: string;
    cname: string;
  };
  AMap: any;
  AMapUI: any;
}
