import _ from 'lodash';
import { useQuery } from 'react-query';
import { youtubeSearch } from '../api/api';
import { useAppContext } from './useAppContext';
import { useInfiniteQuery } from 'react-query';

export const useYoutubeSearch = (searchTerm: string) => {
  const { config } = useAppContext();

  const queryYoutube = async (...keysAndMore: any) => {
    console.log('keys and more: ', keysAndMore);
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
      console.log('items-getFetchMore', items);
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
