import { Result } from 'antd';
import React from 'react';

const ErrorPage: React.FC<{ error?: any; errorInfo?: any }> = (props) => {
  const { error, errorInfo } = props;
  return (
    <>
      <Result
        status="error"
        title={error || ''}
        subTitle={JSON.stringify(errorInfo || {})}
      />
    </>
  );
};

export default ErrorPage;
