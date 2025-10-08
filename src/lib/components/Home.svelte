<script>
    import Ad from "$lib/components/Ad.svelte"
    import jq from 'jquery'
    let { data } = $props()

</script>

<section class="Category region">
    <div class="container">
        {#each data.news as post, index}
        <div class="wrapper">
            <a href={`/post/${post.id}`}>
                <img src={post.thumb} alt=''/>
                {#if post.videos.length}
                <img class="play-icon" src="/images/play.png" alt=''/>
                {/if}
            </a>
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
            {#each [...Array(data.lastPage).keys()] as pageNumber}
                {#if pageNumber+1 == data.currentPage}
                <option selected>{pageNumber+1}</option>
                {:else}
                <option>{pageNumber+1}</option>
                {/if}
            {/each}
        </select>
        <span> នៃ {data.lastPage}</span>
    </div>
</section>

<style>

.Category .container{
    display: grid;
    grid-template-columns: repeat(4, calc(100% / 4 - 11.25px));
    grid-gap: 30px 15px;
    padding: 30px 0;
}
.Category .container .wrapper a{
    width: 100%;
    display: block;
    color: var(--color);
    position: relative;
    padding-top: 56.25%;
}
.Category .container .wrapper a img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    float: left;
}
.Category .container .wrapper a .play-icon{
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