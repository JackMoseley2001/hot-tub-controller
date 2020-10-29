import * as express from 'express';
import * as octopus from './octopus';
import * as path from 'path';

import { checkStatus, logWaterTemperature, setupJobs } from './jobs';

import ApiRouter from './api';
import { addTemperatureReport } from './reporting';
import { events } from './shared';

const STATIC_PATH = path.join(__dirname, '..', 'public');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api', ApiRouter);
app.use('/', express.static(STATIC_PATH));

app.get('/*', (req, res) => {
  res.sendFile(path.join(STATIC_PATH, 'index.html'));
});

async function setup() {
  await octopus.fetchLatestTariffs();
  checkStatus();
  setupJobs();
  logWaterTemperature();
  addTemperatureReport();
  events.addListener('updateStatus', checkStatus);
}

app.listen(PORT, async () => {
  setup();
  console.log('App listening on port:', PORT);
});
