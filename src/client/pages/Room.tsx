import React from 'react';
import _ from 'lodash';
import { Row, Col, Spin } from 'antd';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { useRoom } from '../hooks/useRoom';
import { VideoSearch } from '../components/room/VideoSearch';
import { VideoState, RoomVideoState, Messages } from '../../common/types';

enum VideoPlayerAction {
  CHANGE_VIDEO_URL,
  SET_STATE,
  PLAY_PAUSE,
  PLAY,
  PAUSE,
  SEEK,
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
    case VideoPlayerAction.CHANGE_VIDEO_URL:
      return {
        ...initialState,
        playing: true,
        url: action.payload.url,
        lastAction: new Date(),
      };
    default:
      throw new Error(`No reducer to match action:  ${action}`);
  }
};

export const Room = () => {
  const { roomStatus, socket } = useRoom();

  const [videoState, dispatch] = React.useReducer(videoPlayerReducer, {
    url: 'https://www.youtube.com/watch?v=TSN5r_UfIXQ',
    pip: false,
    playing: false,
    controls: true,
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
    if (roomStatus) {
      socket.emit(Messages.SEND_ROOM_VIDEO_STATE, {
        id: roomStatus.roomId,
        url: videoState.url,
        playing: videoState.playing,
      });
    }
  }, [videoState.lastAction]);

  const handlePlay = () => {
    dispatch({ type: VideoPlayerAction.PLAY });
  };

  const handlePause = () => {
    dispatch({ type: VideoPlayerAction.PAUSE });
  };

  const handlePlayAndPause = () => {
    dispatch({ type: VideoPlayerAction.PLAY_PAUSE });
  };

  const handleVideoClick = (url: string) => {
    dispatch({ type: VideoPlayerAction.CHANGE_VIDEO_URL, payload: { url } });
  };

  if (!roomStatus) {
    return <Spin />;
  }

  return (
    <Row style={{ height: '100%' }}>
      <Col span={18} style={{ height: '100%', padding: '16px' }}>
        <VideoPlayer
          videoState={videoState}
          handlePlay={handlePlay}
          handlePause={handlePause}
          handlePlayAndPause={handlePlayAndPause}
        />
        <UserList users={roomStatus.users} />
      </Col>
      <Col span={6} style={{ height: '100%', padding: '16px', overflowY: 'auto' }}>
        <VideoSearch onVideoClick={handleVideoClick} />
      </Col>
    </Row>
  );
};
