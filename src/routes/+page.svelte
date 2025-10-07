    <script>
        import { base } from '$app/paths';
        let worker;
        let queryResult = $state(null);
        let errorMessage = $state(null);
        let formattedData = $state([]);

        $effect( async () => {
            const worker = new Worker(new URL('/src/lib/db/worker.js', import.meta.url), { type: 'module' });

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

            const getBasePath = () => {
                const pathParts = window.location.pathname.split('/');
                if (pathParts.length > 1 && pathParts[1] === 'static-sqlite') {
                    return `/${pathParts[1]}/`;
                }
                return '/'; 
            };

            worker.postMessage({ type: 'init', payload: { dbPath: `${getBasePath()}database.sqlite` }, basePath: getBasePath() });
            
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