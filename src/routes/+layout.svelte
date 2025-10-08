<script>
	import favicon from '$lib/assets/favicon.png';
	let { children } = $props();
	import { dbStore } from '$lib/store/state.svelte.js';
	import { loadDatabase } from '$lib/db/db.svelte.js';
    
    $effect(async () => {
        if(dbStore.db.length === 0){
            await loadDatabase();
        }
    });

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}