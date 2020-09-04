import React from 'react';
import _ from 'lodash';
import { RoomStatus } from '../../../common/types';
import { List, Space, Typography, Divider } from 'antd';
import { DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
        const videoNumber = index + 1;
        const videoAddedBy = item.addedByUsername;

        return (
          <List.Item
            style={{ backgroundColor: index + 1 === currentPlayingNumber ? '#f0f0f0' : 'white' }}
            actions={[
              <Space>
                <span>{videoNumber}</span>
                <Divider type="vertical" style={{ margin: '0', backgroundColor: '#595959' }} />
                <span>Added by: {videoAddedBy}</span>
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
      <Title
        level={4}
        style={{ color: '#595959' }}
      >{`${roomStatus.roomId} - ${currentPlayingNumber}/${playlist.length}`}</Title>
      {list}
    </div>
  );
};
