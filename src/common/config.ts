import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  youtubeToken: string;
  webSocketApi: string;
  webSocketSecure: boolean;
  webSocketInviteUserLink: string;
}

// To do: need to fix (process.env[value]) returns undefined,
// but accessing process.env.YOUTUBE_TOKEN, which is equivalent works
export const getEnv = (value: string): string => {
  const env = process.env[value];
  if (!env) {
    throw new Error(`Unable to get ${value} from environment variables`);
  } else {
    return env;
  }
};

export const fromEnv = (): Config => {
  return {
    youtubeToken: process.env.YOUTUBE_TOKEN as string,
    webSocketApi: process.env.WEB_SOCKET_API as string,
    webSocketSecure: (process.env.WEB_SOCKET_SECURE === 'true') as boolean,
    webSocketInviteUserLink: process.env.WEB_SOCKET_INVITE_USER_LINK as string,
  };
};
