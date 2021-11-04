import ErrorPage from '@/Error';
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
  }

  state: { hasError: boolean; error: any; errorInfo: any } = {
    hasError: false,
    error: '',
    errorInfo: '',
  };

  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error.toString(), JSON.stringify(errorInfo));

    // 你同样可以将错误日志上报给服务器
    // logErrorToMyService(error, errorInfo);
    this.setState({ hasError: true, errorInfo, error });
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      // 你可以自定义降级后的 UI 并渲染
      return <ErrorPage error={error} errorInfo={errorInfo} />;
    }

    return this.props.children;
  }
}
