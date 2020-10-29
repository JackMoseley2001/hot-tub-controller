<script>
  import OverviewSection from '../Components/OverviewSection.svelte';
  import UpcomingSection from '../Components/UpcomingSection.svelte';
  import LoadingIndicator from '../Components/LoadingIndicator.svelte';

  import { loading as loadingStore } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import { fetchTariffs } from '../network';

  let loading = true;
  const unsubscribe = loadingStore.subscribe(val => {
    loading = val.tariffs;
  });

  onDestroy(unsubscribe);
  onMount(fetchTariffs);
</script>

<main>
  {#if loading}
    <section>
      <LoadingIndicator />
    </section>
  {:else}
    <OverviewSection />
    <UpcomingSection />
  {/if}
</main>
