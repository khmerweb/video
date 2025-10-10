<script>
    import { base } from '$app/paths';
    import { dbStore } from '$lib/store/state.svelte.js';
    //let { data } = $props()
    import Layout from '$lib/components/Layout.svelte'
    import Home from "$lib/components/Home.svelte"
	import { loadDatabase } from '$lib/db/db.svelte.js';

    let data = $state([]);
    let load = $state(false);
    
    let categories = ['home','movie','travel','simulation','sport','documentary','food','music','game','news'];
    $effect( ()=>{
        if(!load){
            data = loadDatabase(base, categories);
            load = true;
        }
    });
    
</script>

<Layout data ={ dbStore.data } >
    <Home data ={ dbStore.data } />
</Layout>