import * as path from 'path';

import { existsSync, readFileSync, writeFileSync } from 'fs';

import { Config } from './@types/config';
import { updateAllTariffStatus } from './octopus';

const CONFIG_PATH = path.join(__dirname, 'configuration.json');

function getConfig(): Config {
  if (existsSync(CONFIG_PATH) === false) {
    let config: Config = {
      price_threshold: 8,
      temp_threshold: 38,
      heater_watt: 1,
      temperature_accuracy: 0.5
    };
    saveConfig(config);
    return config;
  }
  const file = readFileSync(CONFIG_PATH, { encoding: 'utf-8' });
  const config: Config = JSON.parse(file);
  return config;
}

function saveConfig(newConfig: Config) {
  const configJSON = JSON.stringify(newConfig);
  writeFileSync(CONFIG_PATH, configJSON);
  updateAllTariffStatus();
}

export { getConfig, saveConfig };
