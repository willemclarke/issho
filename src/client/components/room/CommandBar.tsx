import React from 'react';
import { Button } from 'antd';

interface Props {
  handlePlayAndPause: () => void;
  playing: boolean;
}

export const CommandBar = (props: Props) => {
  const { handlePlayAndPause, playing } = props;

  return (
    <div style={{ backgroundColor: '#121212', padding: '5px' }}>
      <Button type="primary" onClick={handlePlayAndPause}>
        {playing ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
};
