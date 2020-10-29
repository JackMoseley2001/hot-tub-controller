<script>
  import OverviewTariff from './Tariff/OverviewTariff.svelte';
  import OverviewBox from './OverviewBox.svelte';
  import { tariffs, meta as metaStore } from '../store';
  import { onDestroy } from 'svelte/internal';

  let current, next, meta;

  const metaUnsubscribe = metaStore.subscribe(val => {
    meta = val;
  });

  const currentUnsubscribe = tariffs.subscribe(val => {
    if (val.current) current = val.current;
    if (val.next) next = val.next;
  });

  onDestroy(currentUnsubscribe, metaUnsubscribe);
</script>

<section class="section">
  <h1 class="title">Overview</h1>
  <OverviewBox
    cost={meta.currentCost}
    cpuTemp={meta.cpuTemp}
    waterTemp={meta.waterTemp}
    targetTemp={meta.targetTemp}
    status={meta.status} />
  <div class="tile is-ancestor" id="overview-container">
    <OverviewTariff title="Current Tariff" tariff={current} />
    <OverviewTariff title="Next Tariff" tariff={next} />
  </div>
</section>
