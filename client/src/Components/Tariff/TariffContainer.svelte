<script>
  import * as stores from '../../store';
  import { get } from 'svelte/store';
  import { overrideTariff } from '../../network.js';

  export let tariff;

  const selected = () => {
    overrideTariff(tariff.id);
  };
</script>

<div class="tariff-container tile is-parent" on:click={selected}>
  <slot />
</div>
