import React from 'react';
import { Image } from 'antd';

const Loading: React.FC<{ imgUrl?: string }> = (props) => {
  const { imgUrl } = props;
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Image
        src={imgUrl}
        width="100%"
        style={{
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        preview={false}
      />
    </div>
  );
};

Loading.defaultProps = {
  imgUrl: '/src/assets/loading.gif',
};

export default Loading;
