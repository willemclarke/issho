import { useQuery } from 'react-query';
import { youtubeSearch } from '../api/api';
import { useAppContext } from './useAppContext';
import { useInfiniteQuery } from 'react-query';
import _ from 'lodash';

export const useYoutubeSearch = (searchTerm: string) => {
  const { config } = useAppContext();

  const queryYoutube = async (...keysAndMore: any) => {
    console.log(keysAndMore);
    console.log('Search term', searchTerm);
    return youtubeSearch(config.youtubeToken, searchTerm);
  };

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery('youtube', queryYoutube as any, {
    getFetchMore: ({ items, nextPageToken }) => {
      // if (items.length) {
      //   return nextPageToken;
      // }
      // return false;
      return nextPageToken;
    },
    enabled: false,
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
