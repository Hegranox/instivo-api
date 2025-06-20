export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      MONGODB_URI: string;
    }
  }
}
