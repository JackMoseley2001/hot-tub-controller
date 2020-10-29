import { CronCommand, CronJob } from 'cron';
import { fetchLatestTariffs, getAllTariffs, getCurrentTariff } from './octopus';
import { getWaterTemperature, print, setHeaterStatus } from './shared';

import { addTemperatureReport } from './reporting';
import { getConfig } from './config';

let heatToMax: boolean =
  getWaterTemperature() < getConfig().temp_threshold - getConfig().temperature_accuracy;

type Status = {
  value: boolean;
  message: string;
};

function getCurrentStatus(): Status {
  const tariff = getCurrentTariff();
  const config = getConfig();
  const waterTemp = getWaterTemperature();
  const minTemperature = config.temp_threshold - config.temperature_accuracy;
  const maxTemperature = config.temp_threshold + config.temperature_accuracy;

  function temperatureOutsideRange(): boolean {
    // return waterTemp < config.temp_threshold;
    if (waterTemp < minTemperature) {
      heatToMax = true;
      return true;
    } else {
      if (waterTemp >= maxTemperature && heatToMax) {
        heatToMax = false;
        return false;
      } else if (heatToMax) {
        return true;
      } else {
        return false;
      }
    }
  }

  if (tariff.override === true && temperatureOutsideRange()) {
    return {
      value: tariff.status,
      message: `Status was overriden to be ${tariff.status ? 'On' : 'Off'}`
    };
  }

  // if tariff is under the price threshold and under or over temperature
  if (tariff.status === true && temperatureOutsideRange() && tariff.override === false) {
    return {
      value: tariff.status,
      message: 'Price and temperature below thresholds. Status: On'
    };
  }

  if (tariff.status === false && tariff.override === false) {
    return {
      value: tariff.status,
      message: 'Price above threshold. Status: Off'
    };
  }

  return {
    value: false,
    message: 'Temperature above threshold. Status: Off'
  };
}

function checkStatus() {
  const status = getCurrentStatus();

  if (status.value === true) {
    // Turn heater on
    setHeaterStatus(true);
    print(status.message);
  } else {
    setHeaterStatus(false);
    print(status.message);
  }
}

async function fetchNewTariffs() {
  const originalTariffs = getAllTariffs();
  const lastTariff = originalTariffs[originalTariffs.length - 1] || undefined;
  const newTariffs = await fetchLatestTariffs();

  if (lastTariff) {
    if (newTariffs.filter(val => val.valid_from > lastTariff.valid_to).length == 0) {
      print('No new tariffs found. Attempting to refresh tariffs in 5 minutes');
      setTimeout(fetchNewTariffs, 300000);
    }
  }
}

function logWaterTemperature() {
  const waterTemp = getWaterTemperature();
  print(`INFO: The current water temperature is: ${waterTemp}'C`);
}

function setupJobs() {
  const createCron = (
    hour: number | string,
    minute: number | string,
    second: number | string,
    action: CronCommand
  ) => {
    return new CronJob(
      `${second} ${minute} ${hour} * * *`,
      action,
      undefined,
      true,
      'Europe/London'
    );
  };

  createCron('17', '0', '0', fetchNewTariffs);
  createCron('*', '*/5', '0', checkStatus);
  createCron('*', '*/30', '0', addTemperatureReport);
  createCron('*', '0', '0', logWaterTemperature);
}

export { setupJobs, checkStatus, getCurrentStatus, logWaterTemperature };
