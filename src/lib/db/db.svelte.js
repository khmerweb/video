// src/lib/db/db.js
import MyWorker from '$lib/db/myworker.js?worker';
import { dbStore } from '../store/state.svelte.js';
let worker;
let queryResult = $state(null);
let errorMessage = $state(null);
let formattedData = $state([]);

export async function loadDatabase(base) {
    const worker = new MyWorker();
    worker.onmessage = async (event) => {
        const { type, results, error } = event.data;
                
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
                
        const columns = queryResult[0].columns;
        const values = queryResult[0].values;
        formattedData = values.map((row) => {
            const rowObject = {};
            columns.forEach((colName, index) => {
                rowObject[colName] = row[index];
            });
            return rowObject;
        });
            
        dbStore.db = formattedData;
        worker.terminate();
    };
           
    const getBasePath = () => {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1] === 'video') {
            return `/${pathParts[1]}/`;
        }
        return '/'; 
    };

    worker.postMessage({ type: 'init', payload: { dbPath: `${getBasePath()}database.sqlite` }, basePath: getBasePath() });
            
    //worker.terminate();

    return formattedData;
}

export function executeSqlInWorker(sql) {
    
}

