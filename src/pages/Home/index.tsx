import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

const Home: React.FC = () => {
  const history = useHistory();
  return (
    <>
      <ProCard>
        Home{' '}
        <Button
          onClick={() => {
            history.push('/manager/menu');
          }}
        >
          菜单管理
        </Button>
      </ProCard>
    </>
  );
};

export default Home;
