/*
Config value will first be searched in the EXPO_PUBLIC_<KEY> Evinornment variables (or file .env).
https://docs.expo.dev/guides/environment-variables/
*/
export const GOOGLE_API_KEY: string = 
  typeof process.env.EXPO_PUBLIC_GOOGLE_API_KEY === 'string'
    ? process.env.EXPO_PUBLIC_GOOGLE_API_KEY
    : '';

/** User agent for fetch requests */
export const WEB_USER_AGENT = 'GoNOW/1.0';