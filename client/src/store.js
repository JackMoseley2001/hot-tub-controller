import { writable } from 'svelte/store';

export const tariffs = writable({});
export const meta = writable({});
export const config = writable({});
export const logs = writable('');
export const loading = writable({
  tariffs: true,
  meta: true,
  config: true,
  logs: true,
  graphs: false
});
export const temperatureGraph = writable({ labels: [], data: [] });
