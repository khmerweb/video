    <script>
        import { base } from '$app/paths';
        import { loadDatabase } from '$lib/db/db.svelte.js';
        //import MyWorker from '$lib/db/myworker.js?worker';
        
        let formattedData = $state([]);
        let message = '';

        $effect(async () => {
            formattedData = await loadDatabase(base);
            /*const myWorker = new MyWorker();
            myWorker.postMessage('Hello from Svelte!');
            myWorker.onmessage = (event) => { 
                message = event.data;
                alert(event.data);
            };*/
        });
    </script>

    {#if formattedData.length > 0}
        <pre>{JSON.stringify(formattedData, null, 2)}</pre>
    {:else}
        <p>Loading database and executing query...</p>
    {/if}