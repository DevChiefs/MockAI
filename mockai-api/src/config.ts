import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export default () => ({
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
  postgres: {
    url: process.env.DATABASE_URL,
  },
});
