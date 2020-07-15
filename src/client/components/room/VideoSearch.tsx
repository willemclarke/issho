import React from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { useAppContext } from '../../hooks/useAppContext';
import { youtubeSearch, YoutubeResponseItem } from '../../api/api';
import { Input, Row, Col, Divider, Spin, Result, List, Avatar, Tabs } from 'antd';

const { TabPane } = Tabs;

interface VideoSearchListProps {
  items: YoutubeResponseItem[];
  onVideoClick: (url: string) => void;
}

export const VideoSearchList = (props: VideoSearchListProps) => {
  const { items, onVideoClick } = props;

  const data = _.map(items, (item) => {
    console.log(item.snippet.channelTitle, 'channel title');
    return {
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      videoUrl: () => onVideoClick(`https://www.youtube.com/watch?v=${item.id.videoId}`),
    };
  });

  const list = (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item onClick={item.videoUrl}>
          <List.Item.Meta
            avatar={<Avatar size={100} shape="square" src={item.thumbnail} />}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );

  return <div>{list}</div>;
};

interface Props {
  onVideoClick: (url: string) => void;
}

export const VideoSearch = (props: Props) => {
  const { onVideoClick } = props;

  const { config } = useAppContext();
  const [searchValue, setSearchValue] = React.useState<string>('');

  const { isFetching, data, error, refetch } = useQuery(
    'youtubeKey',
    () => {
      return youtubeSearch(config.youtubeToken, searchValue);
    },
    { enabled: false },
  );

  // if (isFetching) {
  //   return <Spin />;
  // }

  if (error) {
    return <Result status="500" title="500" subTitle={error?.message} />;
  }

  const searchingVideoSpin = isFetching ? <Spin /> : null;

  return (
    <>
      <Tabs defaultActiveKey="search">
        <TabPane tab="Search youtube" key="search">
          <Row>
            <Col span={24}>
              <Input.Search
                onSearch={() => refetch()}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              {searchingVideoSpin}
              <VideoSearchList items={data?.items || []} onVideoClick={onVideoClick} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Playlist" key="playlist">
          <Row>
            <Col span={24} style={{ height: '100vh', backgroundColor: 'red' }}></Col>
          </Row>
        </TabPane>
      </Tabs>
    </>
  );
};
