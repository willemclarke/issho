import React from 'react';
import { RoomPlaylistEntry, RoomStatus } from '../../../common/types';
import _ from 'lodash';
import { List, Avatar, Space } from 'antd';
import { DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';

interface Props {
  roomStatus: RoomStatus;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export const VideoPlaylist = (props: Props) => {
  const { roomStatus, onDelete, onClick } = props;
  const { playlist } = roomStatus;
  const currentPlayingNumber =
    _.findIndex(playlist, (entry) => entry.id === roomStatus.videoPlayerState.currentPlaylistId) +
    1;

  const list = (
    <List
      dataSource={playlist}
      itemLayout="vertical"
      bordered
      renderItem={(item, index) => {
        return (
          <List.Item
            style={{ backgroundColor: index + 1 === currentPlayingNumber ? '#f0f0f0' : 'white' }}
            actions={[
              <Space>
                <span>{index + 1}</span>
                <span onClick={() => onDelete(item.id)}>
                  <DeleteOutlined />
                  Delete
                </span>
                <span onClick={() => onClick(item.id)}>
                  <CaretRightOutlined />
                  Play now
                </span>
              </Space>,
            ]}
          >
            <List.Item.Meta
              avatar={<img src={item.thumbnailUrl} style={{ width: '120px' }} />}
              title={item.title}
              description={item.channelTitle}
            />
          </List.Item>
        );
      }}
    />
  );
  return (
    <div>
      {currentPlayingNumber}/{playlist.length}
      {list}
    </div>
  );
};
