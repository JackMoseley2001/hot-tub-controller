import * as fs from 'fs';
import * as octopus from './octopus';
import * as path from 'path';

import { Request, Response, Router } from 'express';
import { getCPUTemperature, getWaterTemperature } from './shared';
import { getConfig, saveConfig } from './config';

import { Config } from './@types/config';
import { exec } from 'child_process';
import { getCurrentStatus } from './jobs';
import { getTemperatureReport } from './reporting';

const router = Router();

router.get('/tariffs', allTariffs);
router.get('/meta', getMeta);

router.post('/override/:id', setOverride);
router.post('/refresh', refreshTariffs);

router.get('/config', sendConfig);
router.post('/config', setConfig);

router.post('/restart', restartServer);

router.get('/logs', getLogs);
router.get('/reports/temperature', getTemperatureGraph);

export default router;

/* -------------------------------------------------------------------------- */
/*                                 Resolvers                                  */
/* -------------------------------------------------------------------------- */

function allTariffs(req: Request, res: Response) {
  const current = octopus.getCurrentTariff();
  const next = octopus.getNextTariff();
  const all = octopus.getAllTariffs().filter(val => val.id !== current.id && val.id !== next.id);

  res.json({
    current,
    next,
    all
  });
}

async function getMeta(req: Request, res: Response) {
  const config = getConfig();
  const waterTemp = getWaterTemperature();
  const cpuTemp = await getCPUTemperature();
  const currentTariff = octopus.getCurrentTariff();
  const status = getCurrentStatus();

  res.json({
    cpuTemp,
    waterTemp,
    targetTemp: config.temp_threshold,
    priceThreshold: config.price_threshold,
    currentCost: (currentTariff.price * config.heater_watt).toFixed(0),
    status: status.value
  });
}

async function setOverride(req: Request, res: Response) {
  const id = req.params.id;
  const tariff = octopus.overrideTariff(id);
  const currentStatus = getCurrentStatus();
  res.json({
    newStatus: currentStatus.value,
    tariff
  });
}

async function refreshTariffs(req: Request, res: Response) {
  await octopus.fetchLatestTariffs();
  res.sendStatus(204);
}

function sendConfig(req: Request, res: Response) {
  const config = getConfig();
  res.json(config);
}

function setConfig(req: Request, res: Response) {
  const config = getConfig();

  const newConfig: Config = {
    price_threshold: Number(req.body.priceThreshold) || config.price_threshold,
    temp_threshold: Number(req.body.waterThreshold) || config.temp_threshold,
    temperature_accuracy: Number(req.body.temperatureAccuracy) || config.temperature_accuracy,
    heater_watt: Number(req.body.heaterWatt) || config.heater_watt
  };
  saveConfig(newConfig);
  res.sendStatus(200);
}

function restartServer(req: Request, res: Response) {
  res.sendStatus(204);
  exec('pm2 restart server');
}

function getLogs(req: Request, res: Response) {
  let logFilePath: string;

  if (!process.env.DEV) {
    logFilePath = path.join(__dirname, '..', '..', '.pm2', 'logs', 'server-out.log');
  } else {
    logFilePath = path.join(__dirname, 'test-log.log');
  }

  if (fs.existsSync(logFilePath)) {
    const logFile = fs.readFileSync(logFilePath, { encoding: 'utf8' });
    res.send(logFile);
  } else {
    res.send('No Logs Found');
  }
}

function getTemperatureGraph(req: Request, res: Response) {
  const reports = getTemperatureReport();
  res.json(reports);
}
