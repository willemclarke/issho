import React from 'react';
import { Col, Row, Spin, Result, Button } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { Messages } from '../../common/types';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { VideoSearch } from '../components/room/VideoSearch';
import { useRoom } from '../hooks/useRoom';
import { Link } from 'react-router-dom';

enum VideoPlayerAction {
  SET_STATE,
  CHANGE_VIDEO_URL,
  PLAY_PAUSE,
  PLAY,
  PAUSE,
  SEEK,
}

export interface VideoState {
  url: null | string;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  loop: boolean;
  lastAction: Date;
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

  const [error, setError] = React.useState<string | null>(null);
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
    if (roomStatus?.videoPlayerState) {
      dispatch({ type: VideoPlayerAction.SET_STATE, payload: roomStatus?.videoPlayerState });
    }
  }, [roomStatus]);

  React.useEffect(() => {
    socket.on(Messages.INVALID_JOIN_ROOM_RESPONSE, (data: { errorMessage: string }) => {
      setError(data.errorMessage);
    });
  }, []);

  React.useEffect(() => {
    if (roomStatus) {
      socket.emit(Messages.ROOM_VIDEO_STATE_REQUEST, {
        roomId: roomStatus.roomId,
        roomVideoPlayerState: {
          playing: videoState.playing,
          url: videoState.url,
        },
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

  if (error) {
    return (
      <Result
        icon={<FrownOutlined style={{ color: '#121212' }} />}
        title="409"
        subTitle={error}
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }

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
