import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

dotenv.config();

export class Config {
  static YAML_CONFIG_FILE = 'config.yaml';

  static load(): Record<string, any> {
    const config = yaml.load(readFileSync(Config.YAML_CONFIG_FILE, 'utf8'), {
      json: true,
    }) as Record<string, any>;

    const env = process.env;

    return {
      ...config,
      ...env,
    };
  }
}
