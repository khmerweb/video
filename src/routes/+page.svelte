    <script>
        import { base } from '$app/paths';
        import { loadDatabase } from '$lib/db/db.svelte.js';
        //import { dbStore } from '../store/state.svelte.js';

        let formattedData = $state([]);

    $effect(async () => {
        if(formattedData.length === 0){
            formattedData = await loadDatabase();
        }
    });
    </script>

    {#if formattedData.length > 0}
        <pre>{JSON.stringify(formattedData, null, 2)}</pre>
    {:else}
        <p>Loading database and executing query...</p>
    {/if}
