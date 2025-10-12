// src/routes/+page.js
import { browser } from '$app/environment';
import { loadDatabase } from '$lib/db/db.svelte.js';

let categories = ['home','movie','travel','simulation','sport','documentary','food','music','game','news'];

export function load({ setHeaders }) {
    if(browser){
        const data = loadDatabase(categories, 'front');
        setHeaders({
            'Cache-Control': 'public, max-age=7200' 
        });
        return data;
    }
}