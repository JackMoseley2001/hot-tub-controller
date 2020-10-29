<script>
  import TariffBox from './TariffBox.svelte';
  import TariffContainer from './TariffContainer.svelte';
  export let tariff;
</script>

<TariffContainer {tariff}>
  <TariffBox
    title={tariff.intervalStr}
    price={tariff.price}
    active={tariff.status}
    override={tariff.override} />
</TariffContainer>
