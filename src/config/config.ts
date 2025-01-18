import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  databaseUrl: process.env.DATABASE_URL,
  fetchInterval: process.env.FETCH_INTERVAL || 5000,
}));
