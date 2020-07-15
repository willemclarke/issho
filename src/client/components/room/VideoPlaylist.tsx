import React from 'react';
import { RoomPlaylistEntry } from '../../../common/types';
import _ from 'lodash';
import { List, Avatar, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface Props {
  playlist: RoomPlaylistEntry[];
  onDelete: (id: string) => void;
}

export const VideoPlaylist = (props: Props) => {
  const { playlist, onDelete } = props;

  const list = (
    <List
      dataSource={playlist}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Space>
              <span onClick={() => onDelete(item.id)}>
                <DeleteOutlined />
                Delete
              </span>
            </Space>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar size={100} shape="square" src={item.thumbnailUrl} />}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
  return <div>{list}</div>;
};
