import React from 'react';
import { Input, Row, Col, Divider, Card } from 'antd';
import _ from 'lodash';

export const VideoSearchResult = () => {
  return <div style={{ backgroundColor: 'red', height: '200px' }}>HELLO</div>;
};

export const VideoSearchResults = () => {
  const results = _.map(_.range(0, 10), () => <VideoSearchResult />);
  return <div>{results}</div>;
};

interface Props {}

export const VideoSearch = (props: Props) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Input />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <VideoSearchResults />
        </Col>
      </Row>
    </>
  );
};
