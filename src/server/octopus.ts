import { APIResponse, APITariff, Tariff } from './@types/octopus';
import { print, shouldUpdateStatus } from './shared';

import { v4 as UUID } from 'uuid';
import fetch from 'node-fetch';
import { getConfig } from './config';

const API_BASE_URL = 'https://api.octopus.energy/v1';
const API_PRODUCT_CODE = 'AGILE-18-02-21';
const API_TARIFF_CODE = `E-1R-${API_PRODUCT_CODE}-H`;
const API_URL = `${API_BASE_URL}/products/${API_PRODUCT_CODE}/electricity-tariffs/${API_TARIFF_CODE}/standard-unit-rates/`;

let cache: Tariff[] = [];

async function fetchLatestTariffs(): Promise<Tariff[]> {
  try {
    const request = await fetch(API_URL);

    if (request.status !== 200) {
      console.log(request);

      throw new Error('Error fetching new tariffs');
    }

    const data: APIResponse = await request.json();
    const tariffs: Tariff[] = data.results
      .map(convertAPIResponse)
      .filter(val => val.valid_to > new Date());

    print(`Fetched ${tariffs.length}`);

    saveToCache(tariffs);

    return tariffs;
  } catch (error) {
    console.log(error);
    print('Failed to fetch tariffs');
    // Attempt fetch again after 5 minutes
    setTimeout(fetchLatestTariffs, 300000);
  }
}

function retryTariffFetch() {
  print('Attempting to refresh tariffs in 5 minutes');
  setTimeout(fetchLatestTariffs, 300000);
}

function convertAPIResponse(response: APITariff): Tariff {
  const config = getConfig();
  const id = UUID();
  const status = response.value_inc_vat <= config.price_threshold;
  const override = false;
  const valid_from = new Date(Date.parse(response.valid_from));
  const valid_to = new Date(Date.parse(response.valid_to));

  const timeFormatOptions = { hour12: false, hour: '2-digit', minute: '2-digit' };
  const fromTime = valid_from.toLocaleTimeString(undefined, timeFormatOptions);
  const toTime = valid_to.toLocaleTimeString(undefined, timeFormatOptions);

  const intervalStr = `${fromTime} - ${toTime}`;

  return {
    id,
    price: response.value_inc_vat,
    valid_from,
    valid_to,
    status,
    override,
    intervalStr
  };
}

function saveToCache(tariffs: Tariff[]) {
  const tariffOverrides = cache.filter(val => val.override === true);

  // Get last tariff in cache
  const lastTariff = cache[cache.length - 1] || undefined;

  if (lastTariff) {
    tariffs = tariffs.filter(val => val.valid_from >= lastTariff.valid_to);
  }

  // Sort by date
  tariffs = tariffs.sort((a, b) => {
    if (a.valid_from > b.valid_from) {
      return 1;
    } else {
      return -1;
    }
  });

  cache.push(...tariffs);
}

function updateAllTariffStatus() {
  const config = getConfig();
  cache.forEach(tariff => {
    if (tariff.override === false) {
      tariff.status = tariff.price <= config.price_threshold;
    }
  });
  shouldUpdateStatus();
}

function overrideTariff(id: string): Tariff {
  const tariff = cache.find(val => val.id === id);
  if (!tariff) return;

  const index = cache.indexOf(tariff);

  if (tariff.override === true) {
    cache[index].override = false;
  } else {
    cache[index].override = true;
  }

  cache[index].status = !tariff.status;

  shouldUpdateStatus();

  return cache[index];
}

function getAllTariffs(): Tariff[] {
  cache = cache.filter(el => el.valid_to >= new Date());
  return cache;
}

function getTariffAt(date: Date): Tariff {
  return cache.find(val => val.valid_to >= date && val.valid_from < date);
}

function getCurrentTariff(): Tariff {
  const currentDate = new Date();
  const tariff = getTariffAt(currentDate);

  return tariff;
}

function getNextTariff(): Tariff {
  const date = new Date();
  // Add 30 minutes to get next time section
  date.setMinutes(date.getMinutes() + 30);

  const tariff = getTariffAt(date);
  return tariff;
}

export {
  fetchLatestTariffs,
  updateAllTariffStatus,
  overrideTariff,
  getAllTariffs,
  getCurrentTariff,
  getNextTariff,
  retryTariffFetch
};
