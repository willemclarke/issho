import { PlusOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import _ from 'lodash';
import React from 'react';
import { YoutubeResponseItem } from '../../api/api';

interface Props {
  items: YoutubeResponseItem[];
  onVideoClick: (url: string) => void;
  onPlaylistAdd: (url: string, description: string, title: string, thumbnailUrl: string) => void;
}

export const VideoSearchList = (props: Props) => {
  const { items, onVideoClick, onPlaylistAdd } = props;

  const data = _.map(items, (item) => {
    const url = `https://www.youtube.com/watch?v=${item.id.videoId}`;
    return {
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      onClick: () => onVideoClick(url),
      onPlaylistAdd: () =>
        onPlaylistAdd(
          url,
          item.snippet.description,
          item.snippet.title,
          item.snippet.thumbnails.medium.url,
        ),
    };
  });

  const list = (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Space>
              <span onClick={item.onPlaylistAdd}>
                <PlusOutlined />
                Add to playlist
              </span>
            </Space>,
          ]}
        >
          <div onClick={item.onClick}>
            <List.Item.Meta
              avatar={<Avatar size={100} shape="square" src={item.thumbnail} />}
              title={item.title}
              description={item.description}
            />
          </div>
        </List.Item>
      )}
    />
  );

  return <div>{list}</div>;
};
