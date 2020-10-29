<script>
  export let title, price, override, active;
</script>

<div class="tile is-parent">
  <div class="tile is-child box">
    <div class="columns">
      <div class="column">
        <h1 class="title">{title}</h1>
        <h2 class="subtitle">{price} p/KWh</h2>
        <slot />
        <p>Overriden: {override ? 'Yes' : 'No'}</p>
      </div>
      <div class="column">
        {#if active === false}
          <div class="status-box red" />
        {:else}
          <div class="status-box green" />
        {/if}
      </div>
    </div>
  </div>
</div>
