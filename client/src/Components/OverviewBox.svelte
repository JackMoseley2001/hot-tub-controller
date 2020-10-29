<script>
  export let cost, cpuTemp, waterTemp, status, targetTemp;
</script>

<div class="box">
  <p><b>Current Cost:</b> {cost != null ? `${cost}p` : 'N/A'}</p>
  <p><b>Current Status:</b> {status != null ? `${status ? 'On' : 'Off'}` : 'N/A'}</p>
  <br />
  <p><b>Pi Temperature:</b> {cpuTemp != null ? `${cpuTemp}` : 'N/A'}</p>
  <p><b>Water Temperature:</b> {waterTemp != null ? `${waterTemp}'C` : 'N/A'}</p>
  <p><b>Target Water Temperature:</b> {targetTemp != null ? `${targetTemp}'C` : 'N/A'}</p>
</div>
