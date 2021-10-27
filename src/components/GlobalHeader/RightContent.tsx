import { Tooltip, Dropdown, Menu } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import {
  QuestionCircleOutlined,
} from '@ant-design/icons';
import React from 'react';
import HeaderSearch from '../HeaderSearch';
import styles from './index.module.less';
import { IconFont, LANGUAGE_MENU } from '@/types/constants';
import { Observer } from 'mobx-react';
import { localeLanguage } from '@/stores/language';
import { Link } from 'react-router-dom';
import AvatarDropdown from './AvatarDropdown';
import FullScreen from '../FullScreen.tsx';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
} & Partial<ProSettings>;


const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const onClickMenu = ({ key }: any) => {
    localeLanguage.setLocaleLang(key);
  };

  const menu = (
    <Observer>
      {() => (
        <Menu
          defaultSelectedKeys={[localeLanguage?.localeLang]}
          onClick={onClickMenu}
        >
          {Object.keys(LANGUAGE_MENU).map((item) => (
            <Menu.Item key={item}>{(LANGUAGE_MENU as any)[item]}</Menu.Item>
          ))}
        </Menu>
      )}
    </Observer>
  );

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Site Search"
        defaultValue="Home"
        options={[
          {
            label: <Link to="/home">Home</Link>,
            value: 'Home',
          },
          {
            label: <a href="https://pro.ant.design/zh-CN/">Ant Design Pro</a>,
            value: 'Ant Design Pro',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   //console.log('input', value);
        // }}
      />
      <Tooltip title="Use documentation">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <FullScreen />
      <AvatarDropdown />
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        className={styles.action}
      >
        <IconFont type="icon-wenben" />
      </Dropdown>
    </div>
  );
};

export default GlobalHeaderRight;
