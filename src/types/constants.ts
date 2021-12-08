import { createFromIconfontCN } from '@ant-design/icons';

export const ICON_URL = '//at.alicdn.com/t/font_2827128_3t87jxevm8o.js';

export const LANGUAGE_MENU = {
  zh: '🇨🇳 简体中文',
  tw: '🇭🇰 繁體中文',
  en: '🇺🇸 English',
  jp: '🇯🇵 日本語',
};

export const IconFont = createFromIconfontCN({
  scriptUrl: ICON_URL,
});
