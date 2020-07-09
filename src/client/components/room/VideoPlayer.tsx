import React from 'react';
import ReactPlayer from 'react-player';
import { VideoState } from '../../../common/types';

interface Props {
  videoState: VideoState;
  handlePlay: () => void;
  handlePause: () => void;
  handlePlayAndPause: () => void;
}

export const VideoPlayer = (props: Props) => {
  const { videoState, handlePause, handlePlay, handlePlayAndPause } = props;

  return (
    <>
      <ReactPlayer
        url={videoState.url}
        width="100%"
        height="65%"
        controls={true}
        playing={videoState.playing}
        onPlay={handlePlay}
        onPause={handlePause}
        config={{
          youtube: {
            playerVars: { showinfo: 0 },
          },
        }}
      />
      {/* <CommandBar handlePlayAndPause={handlePlayAndPause} playing={videoState.playing} /> */}
    </>
  );
};
