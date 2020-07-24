import rp from 'request-promise';
import _ from 'lodash';

export interface YoutubeResponse {
  kind: string;
  nextPageToken: string;
  etag: string;
  items: YoutubeResponseItem[];
}

export interface YoutubeResponseItem {
  etag: string;

  id: {
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
}

export async function youtubeSearch(
  token: string,
  query: string,
  pageToken?: string,
): Promise<YoutubeResponse> {
  const options = {
    url: 'https://www.googleapis.com/youtube/v3/search',
    qs: {
      part: 'snippet',
      maxResults: 1,
      q: query,
      key: token,
      pageToken,
    },
    json: true,
  };
  const response = await rp(options);
  return response;
}
