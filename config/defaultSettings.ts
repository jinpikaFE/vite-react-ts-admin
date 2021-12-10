import { ICON_URL } from '@/types/constants';
import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
  logo: string;
};

const proSettings: DefaultSettings = {
  logo: '/src/assets/logo.png',
  // 拂晓蓝
  primaryColor: '#4569D4',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Jin Pi Ka',
  pwa: false,
  iconfontUrl: ICON_URL,
};

export type { DefaultSettings };

export default proSettings;
