// src/routes/+page.js
import { browser } from '$app/environment';

export async function load({ fetch}) {
    const response = await fetch('http://localhost:5174/api');
    const data = await response.json()
    return data;
}