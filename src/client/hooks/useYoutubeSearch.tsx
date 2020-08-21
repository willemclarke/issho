import _ from 'lodash';
import { youtubeSearch } from '../api/api';
import { useAppContext } from './useAppContext';
import { useInfiniteQuery } from 'react-query';

export const useYoutubeSearch = (searchTerm: string) => {
  const { config } = useAppContext();

  const youtubeQuery = async (...keysAndMore: any) => {
    const [_key, nextPageToken] = keysAndMore;
    return youtubeSearch(config.youtubeToken, searchTerm, nextPageToken);
  };

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(`youtube-${searchTerm}`, youtubeQuery, {
    enabled: false,
    getFetchMore: (lastGroup) => lastGroup.nextPageToken,
  });

  return {
    data: _.compact(data || []),
    isFetching,
    error,
    status,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  };
};
