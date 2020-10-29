<script>
  import { Router } from 'svelte-router-spa';
  import Home from './Pages/Home.svelte';
  import Navbar from './Components/Navbar.svelte';
  import Config from './Pages/Config.svelte';
  import Layout from './Pages/layout.svelte';
  import { onMount } from 'svelte';
  import { fetchMetaData } from './network';
  import Logs from './Pages/Logs.svelte';
  import Graphs from './Pages/Graphs.svelte';

  const routes = [
    {
      name: '/',
      component: Home,
      layout: Layout
    },
    {
      name: '/config',
      component: Config,
      layout: Layout
    },
    {
      name: '/logs',
      component: Logs,
      layout: Layout
    },
    {
      name: '/graphs',
      component: Graphs,
      layout: Layout
    }
  ];

  onMount(fetchMetaData);
</script>

<Router {routes} />
