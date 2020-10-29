import * as fs from 'fs';
import * as path from 'path';

import { currentDateStr, currentTimeStr } from './shared';

import { TemperatureReport } from './@types/temperature_reports';
import { getWaterTemperature } from './shared';

const TEMPERATURE_PATH = path.join(__dirname, 'temperatures.json');

function getDataLabel(): string {
  return `${currentDateStr()}\n${currentTimeStr()}`;
}

function getCurrentDataItem(): { label: string; data: number } {
  return {
    label: getDataLabel(),
    data: getWaterTemperature()
  };
}

function saveTemperatureReport(report: TemperatureReport) {
  fs.writeFileSync(TEMPERATURE_PATH, JSON.stringify(report));
}

function getTemperatureReport(): TemperatureReport {
  if (fs.existsSync(TEMPERATURE_PATH)) {
    const file = fs.readFileSync(TEMPERATURE_PATH, { encoding: 'utf8' });
    return JSON.parse(file);
  } else {
    return {
      labels: [],
      data: []
    };
  }
}

function addTemperatureReport() {
  const report = getTemperatureReport();

  if (report.data.length >= 48) {
    report.data.shift();
    report.labels.shift();
  }

  const currentDataItem = getCurrentDataItem();
  report.data.push(currentDataItem.data);
  report.labels.push(currentDataItem.label);

  saveTemperatureReport(report);
}

export { getTemperatureReport, addTemperatureReport };
