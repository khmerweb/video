// src/lib/db/db.js
import { base } from '$app/paths';
import MyWorker from '$lib/db/myworker.js?worker';
import { dbStore } from '../store/state.svelte.js';
let worker = $state(null);
let queryResult = $state(null);
let errorMessage = $state(null);

export function loadDatabase(arg, kind, thumbs=[]) {
    if(!worker){
        worker = new MyWorker();
    }
    
    return new Promise((resolve, reject) => {
        worker.onmessage = async (event) => {
            const { type, results, error, _kind } = await event.data;
                        
            if (type === 'init_success') {
                console.log('Database initialized in worker');
                worker.postMessage({ arg, kind, thumb: JSON.stringify(thumbs), type: 'query' });
            } else if (type === 'init_error') {
                errorMessage = `Worker initialization failed: ${error}`;
            } else if (type === 'query_success') {
                queryResult = await results;
                if(_kind === 'front'){
                    const posts = {}
                    for(let i in arg){
                        const columns = queryResult[i][0].columns;
                        const values = queryResult[i][0].values;
                        posts[arg[i]] = (values.map((row) => {
                            const rowObject = {};
                            columns.forEach((colName, index) => {
                                rowObject[colName] = row[index];
                            });
                            return rowObject;
                        }));
                        posts[arg[i]].count = queryResult[i].count;
                        posts[arg[i]].category = arg[i];
                    }
                    
                    const pageURL = '/';
                    const currentPage = 1;
                    const lastPage = Math.ceil(posts.home.count / 20);
                    resolve({ posts, pageURL, currentPage, lastPage });
                }else if(_kind === 'random'){
                    const columns = queryResult[0].columns;
                    const values = queryResult[0].values;
                    const posts = (values.map((row) => {
                        const rowObject = {};
                        columns.forEach((colName, index) => {
                            rowObject[colName] = row[index];
                        });
                        return rowObject;
                    }));

                    resolve({ posts });
                }

            //worker.terminate();

            } else if (type === 'query_error') {
                errorMessage = `Query failed: ${error}`;
            } 
        }
        
        worker.postMessage({ type: 'init', payload: { dbPath: `${base}/database.sqlite` }, basePath: base });
    })
}
