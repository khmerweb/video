    // src/workers/dbWorker.js
    import initSqlJs from 'sql.js';

    let db;

    self.onmessage = async (e) => {
        const { type, payload } = e.data;

        switch (type) {
            case 'init':
                try {
                    const SQL = await initSqlJs({
                        locateFile: file => `https://sql.js.org/dist/${file}` // Adjust path as needed
                    });
                    const response = await fetch(payload.dbPath);
                    const buffer = await response.arrayBuffer();
                    db = new SQL.Database(new Uint8Array(buffer));
                    self.postMessage({ type: 'init_success' });
                } catch (error) {
                    self.postMessage({ type: 'init_error', error: error.message });
                }
                break;
            case 'query':
                try {
                    const results = db.exec(payload.sql);
                    self.postMessage({ type: 'query_success', results });
                } catch (error) {
                    self.postMessage({ type: 'query_error', error: error.message });
                }
                break;
            // Add other cases for updates, inserts, etc.
        }
    };