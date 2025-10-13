// src/routes/+page.js
import { browser } from '$app/environment';

export async function load({ fetch}) {
    const response = await fetch('http://localhost:8000/api?amount=20');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    data.settings = {}
    data.settings.frontend = 20
    return data;
}
