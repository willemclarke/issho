import React from 'react';
import _ from 'lodash';
import ReactPlayer from 'react-player';
import { VideoState } from '../../pages/Room';
import { RoomPlaylistEntry } from '~common/types';

interface Props {
  videoState: VideoState;
  playlist: RoomPlaylistEntry[];
  handlePlay: () => void;
  handlePause: () => void;
  handlePlayAndPause: () => void;
  handleEnded: () => void;
}

export const VideoPlayer = (props: Props) => {
  const { videoState, handlePause, handlePlay, handleEnded, playlist } = props;

  const url = _.find(playlist, (entry) => entry.id === videoState.currentPlaylistId)?.url;

  return (
    <>
      <ReactPlayer
        url={url}
        width="100%"
        height="65%"
        controls={true}
        playing={videoState.playing}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
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
