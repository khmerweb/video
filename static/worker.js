    // src/workers/dbWorker.js
    import initSqlJs from 'sql.js';
    import { dbState } from '../store/state.svelte.js';

    self.onmessage = async (e) => {
        console.log('Worker received message:');
        const { type, payload, basePath } = e.data;

        switch (type) {
            case 'init':
                try {
                    const SQL = await initSqlJs({
                        locateFile: file => `${basePath}${file}` 
                    });
                    const response = await fetch(payload.dbPath);
                    const buffer = await response.arrayBuffer();
                    dbState.db = new SQL.Database(new Uint8Array(buffer));
                    self.postMessage({ type: 'init_success' });
                } catch (error) {
                    self.postMessage({ type: 'init_error', error: error.message });
                }
                break;
            case 'query':
                try {
                    const results = dbState.db.exec(payload.sql);
                    self.postMessage({ type: 'query_success', results });
                } catch (error) {
                    self.postMessage({ type: 'query_error', error: error.message });
                }
                break;
            // Add other cases for updates, inserts, etc.
        }
    };