import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import { prototype } from 'events';

export type EnvConfig = Record<string, string>;

export default {
  host: 'localhost',
  port: 5432,
};

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),

      PG_PORT: Joi.number().required(),
      PG_USERNAME: Joi.string().required(),
      PG_PASSWORD: Joi.string().required(),
      PG_DATABASE: Joi.string().required(),
      PG_SYNCHRONIZE: Joi.boolean().default(false),
    });

    const { error, value: validateEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) throw new Error(`Config validation error: ${error.message}`);
    return validateEnvConfig;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get pgPort(): number {
    return Number(this.envConfig.PG_PORT);
  }

  get pgUsername(): string {
    return this.envConfig.PG_USERNAME;
  }

  get pgPassword(): string {
    return this.envConfig.PG_PASSWORD;
  }

  get pgDatabase(): string {
    return this.envConfig.PG_DATABASE;
  }

  get pgSynchronize(): boolean {
    return Boolean(this.envConfig.PG_SYNCHRONIZE);
  }
}
