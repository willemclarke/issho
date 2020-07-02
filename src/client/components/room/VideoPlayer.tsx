import React from 'react';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io';
import { VideoState, RoomVideoState, Messages } from '../../../common/types';
import { CommandBar } from './CommandBar';

interface Props {
  socket: Socket;
  roomId: string;
}

export const VideoPlayer = (props: Props) => {
  const { socket, roomId } = props;

  const [state, setState] = React.useState<VideoState>({
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
  });

  const [lastSyncedAt, setLastSyncedAt] = React.useState(new Date().valueOf());

  React.useEffect(() => {
    socket.on(Messages.SYNCED_ROOM_VIDEO_STATE, (data: RoomVideoState) => {
      console.log(data, 'recieved date on synced_room_video_state');
      const { playing } = data;
      setState({
        ...state,
        playing: playing,
      });
    });
  }, []);

  React.useEffect(() => {
    syncVideoPlayerState();
  }, [lastSyncedAt]);

  const handlePlay = () => {
    console.log('onPlay');
    setState({ ...state, playing: true });
  };

  const handlePause = () => {
    console.log('onPause');
    setState({ ...state, playing: false });
  };

  const handlePlayAndPause = () => {
    setState((prevState: VideoState) => {
      return {
        ...prevState,
        playing: !prevState.playing,
      };
    });
    setLastSyncedAt(new Date().valueOf());
  };

  const syncVideoPlayerState = () => {
    socket.emit(Messages.SEND_ROOM_VIDEO_STATE, {
      playing: state.playing,
      id: roomId,
    });
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
