<script>
  import LoadingIndicator from '../Components/LoadingIndicator.svelte';

  import { loading as loadingStore, logs as logsStore } from '../store';
  import { onDestroy, onMount } from 'svelte';
  import { getLogs } from '../network';

  let loading = true;
  let logs = '';
  let logBox;
  const unsubscribe = loadingStore.subscribe(val => {
    loading = val.logs;
  });

  const logsUnsubscribe = logsStore.subscribe(val => {
    logs = val;
  });

  onDestroy(unsubscribe, logsUnsubscribe);
  onMount(async () => {
    await getLogs();
    logBox.scrollTop = logBox.scrollHeight;
  });
</script>

<main>
  {#if loading}
    <section>
      <LoadingIndicator />
    </section>
  {:else}
    <section class="section">
      <div class="box log-box">
        <pre bind:this={logBox}>{logs}</pre>
      </div>
    </section>
  {/if}
</main>
