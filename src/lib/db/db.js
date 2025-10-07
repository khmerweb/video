// src/lib/db/db.js
/*
export async function loadDatabase() {
    const worker = new Worker("src/lib/db/worker.js");
    let result
    worker.onmessage = function(event){
        result = event.data;
        alert(result);
    };

    worker.postMessage('Message received');
    return result;
}

export function executeSqlInWorker(sql) {
    
}
*/
export function executeSqlInWorker(sql) {
    if (window.Worker) {
        const myWorker = new Worker('worker.js');
        myWorker.postMessage(10);
        myWorker.onmessage = function(event) {
            const result = event.data; 
            alert(result); 
        };
    }
    
}