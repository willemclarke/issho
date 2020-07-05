import React from 'react';
import _ from 'lodash';
import { Input, Row, Col, Divider, Card, Spin, Result } from 'antd';
import { useQuery } from 'react-query';
import { youtubeSearch, YoutubeResponseItem } from '../../api/api';
import { VideoSearchResult } from './VideoSearchResult';
import { useAppContext } from '../../hooks/useAppContext';

interface VideoSearchResultsProps {
  items: YoutubeResponseItem[];
}

export const VideoSearchResults = ({ items }: VideoSearchResultsProps) => {
  const results = _.map(items, (item) => <VideoSearchResult item={item} />);
  return <div>{results}</div>;
};

interface Props {}

export const VideoSearch = (props: Props) => {
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
          <VideoSearchResults items={data?.items || []} />
        </Col>
      </Row>
    </>
  );
};
