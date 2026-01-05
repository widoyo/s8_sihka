<script lang="ts">
    export let data;
</script>
<h1>Manajemen Device</h1>
{#each data.devices as dev }
    <div>
        <h2>{dev.nama}</h2>
        <p>ID Device: {dev.id}</p>
    </div>
{/each}