import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Spin } from 'antd';
import { Observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { localeLogin } from '@/stores/login';
import styles from './index.module.less';
import { AvatarDropdownPropsType } from './type';
import { useHistory } from 'react-router';

const AvatarDropdown: React.FC<AvatarDropdownPropsType> = ({ menu = true }) => {
  const history = useHistory();

  const onMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      localeLogin.logout();
      history.push(`/login`);
    } else {
      history.push(`/account/${key}`);
    }
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const currentUser = localeLogin.currentUser;

  return (
    <Observer>
      {() => {
        return currentUser && currentUser?.userName ? (
          <Dropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser?.avatar?.[0]?.url}
                alt="avatar"
              />
              <span className={`${styles.name} anticon`}>
                {currentUser?.userName}
              </span>
            </span>
          </Dropdown>
        ) : (
          <span className={`${styles.action} ${styles.account}`}>
            <Spin
              size="small"
              style={{
                marginLeft: 8,
                marginRight: 8,
              }}
            />
          </span>
        );
      }}
    </Observer>
  );
};

export default AvatarDropdown;
// const AvatarDropdown: React.FC<AvatarDropdownPropsType> = ({ onMenuClick, menu=true }) => {

//   return (
//     <div>2</div>
//   );
// };

// export default AvatarDropdown;
