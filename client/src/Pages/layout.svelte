<script>
  import { Route } from 'svelte-router-spa';
  import Navbar from '../Components/Navbar.svelte';
  export let currentRoute;
  const params = {};
</script>

<div class="app">
  <Navbar />
  <Route {currentRoute} {params} />
</div>
