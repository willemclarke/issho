import React from 'react';
import _ from 'lodash';
import { YoutubeResponseItem } from '../../api/api';

interface Props {
  item: YoutubeResponseItem;
  onVideoClick: (url: string) => void;
}

export const VideoSearchResult = (props: Props) => {
  const { item, onVideoClick } = props;

  const onClick = () => onVideoClick(`https://www.youtube.com/watch?v=${item.id.videoId}`);

  return (
    <div style={{ backgroundColor: 'red', height: '200px' }} onClick={onClick}>
      {item.snippet.title}
    </div>
  );
};
