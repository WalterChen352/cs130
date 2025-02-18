import Constants from 'expo-constants';

// https://docs.expo.dev/guides/environment-variables/

export const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 
  Constants.expo?.extra?.GOOGLE_API_KEY || '';