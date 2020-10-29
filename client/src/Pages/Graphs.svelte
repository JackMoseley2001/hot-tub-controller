<script>
  import LoadingIndicator from '../Components/LoadingIndicator.svelte';
  import Line from 'svelte-chartjs/src/Line.svelte';

  import { loading as loadingStore, temperatureGraph as temperatureStore } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import { getTemperatureGraph } from '../network';

  let loading = true;
  let temperatureGraph = { labels: [], datasets: [] };

  const chartOptions = {
    responsive: true,
    legend: { onClick: e => e.stopPropagation }
  };

  const unsubscribe = loadingStore.subscribe(val => {
    loading = val.graphs;
  });

  const temperatureGraphUnsubscribe = temperatureStore.subscribe(val => {
    const dataset = {
      fill: true,
      lineTension: 0,
      backgroundColor: 'rgba(255, 59, 48, .3)',
      borderColor: 'rgb(255, 69, 58)',
      borderCapStyle: 'butt',
      pointBorderColor: 'rgb(255, 69, 58)',
      pointBackgroundColor: 'rgb(255, 255, 255)',
      pointBorderWidth: 10,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgb(255, 45, 85)',
      pointHoverBorderColor: 'rgba(255, 55, 95)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      label: 'Temperature',
      data: val.data
    };

    temperatureGraph = { labels: val.labels, datasets: [dataset] };
  });

  onDestroy(unsubscribe, temperatureGraphUnsubscribe);
  onMount(async () => {
    await getTemperatureGraph();
  });
</script>

<main>
  {#if loading || temperatureGraph.datasets.length === 0}
    <section>
      <LoadingIndicator />
    </section>
  {:else}
    <section class="section">
      <div class="box">
        <Line data={temperatureGraph} options={chartOptions} />
      </div>
    </section>
  {/if}
</main>
