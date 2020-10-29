<script>
  import TariffBox from './TariffBox.svelte';
  import TariffContainer from './TariffContainer.svelte';
  export let tariff, title;
</script>

<TariffContainer {tariff}>
  <TariffBox {title} price={tariff.price} active={tariff.status} override={tariff.override}>
    <h3 class="title is-5 time-interval">{tariff.intervalStr}</h3>
  </TariffBox>
</TariffContainer>
