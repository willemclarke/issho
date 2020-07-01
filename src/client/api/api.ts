import rp from 'request-promise';
import _ from 'lodash';

interface YoutubeResponse {
  kind: string;
  etag: string;
  items: [
    {
      etag: string;
      id: {
        videoId: string;
      };
      snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
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
  ];
}

// https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${SEARCH_TERM}&key=${env.key}
export async function youtubeSearch(token: string, query: string): Promise<YoutubeResponse> {
  const options = {
    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=${token}`,
    json: true,
  };
  const response = await rp(options);
  return response;
}
