    <script>
        import { base } from '$app/paths';
        import { loadDatabase } from '$lib/db/db.svelte.js';
        
        let formattedData = $state([]);  

        $effect(async () => {
            formattedData = await loadDatabase(base);
        });
    </script>

    {#if formattedData.length > 0}
        <pre>{JSON.stringify(formattedData, null, 2)}</pre>
    {:else}
        <p>Loading database and executing query...</p>
    {/if}