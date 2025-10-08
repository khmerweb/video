<script>
    import { base } from '$app/paths';
    import { dbStore } from '$lib/store/state.svelte.js';
    //let { data } = $props()
    import Layout from '$lib/components/Layout.svelte'
    import Home from "$lib/components/Home.svelte"

    let data = $state({});
    
    let categories = ['movie','travel','simulation','sport','documentary','food','music','game','news'];
    $effect(()=>{
        if(dbStore.db.length > 0){
            for(let category of categories){
                let posts = dbStore.db.filter(post => post.categories.includes(category));
                data[category] = posts;
            }
            data.lastPage = Math.ceil(dbStore.db.length/20);
            
            data.currentPage = 1;
        }
    });
    
</script>

<Layout { data } >
    <Home { data } />
</Layout>
    