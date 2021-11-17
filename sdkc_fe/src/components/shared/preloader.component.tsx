import { Spin } from 'antd';
import { CSSProperties } from 'react';

const style: CSSProperties = {
  width: 'max-content',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

const Preloader = () => (
  <div style={style}>
    <Spin size="large" />
  </div>
);

export default Preloader;
