import React from 'react';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io';
import { Messages, RoomVideoState, VideoState } from '../../../common/types';
import { CommandBar } from './CommandBar';

enum VideoPlayerAction {
  SET_STATE,
  PLAY_PAUSE,
  PLAY,
  PAUSE,
}

const videoPlayerReducer = (
  initialState: VideoState,
  action: { type: VideoPlayerAction; payload?: any },
): VideoState => {
  switch (action.type) {
    case VideoPlayerAction.SET_STATE:
      return {
        ...initialState,
        ...action.payload,
      };
    case VideoPlayerAction.PLAY:
      return {
        ...initialState,
        playing: true,
        lastAction: new Date(),
      };
    case VideoPlayerAction.PAUSE:
      return {
        ...initialState,
        playing: false,
        lastAction: new Date(),
      };
    case VideoPlayerAction.PLAY_PAUSE:
      return {
        ...initialState,
        playing: !initialState.playing,
        lastAction: new Date(),
      };
    default:
      throw new Error(`No reducer to match action:  ${action}`);
  }
};

interface Props {
  socket: Socket;
  roomId: string;
}

export const VideoPlayer = (props: Props) => {
  const { socket, roomId } = props;

  const [state, dispatch] = React.useReducer(videoPlayerReducer, {
    url: null,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    lastAction: new Date(),
  });

  React.useEffect(() => {
    socket.on(Messages.SYNCED_ROOM_VIDEO_STATE, (data: RoomVideoState) => {
      console.log(data, 'recieved date on synced_room_video_state');
      dispatch({ type: VideoPlayerAction.SET_STATE, payload: data });
    });
  }, []);

  React.useEffect(() => {
    socket.emit(Messages.SEND_ROOM_VIDEO_STATE, {
      playing: state.playing,
      id: roomId,
    });
  }, [state.lastAction]);

  const handlePlay = () => {
    dispatch({ type: VideoPlayerAction.PLAY });
  };

  const handlePause = () => {
    dispatch({ type: VideoPlayerAction.PAUSE });
  };

  const handlePlayAndPause = () => {
    dispatch({ type: VideoPlayerAction.PLAY_PAUSE });
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
