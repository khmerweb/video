// src/routes/+page.js
import { browser } from '$app/environment';

export async function load({ fetch}) {
    const response = await fetch('https://khmertube-api.deno.dev/api');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data;
}
