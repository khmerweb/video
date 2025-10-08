    <script>
        import { base } from '$app/paths';
        import { loadDatabase } from '$lib/db/db.svelte.js';
        
        let worker;
        let queryResult = $state(null);
        let errorMessage = $state(null);
        let formattedData = $state([]);

        

        $effect(async () => {
            formattedData = await loadDatabase(base);
        });
    </script>
{formattedData.length}
    {#if formattedData.length > 0}
        <pre>{JSON.stringify(formattedData, null, 2)}</pre>
    {:else}
        <p>Loading database and executing query...</p>
    {/if}