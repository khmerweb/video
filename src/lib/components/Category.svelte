<!--src/components/Pagination.astro-->
<script>
    let { data } = $props()
</script>

<section class="Category region">
    <div class="container">
        {#each data.posts as post}
            <div class="wrapper">
                <a href={`/post/${post.id}`}>
                    <img src={post.bookThumb} alt=""/>
                </a>
            </div>
        {/each}
    </div>
    <div class="pagination">
        <span>ទំព័រ </span>
        <select onchange={(event)=>{document.location = `/${data.category}/${event.target.value}`}}>
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
    padding: 15px 0 30px;
}
.Category .container .wrapper a{
    width: 100%;
    display: block;
    position: relative;
    padding-top: 140.26%;
}
.Category .container .wrapper a img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    float: left;
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