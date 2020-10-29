import * as stores from './store.js';

import { get } from 'svelte/store';

// const API_ROUTE = 'http://localhost:3000/api/';
const API_ROUTE = '/api/';

export async function fetchMetaData() {
  stores.loading.update(current => {
    return {
      ...current,
      meta: true
    };
  });
  const request = await fetch(`${API_ROUTE}/meta`);
  const results = await request.json();
  stores.meta.set(results);
  stores.loading.update(current => {
    return {
      ...current,
      meta: true
    };
  });
}

export async function fetchTariffs() {
  stores.loading.update(current => {
    return {
      ...current,
      tariffs: true
    };
  });
  const request = await fetch(`${API_ROUTE}/tariffs`);
  const results = await request.json();
  stores.tariffs.set({
    current: results.current,
    next: results.next,
    all: results.all
  });
  stores.loading.update(current => {
    return {
      ...current,
      tariffs: false
    };
  });
}

export async function overrideTariff(id) {
  const request = await fetch(`${API_ROUTE}/override/${id}`, {
    method: 'POST'
  });
  const { tariff: newTariff, newStatus } = await request.json();
  const tariffs = get(stores.tariffs);

  if (tariffs.current.id === newTariff.id) {
    stores.tariffs.update(old => {
      return {
        ...old,
        current: newTariff
      };
    });
  } else if (tariffs.next.id === newTariff.id) {
    stores.tariffs.update(old => {
      return {
        ...old,
        next: newTariff
      };
    });
  } else {
    const all = tariffs.all;
    const oldTariff = all.find(el => el.id === id);
    const index = all.indexOf(oldTariff);
    all[index] = newTariff;

    stores.tariffs.update(old => {
      return {
        ...old,
        all
      };
    });
  }

  stores.meta.update(old => {
    return {
      ...old,
      status: newStatus
    };
  });
}

export async function rebootServer() {
  const request = await fetch(`${API_ROUTE}/restart`, {
    method: 'POST'
  });
  if (request.status === 204) {
    alert('Restarting server. Please refresh in a minute');
  } else {
    alert('Failed to restart server');
  }
}

export async function getConfig() {
  stores.loading.update(current => {
    return {
      ...current,
      config: true
    };
  });
  const request = await fetch(`${API_ROUTE}/config`);
  const results = await request.json();
  stores.config.set({
    priceThreshold: results.price_threshold,
    waterThreshold: results.temp_threshold,
    heaterWatt: results.heater_watt,
    temperatureAccuracy: results.temperature_accuracy
  });
  stores.loading.update(current => {
    return {
      ...current,
      config: false
    };
  });
}

export async function saveConfig(priceThreshold, waterThreshold, heaterWatt, temperatureAccuracy) {
  stores.loading.update(current => {
    return {
      ...current,
      config: true
    };
  });
  const values = {
    priceThreshold,
    waterThreshold,
    heaterWatt,
    temperatureAccuracy
  };
  const request = await fetch(`${API_ROUTE}/config`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  stores.loading.update(current => {
    return {
      ...current,
      config: false
    };
  });

  if (request.status !== 200) {
    return false;
  } else {
    stores.meta.update(meta => {
      return {
        ...meta,
        priceThreshold
      };
    });
    return true;
  }
}

export async function getLogs() {
  stores.loading.update(current => {
    return {
      ...current,
      logs: true
    };
  });

  const request = await fetch(`${API_ROUTE}/logs`);
  const results = await request.text();
  stores.logs.set(results);
  stores.loading.update(current => {
    return {
      ...current,
      logs: false
    };
  });
}

export async function getTemperatureGraph() {
  stores.loading.update(current => {
    return {
      ...current,
      graphs: true
    };
  });

  const request = await fetch(`${API_ROUTE}/reports/temperature`);
  const results = await request.json();
  stores.temperatureGraph.set(results);
  stores.loading.update(current => {
    return {
      ...current,
      graphs: false
    };
  });
}
