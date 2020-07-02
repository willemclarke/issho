import React from 'react';
import ReactPlayer from 'react-player';
import _ from 'lodash';
import { VideoState } from '../../../common/types';
import { CommandBar } from './CommandBar';

export const VideoPlayer = () => {
  const [state, setState] = React.useState<VideoState>({
    url: null,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: false,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });

  const load = (url: string) => {
    return setState({
      ...state,
      url,
      played: 0,
      loaded: 0,
    });
  };

  const handlePlay = () => {
    console.log('onPlay');
    setState({ ...state, playing: true });
  };

  const handlePause = () => {
    console.log('onPause');
    setState({ ...state, playing: false });
  };

  const handlePlayAndPause = () => {
    setState((prevState: VideoState) => ({
      ...prevState,
      playing: !prevState.playing,
    }));
  };

  return (
    <>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=Xn8yLcIj2BY"
        width="100%"
        height="65%"
        playing={state.playing}
        onPlay={handlePlay}
        onPause={handlePause}
        config={{
          youtube: {
            playerVars: { showinfo: 0 },
          },
        }}
      />
      <CommandBar handlePlayAndPause={handlePlayAndPause} playing={state.playing} />
    </>
  );
};
