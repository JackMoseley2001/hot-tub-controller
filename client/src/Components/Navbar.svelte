<script>
  import { Navigate } from 'svelte-router-spa';
  import { meta } from '../store';
  import { onDestroy } from 'svelte';
  import { rebootServer } from '../network.js';

  let priceThreshold;

  const toggleBurgerMenu = () => {
    const navMenu = document.querySelector('.navbar-menu');
    const burgerMenu = document.querySelector('.navbar-burger');
    navMenu.classList.toggle('is-active');
    burgerMenu.classList.toggle('is-active');
  };

  const unsubscribe = meta.subscribe(val => {
    priceThreshold = val.priceThreshold;
  });

  const rebootPressed = () => {
    rebootServer();
  };

  onDestroy(unsubscribe);
</script>

<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      <p>
        Price Threshold: <span id="price-threshold"> <b>{priceThreshold != null ? `${priceThreshold} p/KWh` : 'N/A'}</b> </span>
      </p>
    </div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a role="button" class="navbar-burger" on:click={toggleBurgerMenu}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>
  <div class="navbar-menu" id="nav-menu">
    <div class="navbar-start">
      <a href="/" class="navbar-item" on:click={toggleBurgerMenu}>Dashboard</a>
      <a href="/graphs" class="navbar-item" on:click={toggleBurgerMenu}>Graphs</a>
      <a href="/config" class="navbar-item" on:click={toggleBurgerMenu}>Config</a>
      <a href="/logs" class="navbar-item" on:click={toggleBurgerMenu}>Logs</a>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <button class="button is-danger" on:click={rebootPressed}>Reboot</button>
      </div>
    </div>
  </div>
</nav>
