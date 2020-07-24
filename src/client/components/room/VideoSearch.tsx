import React from 'react';
import _ from 'lodash';
import { Col, Divider, Input, Result, Row, Spin, Button } from 'antd';
import { useQuery } from 'react-query';
import { youtubeSearch } from '../../api/api';
import { useAppContext } from '../../hooks/useAppContext';
import { VideoSearchList } from './VideoSearchList';
import { useYoutubeSearch } from '../../hooks/useYoutubeSearch';

interface Props {
  onPlaylistAdd: (url: string, title: string, channelTitle: string, thumbnailUrl: string) => void;
}

export const VideoSearch = (props: Props) => {
  const { onPlaylistAdd } = props;

  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const { isFetching, data, error, fetchMore } = useYoutubeSearch(searchTerm);

  if (error) {
    return <Result status="500" title="500" subTitle={error?.message} />;
  }

  const searchingVideoSpin = isFetching ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Spin />
    </div>
  ) : null;
  // flatMapping nested youtube response items to allow for infinite loading
  const flattenedData = _.flatMap(data, (response) => response.items);

  return (
    <>
      <Row>
        <Col span={24}>
          <Input.Search
            onSearch={(term) => {
              setSearchTerm(term);
              fetchMore();
            }}
          />
        </Col>
      </Row>
      <Divider />
      <Row justify="center">
        <Col span={24}>
          {searchingVideoSpin}
          <VideoSearchList items={flattenedData} onPlaylistAdd={onPlaylistAdd} />
        </Col>
      </Row>
      <Row justify="center">
        <Col style={{ paddingTop: '5px', width: '100%' }}>
          <Button onClick={() => fetchMore()} style={{ width: '100%' }}>
            Load more
          </Button>
        </Col>
      </Row>
    </>
  );
};
