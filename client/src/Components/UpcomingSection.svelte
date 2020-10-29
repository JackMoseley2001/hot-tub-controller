<script>
  import UpcomingTariff from './Tariff/UpcomingTariff.svelte';
  import { tariffs } from '../store';
  import { onDestroy } from 'svelte/internal';
  let values = [];

  const unsubscribe = tariffs.subscribe(val => {
    values = val.all;
  });

  onDestroy(unsubscribe);
</script>

<section class="section">
  <h1 class="title">Upcoming</h1>
  {#each values as tariff}
    <UpcomingTariff {tariff} />
  {/each}
</section>
