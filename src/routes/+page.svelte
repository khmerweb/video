    <script>
        import { base } from '$app/paths';
        let worker;
        let queryResult = $state(null);
        let errorMessage = $state(null);
        let formattedData = $state([]);

        $effect( async () => {
            worker = new Worker('/src/lib/db/worker.js', { type: 'module' });

            worker.onmessage = (e) => {
                const { type, results, error } = e.data;
                if (type === 'init_success') {
                    console.log('Database initialized in worker');
                    worker.postMessage({ type: 'query', payload: { sql: 'SELECT * FROM Post' } });
                } else if (type === 'init_error') {
                    errorMessage = `Worker initialization failed: ${error}`;
                } else if (type === 'query_success') {
                    queryResult = results;
                } else if (type === 'query_error') {
                    errorMessage = `Query failed: ${error}`;
                }
            };

            worker.postMessage({ type: 'init', payload: { dbPath: '/database.sqlite' } });
            
            const columns = queryResult[0].columns;
            const values = queryResult[0].values;

            formattedData = await values.map((row) => {
                const rowObject = {};
                columns.forEach((colName, index) => {
                    rowObject[colName] = row[index];
                });
                return rowObject;
            });

            worker.terminate();
        });

        
    </script>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if queryResult}
        <pre>{JSON.stringify(formattedData, null, 2)}</pre>
    {:else}
        <p>Loading database and executing query...</p>
    {/if}