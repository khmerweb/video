<script>
    import { dbStore } from '$lib/store/state.svelte.js';
    import Ad from "$lib/components/Ad.svelte"
    import jq from 'jquery';
    import { loadDatabase } from '$lib/db/db.svelte.js';
    let categories = ['movie','travel','simulation','sport','documentary','food','music','game','news'];

    let { data } = $props();
    let mydata = $state(dbStore.data);
    let posts = $state([]);
    let load = $state(false);

    let videoMovie = $state([]);
    let videoTravel = $state([]);
    let videoSimulation = $state([]);
    let videoSport = $state([]);
    let videoDocumentary = $state([]);
    let videoFood = $state([]);
    let videoMusic = $state([]);
    let videoGame = $state([]);
    let videoNews = $state([]);

    function parseVideos(posts){
        let videos = []
        let thumbs = []
        for(let post of posts){
            videos.push(JSON.parse(post.videos))
            thumbs.push(post.thumb)
        }
        videos.thumbs = thumbs
        return videos
    }

    $effect(()=>{
        posts = data.news;
        if(posts?.length > 0){
            videoMovie = parseVideos(data.movie);
            videoTravel = parseVideos(data.travel);
            videoSimulation = parseVideos(data.simulation);
            videoSport = parseVideos(data.sport);
            videoDocumentary = parseVideos(data.documentary);
            videoFood = parseVideos(data.food);
            videoGame = parseVideos(data.game);
            videoNews = parseVideos(data.news);
        }
    });
    
</script>

<section class="Category region">
    <div class="container">
        {#each posts as post, index}
        <div class="wrapper">
            <button onclick={playVideo(index)}>
                <img src={post.thumb} alt=''/>
                {#if post.videos.length}
                <img class="play-icon" src="/images/play.png" alt=''/>
                {/if}
            </button>
            <div class="date">{(new Date(post.date)).toLocaleDateString('it-IT')}</div>
            <button class="title" onclick={playVideo(index)}>
                <div >{post.title}</div>
            </button>
        </div>
        {/each}
    </div>
    
    <div class="pagination">
        <span>ទំព័រ </span>
        <select onchange={(event)=>{document.location = `/${event.target.value}`}}>
            {#each [...Array(data?.lastPage).keys()] as pageNumber}
                {#if pageNumber+1 == data?.currentPage}
                <option selected>{pageNumber+1}</option>
                {:else}
                <option>{pageNumber+1}</option>
                {/if}
            {/each}
        </select>
        <span> នៃ {data?.lastPage}</span>
    </div>
</section>

<style>

.Category .container{
    display: grid;
    grid-template-columns: repeat(4, calc(100% / 4 - 11.25px));
    grid-gap: 30px 15px;
    padding: 30px 0;
}
.Category .container .wrapper button{
    all: unset;
    width: 100%;
    display: block;
    color: var(--color);
    position: relative;
    padding-top: 56.25%;
}
.Category .container .wrapper button:hover{
    cursor: pointer;
    opacity: .7;
}
.Category .container .wrapper button img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    float: left;
}
.Category .container .wrapper button .play-icon{
    width: auto;
    height: auto;
    width: 15%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.Category .container .wrapper .date{
    padding-top: 5px;
}
.Category .container .wrapper .title{
    all: unset;
}
.Category .container .wrapper .title div{
    padding-top: 5px;
}
.Category .pagination{
    display: block;
    text-align: center;
    padding-bottom: 30px;
}
@media only screen and (max-width:600px){
    .Category .container{
        grid-template-columns: 100%;
        padding: 30px 10px;
    }
}
</style>