<script>
  import Navbar from '../Components/Navbar.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { meta, loading as loadingStore, config } from '../store';
  import LoadingIndicator from '../Components/LoadingIndicator.svelte';
  import { getConfig, saveConfig } from '../network';

  let loading = true;

  let priceThreshold = 8;
  let waterThreshold = 38;
  let heaterWatt = '1';
  let temperatureAccuracy = 0.5;

  const submitForm = async () => {
    const result = await saveConfig(
      priceThreshold,
      waterThreshold,
      heaterWatt,
      temperatureAccuracy
    );

    if (result) {
      document.querySelector('#success-notification').classList.remove('is-hidden');
    } else {
      document.querySelector('#failure-notification').classList.remove('is-hidden');
    }
  };

  const loadingUnsubscribe = loadingStore.subscribe(val => {
    loading = val.config;
  });

  const configUnsubscribe = config.subscribe(val => {
    priceThreshold = val.priceThreshold;
    waterThreshold = val.waterThreshold;
    temperatureAccuracy = val.temperatureAccuracy;
    heaterWatt = String(val.heaterWatt);
  });

  onMount(getConfig);
  onDestroy(loadingUnsubscribe, configUnsubscribe);
</script>

<main>
  {#if loading}
    <LoadingIndicator />
  {:else}
    <section class="section">
      <div class="notification is-primary is-hidden" id="success-notification">
        Saved Successfully
      </div>
      <div class="notification is-danger is-hidden" id="failure-notification">Failed to save</div>
      <h1 class="title">Config</h1>
      <div class="box">
        <h2 class="subtitle">General</h2>
        <div class="field">
          <label class="label">Price Threshold</label>
          <div class="control">
            <input
              id="priceThreshold"
              class="input"
              type="number"
              placeholder="default: 8"
              bind:value={priceThreshold} />
          </div>
        </div>
        <div class="field">
          <label class="label">Max Water Temperature</label>
          <div class="control">
            <input
              id="waterThreshold"
              class="input"
              type="number"
              placeholder="default: 38"
              bind:value={waterThreshold} />
          </div>
        </div>
        <div class="field">
          <label class="label">Water Temperature Accuracy</label>
          <div class="control">
            <input
              id="waterTempAccuracy"
              class="input"
              type="number"
              placeholder="default: 0.5"
              bind:value={temperatureAccuracy} />
          </div>
        </div>
        <div class="field">
          <label class="label">Heater Energy (Watts)</label>
          <div class="select">
            <select id="heater-watt" bind:value={heaterWatt}>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="3.5">3.5</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
      </div>
      <div class="control">
        <button
          class="button is-primary is-medium is-fullwidth"
          id="save-btn"
          on:click={submitForm}>
          Save
        </button>
      </div>
    </section>
  {/if}
</main>
