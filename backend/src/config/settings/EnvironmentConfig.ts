import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });
const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_AUDIENCE: z.string().url(),
});
export type EnvironmentConfig = z.infer<typeof schema>;
export const loadEnvironmentConfig = (): EnvironmentConfig =>
  schema.parse(process.env);
