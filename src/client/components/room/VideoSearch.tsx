import React from 'react';
import { Col, Divider, Input, Result, Row, Spin, Button } from 'antd';
import { useQuery } from 'react-query';
import { youtubeSearch } from '../../api/api';
import { useAppContext } from '../../hooks/useAppContext';
import { VideoSearchList } from './VideoSearchList';
import { useYoutubeSearch } from '../../hooks/useYoutubeSearch';
import _ from 'lodash';

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

  const searchingVideoSpin = isFetching ? <Spin /> : null;
  // flatMapping nested youtube response items
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
      <Row>
        <Col span={24}>
          {searchingVideoSpin}
          <VideoSearchList items={flattenedData} onPlaylistAdd={onPlaylistAdd} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => fetchMore()}>Load more</Button>
        </Col>
      </Row>
    </>
  );
};
