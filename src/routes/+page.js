// src/routes/+page.js
import { browser } from '$app/environment';

export async function load({ fetch}) {
    const response = await fetch('https://khmertuber.netlify.app/api');
    const data = await response.json()
    return data;
}