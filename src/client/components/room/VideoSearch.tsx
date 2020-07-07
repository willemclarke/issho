import React from 'react';
import _ from 'lodash';
import { Input, Row, Col, Divider, Spin, Result } from 'antd';
import { useQuery } from 'react-query';
import { youtubeSearch, YoutubeResponseItem } from '../../api/api';
import { VideoSearchResult } from './VideoSearchResult';
import { useAppContext } from '../../hooks/useAppContext';

interface VideoSearchResultsProps {
  items: YoutubeResponseItem[];
  onVideoClick: (url: string) => void;
}

export const VideoSearchResults = (props: VideoSearchResultsProps) => {
  const { items, onVideoClick } = props;
  const results = _.map(items, (item) => (
    <VideoSearchResult item={item} onVideoClick={onVideoClick} />
  ));
  return <div>{results}</div>;
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

  if (isFetching) {
    return <Spin />;
  }

  if (error) {
    return <Result status="500" title="500" subTitle={error?.message} />;
  }

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
          <VideoSearchResults items={data?.items || []} onVideoClick={onVideoClick} />
        </Col>
      </Row>
    </>
  );
};
