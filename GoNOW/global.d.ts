declare global {
    namespace NodeJS {
      interface ProcessEnv {
        EXPO_PUBLIC_ACCESS_TOKEN?: string;
      }
    }
  }
  export {};
  