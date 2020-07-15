import React from 'react';
import { Col, Divider, Input, Result, Row, Spin } from 'antd';
import { useQuery } from 'react-query';
import { youtubeSearch } from '../../api/api';
import { useAppContext } from '../../hooks/useAppContext';
import { VideoSearchList } from './VideoSearchList';

interface Props {
  onVideoClick: (url: string) => void;
  onPlaylistAdd: (url: string, description: string, title: string, thumbnailUrl: string) => void;
}

export const VideoSearch = (props: Props) => {
  const { onVideoClick, onPlaylistAdd } = props;

  const { config } = useAppContext();
  const [searchValue, setSearchValue] = React.useState<string>('');

  const { isFetching, data, error, refetch } = useQuery(
    'youtubeKey',
    () => {
      return youtubeSearch(config.youtubeToken, searchValue);
    },
    { enabled: false },
  );

  if (error) {
    return <Result status="500" title="500" subTitle={error?.message} />;
  }

  const searchingVideoSpin = isFetching ? <Spin /> : null;

  return (
    <>
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
          <VideoSearchList
            items={data?.items || []}
            onVideoClick={onVideoClick}
            onPlaylistAdd={onPlaylistAdd}
          />
        </Col>
      </Row>
    </>
  );
};
