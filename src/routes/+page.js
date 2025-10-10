// src/routes/+page.js
import { loadDatabase } from '$lib/db/db.svelte.js';

let categories = ['home','movie','travel','simulation','sport','documentary','food','music','game','news'];

export function load(params) {
    const data = loadDatabase(categories, 'front');
    return data
}