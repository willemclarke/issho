import { config } from 'dotenv';

config();

export interface Config {
  youtubeToken: string;
}

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
    youtubeToken: getEnv('YOUTUBE_TOKEN'),
  };
};
