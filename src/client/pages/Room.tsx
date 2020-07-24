import React from 'react';
import logger from 'use-reducer-logger';
import { Col, Row, Spin, Result, Button, Tabs, Divider, Layout } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { Messages } from '../../common/types';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { VideoSearch } from '../components/room/VideoSearch';
import { useRoom } from '../hooks/useRoom';
import { Link } from 'react-router-dom';
import { VideoPlaylist } from '../components/room/VideoPlaylist';

enum VideoPlayerAction {
  SET_STATE = 'SET_STATE',
  CHANGE_CURRENT_PLAYLIST_ID = 'CHANGE_CURRENT_PLAYLIST_ID',
  PLAY_PAUSE = 'PLAY_PAUSE',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  SEEK = 'SEEK',
  ENDED = 'ENDED',
}

export interface VideoState {
  currentPlaylistId?: string;
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
  ended: boolean;
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
    case VideoPlayerAction.ENDED:
      return {
        ...initialState,
        playing: false,
        ended: true,
        lastAction: new Date(),
      };
    case VideoPlayerAction.CHANGE_CURRENT_PLAYLIST_ID:
      return {
        ...initialState,
        playing: true,
        currentPlaylistId: action.payload.id,
        lastAction: new Date(),
      };

    default:
      throw new Error(`No reducer to match action:  ${action}`);
  }
};

export const Room = () => {
  const { roomStatus, socket } = useRoom();

  const [error, setError] = React.useState<string | null>(null);
  const [videoState, dispatchVideoAction] = React.useReducer(logger(videoPlayerReducer), {
    currentPlaylistId: undefined,
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
    ended: false,
    lastAction: new Date(),
  });

  React.useEffect(() => {
    if (roomStatus?.videoPlayerState) {
      dispatchVideoAction({
        type: VideoPlayerAction.SET_STATE,
        payload: roomStatus?.videoPlayerState,
      });
    }
  }, [roomStatus]);

  React.useEffect(() => {
    socket.on(Messages.INVALID_JOIN_ROOM_RESPONSE, (data: { error: string }) => {
      setError(data.error);
    });
  }, []);

  React.useEffect(() => {
    if (roomStatus) {
      socket.emit(Messages.ROOM_VIDEO_STATE_REQUEST, {
        roomId: roomStatus.roomId,
        roomVideoPlayerState: {
          playing: videoState.playing,
          ended: videoState.ended,
          currentPlaylistId: videoState.currentPlaylistId,
        },
      });
    }
  }, [videoState.lastAction]);

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
    return (
      <Layout style={{ height: '100vh' }}>
        <Spin />
      </Layout>
    );
  }

  const handlePlay = () => {
    dispatchVideoAction({ type: VideoPlayerAction.PLAY });
  };

  const handlePause = () => {
    dispatchVideoAction({ type: VideoPlayerAction.PAUSE });
  };

  const handlePlayAndPause = () => {
    dispatchVideoAction({ type: VideoPlayerAction.PLAY_PAUSE });
  };

  const handleEnded = () => {
    dispatchVideoAction({ type: VideoPlayerAction.ENDED });
  };

  const handlePlaylistVideoClick = (id: string) => {
    dispatchVideoAction({ type: VideoPlayerAction.CHANGE_CURRENT_PLAYLIST_ID, payload: { id } });
  };

  const handlePlaylistDelete = (id: string) => {
    socket.emit(Messages.PLAYLIST_DELETE_REQUEST, {
      roomId: roomStatus.roomId,
      id: id,
    });
  };

  const handlePlaylistAdd = (
    url: string,
    title: string,
    channelTitle: string,
    thumbnailUrl: string,
  ) => {
    socket.emit(Messages.PLAYLIST_ADD_REQUEST, {
      roomId: roomStatus.roomId,
      url,
      title,
      channelTitle,
      thumbnailUrl,
    });
  };

  return (
    <Row style={{ height: '100%' }}>
      <Col span={18} style={{ height: '100%', padding: '16px' }}>
        <VideoPlayer
          playlist={roomStatus.playlist}
          videoState={videoState}
          handlePlay={handlePlay}
          handlePause={handlePause}
          handlePlayAndPause={handlePlayAndPause}
          handleEnded={handleEnded}
        />
        <UserList users={roomStatus.users} />
        <Divider />
        <pre>{JSON.stringify(roomStatus, null, 2)}</pre>
      </Col>
      <Col span={6} style={{ height: '100%', padding: '16px', overflowY: 'auto' }}>
        <Tabs defaultActiveKey="search">
          <Tabs.TabPane tab="Search youtube" key="search">
            <VideoSearch onPlaylistAdd={handlePlaylistAdd} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Playlist" key="playlist">
            <VideoPlaylist
              roomStatus={roomStatus}
              onDelete={handlePlaylistDelete}
              onClick={handlePlaylistVideoClick}
            />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};
