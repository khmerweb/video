<script>
    import { base } from '$app/paths';
    import { dbStore } from '$lib/store/state.svelte.js';
    //let { data } = $props()
    import Layout from '$lib/components/Layout.svelte'
    import Home from "$lib/components/Home.svelte"
	import { loadDatabase } from '$lib/db/db.svelte.js';

    let data = $state(null);
    let formattedData = $state([]);
    let load = $state(false);
    
    let categories = ['movie','travel','simulation','sport','documentary','food','music','game','news'];
    $effect( ()=>{
        if(!load){
            data = loadDatabase(categories);
            load = true;
        }
    });
    
</script>
{#if dbStore.data}
<Layout data ={ dbStore.data } >
    <Home data ={ dbStore.data } />
</Layout>
{/if}