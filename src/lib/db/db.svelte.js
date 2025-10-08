// src/lib/db/db.js
let worker;
let queryResult = $state(null);
let errorMessage = $state(null);
let formattedData = $state([]);

export async function loadDatabase() {
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
                if (pathParts.length > 1 && pathParts[1] === 'video') {
                    return `/${pathParts[1]}/`;
                }
                return '/'; 
            };
alert(getBasePath());
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

        return formattedData;
}

export function executeSqlInWorker(sql) {
    
}

