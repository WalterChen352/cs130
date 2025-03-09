/*
Config value will first be searched in the EXPO_PUBLIC_<KEY> Evinornment variables (or file .env).
https://docs.expo.dev/guides/environment-variables/
*/
export const GOOGLE_API_KEY: string = 
  typeof process.env.EXPO_PUBLIC_GOOGLE_API_KEY === 'string'
    ? process.env.EXPO_PUBLIC_GOOGLE_API_KEY
    : '';

/** Backend host */
export const APP_HOST: string = 
  typeof process.env.EXPO_PUBLIC_APP_HOST === 'string'
    ? process.env.EXPO_PUBLIC_APP_HOST
    : 'http://localhost:8080';


/** Backend Auth Token */
export const ACCESS_TOKEN: string = 
  typeof process.env.EXPO_PUBLIC_ACCESS_TOKEN === 'string'
    ? process.env.EXPO_PUBLIC_ACCESS_TOKEN
    : '';

/** User agent for fetch requests */
export const WEB_USER_AGENT = 'GoNOW/1.0';