// src/workers/dbWorker.js
import initSqlJs from 'sql.js';
let db = null;

self.onmessage = async (event) => {
    const { type, payload, basePath, categories } = event.data;
    
    switch (type) {
        case 'init':
            try {
                const SQL = await initSqlJs({
                    locateFile: file => `${basePath}${file}` 
                });
                const response = await fetch(payload.dbPath);
                const buffer = await response.arrayBuffer();
                db = new SQL.Database(new Uint8Array(buffer));
                self.postMessage({ type: 'init_success', db });
            } catch (error) {
                self.postMessage({ type: 'init_error', error: error.message });
            }
            break;
        case 'query':
            if(categories){
                try{
                    let results = []
                    for(let category of categories){
                        const sql = `SELECT * FROM Post WHERE categories LIKE '%${category}%' ORDER BY RANDOM() LIMIT 20`;
                        const posts = db.exec(sql);
                        const res = db.exec(`SELECT COUNT(*) FROM Post WHERE categories LIKE '%${category}%'`);
                        const rowCount = res[0].values[0][0];
                        posts.count = rowCount;
                        results.push(posts)
                    }
                    self.postMessage({ type: 'query_success', results, category: true });
                }catch (error) {
                    self.postMessage({ type: 'query_error', error: error.message });
                }
            }else{
                try {
                    const results = db.exec(payload.sql);
                    self.postMessage({ type: 'query_success', results });
                } catch (error) {
                    self.postMessage({ type: 'query_error', error: error.message });
                }
            }
            break;
        // Add other cases for updates, inserts, etc.
    }
            
};