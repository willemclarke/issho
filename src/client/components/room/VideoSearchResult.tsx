import React from 'react';
import _ from 'lodash';
import { YoutubeResponseItem } from '../../api/api';

interface Props {
  item: YoutubeResponseItem;
}

export const VideoSearchResult = ({ item }: Props) => {
  return <div style={{ backgroundColor: 'red', height: '200px' }}>{item.snippet.title}</div>;
};
