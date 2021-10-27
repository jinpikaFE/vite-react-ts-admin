import { IconFont } from '@/types/constants';
import { Tooltip } from 'antd';
import React, { Component } from 'react';
import styles from '../GlobalHeader/index.module.less';

class FullScreen extends Component {
  constructor(props: any) {
    super(props);
  }
  state: any = {
    isFullScreen: false,
  };
  componentDidMount() {
    // 监听页面全屏事件
    window.onresize = () => {
      // 全屏
      if (document.fullscreenElement) {
        this.setState({ isFullScreen: true });
      }
      // 不是全屏
      else {
        this.setState({ isFullScreen: false });
      }
    };
  }

  // 全屏
  fullScreen = () => {
    if (!this.state.isFullScreen) {
      document.documentElement?.requestFullscreen();
    }
  };

  // 退出全屏
  exitFullScreen = () => {
    document.exitFullscreen();
  };

  render() {
    const { isFullScreen } = this.state;
    return (
      <Tooltip title={isFullScreen ? '退出全屏' : '全屏'}>
        <a
          className={`${styles.action}`}
          onClick={isFullScreen ? this.exitFullScreen : this.fullScreen}
        >
          {/* 全屏的时候显示 退出全屏按钮，非全屏的时候显示 全屏按钮 */}
          {isFullScreen ? (
            <IconFont type="icon-exitFullScreen" />
          ) : (
            <IconFont type="icon-fullScreen" />
          )}
        </a>
      </Tooltip>
    );
  }
}

export default FullScreen;
