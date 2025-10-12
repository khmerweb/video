<script>
    import Ad from "$lib/components/Ad.svelte"
    import jq from 'jquery'
    let { data } = $props()
    console.log(data.latestPosts)
    let posts = $state(data.latestPosts)
    const dark = 'brightness(20%)'
    const normal = 'brightness(100%)'
    const laodingVideo = 'NcQQVbioeZk'
    let pageAmount = $state(Math.ceil(data.count/data.settings.frontend))
    let category = $state('')

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
    
    let latestMovies = parseVideos(data.postsByCategory[0])
    latestMovies.category = data.categories[0]
    let latestTravel = parseVideos(data.postsByCategory[1])
    latestTravel.category = data.categories[1]
    let latestSimulation = parseVideos(data.postsByCategory[2])
    latestSimulation.category = data.categories[2]
    let latestSport = parseVideos(data.postsByCategory[3])
    latestSport.category = data.categories[3]
    let latestDocumentary = parseVideos(data.postsByCategory[4])
    latestDocumentary.category = data.categories[4]
    let latestGame = parseVideos(data.postsByCategory[5])
    latestGame.category = data.categories[5]
    let latestMusic = parseVideos(data.postsByCategory[6])
    latestMusic.category = data.categories[6]
    let latestFood = parseVideos(data.postsByCategory[7])
    latestFood.category = data.categories[7]
    let latestVideos = parseVideos(data.latestPosts)
    latestVideos.category = data.categories[8]
    let latestNews = parseVideos(data.latestNews)
    latestNews.category = data.categories[9]

    let rawPlaylist = $state({
        home: data.latestPosts,
        news: data.latestNews,
        movie: data.postsByCategory[0],
        travel: data.postsByCategory[1],
        simulation: data.postsByCategory[2],
        sport: data.postsByCategory[3],
        documentary: data.postsByCategory[4],
        game: data.postsByCategory[5],
        music: data.postsByCategory[6],
        food: data.postsByCategory[7]
    })

    let playlistThumbs = $state({
        movie: rawPlaylist['movie'][0].thumb,
        travel: rawPlaylist['travel'][0].thumb,
        simulation: rawPlaylist['simulation'][0].thumb,
        sport: rawPlaylist['sport'][0].thumb,
        documentary: rawPlaylist['documentary'][0].thumb,
        game: rawPlaylist['game'][0].thumb,
        music: rawPlaylist['music'][0].thumb,
        food: rawPlaylist['food'][0].thumb,
    })

    let videoPlaylists = $state({
        home: latestVideos,
        news: latestNews,
        movie: latestMovies,
        travel: latestTravel,
        simulation: latestSimulation,
        sport: latestSport,
        documentary: latestDocumentary,
        game: latestGame,
        music: latestMusic,
        food: latestFood
    })
    
    async function getRandomPlaylist(category, thumbs){
		const response = await fetch(`/post/playlist/${category}`, {
			method: 'POST',
			body: JSON.stringify({ thumbs }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		const newPlaylist_ = await response.json()
        posts = newPlaylist_
        rawPlaylist[category] = newPlaylist_
        playlistThumbs[category] = newPlaylist_[0].thumb
        let newPlaylist = parseVideos(newPlaylist_)
        newPlaylist.category = category
        videoPlaylists[category] = newPlaylist
        return newPlaylist
	}

    async function newPlaylist(){
        player.unMute()
        player.loadVideoById(laodingVideo)
        if(player.playlist.category !== 'news'){
            player.playlist = await getRandomPlaylist(player.playlist.category, player.playlist.thumbs) 
        }
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
        player.part = 0
        if(player.playlist[player.part][0].type === "YouTubePlaylist"){
            player.loadVideoById(initialVideoId)
            player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
        }else{
            player.index = 0
            if(!(player.playlist[player.part].reversal)){
                player.playlist[player.part].reverse()
                player.playlist[player.part].reversal = true
            }
            player.loadVideoById(player.playlist[player.part][0].id)
        }
        
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
    }

    function loadVideo(playlist){
        if(playlist[0][0].type === "YouTubePlaylist"){
            player.loadPlaylist({list:playlist[0][0].id,listType:'playlist',index:0})
        }else{
            playlist[0].reverse()
            playlist[0].reversal = true
            player.loadVideoById(playlist[0][0].id)
        }
        jq('.Home .container .wrapper:nth-child(1) img').css({'filter':dark})
        jq('.Home .container .wrapper:nth-child(1) p').css({'display':'block'})
    }

    function onPlayerReady(event) {
        player.part = 0
        player.index = 0
        player.thumb = 1
        player.label = 'ទំព័រ​ដើម'
        player.playlist = latestVideos 
        loadVideo(latestVideos )
    }

    function changeCategory(playlist, label, obj=0, thumb=0, part=0) {
        if(obj){posts = obj}
        if(label){player.label = label}
        if(playlist){player.playlist = playlist}

        if(player.playlist.category === 'home'){
            category = ''
            pageAmount = Math.ceil(data.count/data.settings.frontend)
        }else{
            category = '/' + player.playlist.category
            pageAmount = Math.ceil(data.counts[player.playlist.category]/data.settings.frontend)
        }

        if((player.playlist.category === 'home')||(player.playlist.category === 'news')){
            jq(`.random-video button:nth-child(${player.thumb}) img`).css({'filter':normal})
            jq(`.random-video button:nth-child(${player.thumb}) .playing`).css({'display':'none'})
        }
        if(thumb){
            jq(`.random-video button:nth-child(${player.thumb}) img`).css({'filter':normal})
            jq(`.random-video button:nth-child(${player.thumb}) .playing`).css({'display':'none'})
            player.thumb = thumb
            jq(`.random-video button:nth-child(${player.thumb}) img`).css({'filter':dark})
            jq(`.random-video button:nth-child(${player.thumb}) .playing`).css({'display':'block'})
        }
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
        player.part = part
        player.unMute()
        if(player.playlist[player.part][0].type === "YouTubePlaylist"){
            player.loadVideoById(initialVideoId)
            player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
            jq('.latest-video').html(player.label)
        }else{
            if(!(player.playlist[player.part].reversal)){
                player.playlist[player.part].reverse()
                player.playlist[player.part].reversal = true
            }
            player.loadVideoById(player.playlist[player.part][0].id)
            jq('.latest-video').html(player.label)
            
        }
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
        jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
    }

    function onPlayerError(event){
        if(player.index + 1 < player.playlist[player.part].length){
            player.index += 1
            player.loadVideoById(player.playlist[player.part][player.index].id)
        }else{
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
            player.part += 1
            if(player.part === player.playlist.length){
                player.part = 0
            }

            if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                player.loadVideoById(initialVideoId)
                player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
            }else{
                player.index = 0
                if(!(player.playlist[player.part].reversal)){
                    player.playlist[player.part].reverse()
                    player.playlist[player.part].reversal = true
                }
                player.loadVideoById(player.playlist[player.part][0].id)
            }
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
            jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
        }
    }

    async function onPlayerStateChange(event) {   
        if(event.data === YT.PlayerState.ENDED){
            if(player.index + 1 < player.playlist[player.part].length){
                player.index += 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
                
            }else{
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
                player.part += 1
                if(player.part === player.playlist.length){
                    player.loadVideoById(laodingVideo)
                    if(player.playlist.category !== 'news'){
                        player.playlist = await getRandomPlaylist(player.playlist.category, player.playlist.thumbs)
                    }
                    player.part = 0
                }

                if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                    player.loadVideoById(initialVideoId)
                    player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
                }else{
                    player.index = 0
                    if(!(player.playlist[player.part].reversal)){
                        player.playlist[player.part].reverse()
                        player.playlist[player.part].reversal = true
                    }
                    player.loadVideoById(player.playlist[player.part][0].id)
                }
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
            }
        }
    }

    function nextPrevious(move){
        player.unMute()
        if(move === "next"){
            if(player.index + 1 < player.playlist[player.part].length){
                player.index += 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
            }else{
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
                player.part += 1
                if(player.part === player.playlist.length){
                    player.part = 0
                }

                if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                    player.loadVideoById(initialVideoId)
                    player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
                }else{
                    player.index = 0
                    if(!(player.playlist[player.part].reversal)){
                        player.playlist[player.part].reverse()
                        player.playlist[player.part].reversal = true
                    }
                    player.loadVideoById(player.playlist[player.part][0].id)
                }
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
            }
        }else if(move === "previous"){
            if(player.index > 0){
                player.index -= 1
                player.loadVideoById(player.playlist[player.part][player.index].id)
            }else{
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':normal})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'none'})
                player.part -= 1
                if(player.part < 0){
                    player.part = player.playlist.length - 1
                }

                if(player.playlist[player.part][0].type === "YouTubePlaylist"){
                    player.loadVideoById(initialVideoId)
                    player.loadPlaylist({list:player.playlist[player.part][0].id,listType:'playlist',index:0})
                }else{
                    player.index = 0
                    if(!(player.playlist[player.part].reversal)){
                        player.playlist[player.part].reverse()
                        player.playlist[player.part].reversal = true
                    }
                    player.loadVideoById(player.playlist[player.part][0].id)
                }
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) img`).css({'filter':dark})
                jq(`.Home .container .wrapper:nth-child(${player.part+1}) p`).css({'display':'block'})
            }
        }
    }

    const ytPlayerId = 'youtube-player'
    let initialVideoId = 'cdwal5Kw3Fc'
    let player

    
    function load() {
        player = new YT.Player(ytPlayerId, {
            height: '390',
            width: '640',
            videoId: initialVideoId,
            playerVars: {
                'playsinline': 1,
                "enablejsapi": 1,
                "mute": 1,
                "autoplay": 1,
                "rel": 0,
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        })
    }
        
    $effect(() => {
        window.YT?.ready(function() {
            if (window.YT) {
                load()
            } else {
                window.onYouTubeIframeAPIReady = load
            }
        })
    })
</script>

<svelte:head>
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<section class="main region">
    <div class="feature-post">
        <div class="random-video">
            <button  onclick={()=>changeCategory(videoPlaylists.movie, 'ភាពយន្ត​​​', rawPlaylist.movie, 1)}>
                <img alt='' src={playlistThumbs.movie} />
                <p class="news-label">{data.counts.movie} ភាពយន្ត</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.travel, 'ដើរ​លេង​​​​​', rawPlaylist.travel, 2)}>
                <img alt='' src={playlistThumbs.travel} />
                <p class="movies-label">{data.counts.travel} ដើរ​លេង</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.simulation, '​ពិភព​និម្មិត​', rawPlaylist.simulation, 3)}>
                <img alt='' src={playlistThumbs.simulation} />
                <p class="movies-label">{data.counts.simulation} ពិភព​និម្មិត</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.sport, '​កីឡា​​​', rawPlaylist.sport, 4)}>
                <img alt='' src={playlistThumbs.sport} />
                <p class="movies-label">{data.counts.sport} កីឡា</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.documentary, '​ឯកសារ​​​​​', rawPlaylist.documentary, 5)}>
                <img alt='' src={playlistThumbs.documentary} />
                <p class="movies-label">{data.counts.documentary} ​ឯកសារ</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.food, 'មុខ​ម្ហូប​​​​', rawPlaylist.food, 6)}>
                <img alt='' src={playlistThumbs.food} />
                <p class="news-label">{data.counts.food} ​មុខ​ម្ហូប</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.music, 'របាំ​តន្ត្រី​​​​​', rawPlaylist.music, 7)}>
                <img alt='' src={playlistThumbs.music} />
                <p class="news-label">{data.counts.music} របាំ​តន្ត្រី</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <button onclick={()=>changeCategory(videoPlaylists.game, 'ល្បែងកំសាន្ត​​​​', rawPlaylist.game, 8)}>
                <img alt='' src={playlistThumbs.game} />
                <p class="news-label">{data.counts.game} ល្បែងកំសាន្ត</p>
                <span class='playing'>កំពុង​លេង...</span>
            </button>
            <div class="wrapper">
                <div id={ytPlayerId}></div>
                <div class="latest-video">ទំព័រ​ដើម</div>
                <div class="channel-logo">
                    <img src="/images/siteLogo.png" alt=''/>
                </div>
                <div class="play-all">
                    <button onclick={()=>changeCategory(videoPlaylists.home, 'ទំព័រ​ដើម', rawPlaylist.home)} class='center'>ទំព័រ​ដើម</button>
                    <button onclick={()=>changeCategory(videoPlaylists.news, 'ព័ត៌មាន', rawPlaylist.news)} class='center'>ព័ត៌មាន</button>
                    <button onclick={()=>nextPrevious('previous')}>វីដេអូមុន</button>
                    <button onclick={newPlaylist} class='new-playlist'>ដូរ​កំរង​វីដេអូ​</button>
                    <button onclick={()=>nextPrevious('next')}>វីដេអូបន្ទាប់</button>
                </div>
            </div>
            
        </div>
    </div>
    <Ad />
</section>

<section class="Home region">
    <div class="container">
        {#each posts as post, index}
            <div class="wrapper" onclick={()=>changeCategory(false, false, false, false, index)}>
                <button>
                    <img src={post.thumb} alt=''/>
                    {#if post.videos.length}
                    <img class="play-icon" src="/images/play.png" alt=''/>
                    {/if}
                    <p>កំពុង​លេង...</p>
                </button>
                <div class="date">{(new Date(post.date)).toLocaleDateString('it-IT')}</div>
                <div class="title">{post.title}</div>
            </div>
        {/each}
    </div>
    <div class="navigation">
        <span>ទំព័រ </span>
        <select onchange={(event)=>{document.location = `${category}/${event.target.value}`}}>
            {#each [...Array(pageAmount).keys()] as pageNumber}
                <option>{pageNumber+1}</option>
            {/each}
        </select>
        <span> នៃ {pageAmount}</span>
    </div>
</section>

<style>
    
    .random-video{
        display: grid;
        grid-template-columns: calc(33.33% - 6.66px) calc(33.33% - 6.66px) calc(33.33% - 6.66px);
        grid-gap: 10px;
        padding: 10px 0 0;
    }
    .random-video .wrapper{
        grid-column: 2 / span 2;
        grid-row: 2 / span 2;
        position: relative;
        padding-top: 53%;
    }
    .random-video button{
        position: relative;
        width: 100%;
        height: 100%;
        padding-top: 53.4%;
        border: none;
    }
    .random-video button:hover{
        cursor: pointer;
        opacity: .7;
    }
    .random-video button img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .random-video button p{
        position: absolute;
        top: 0;
        left: 0;
        background: var(--background-dark);
        color: white;
        text-align: center;
        font-family: Vidaloka, OdorMeanChey;
        padding: 5px;
        min-width: 90px;
    }
    .random-video button .playing{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: Vidaloka, OdorMeanChey;
        color: orange;
        display: none;
    }
    .random-video .latest-video{
        position: absolute;
        top: 5px;
        left: 10px;
        color: orange;
    }
    .random-video .channel-logo img{
        position: absolute;
        top: 5px;
        right: 5px;
        width: 6%;
    }
    .random-video .wrapper .play-all{
        position: relative;
        bottom: 7px;
        text-align: center;
        visibility: hidden;
        display: flex;
        justify-content: center;
        align-content: center;
        gap: 15px;
    }
    .random-video .wrapper .play-all button{
        color: orange;
        padding-top: 0;
        width: auto;
        background-color: transparent;
        font-family: Vidaloka, OdorMeanChey;
        border: none;
    }
    .random-video .wrapper .play-all:hover{
        cursor: pointer;
    }
    .random-video .wrapper:hover .play-all{
        visibility: visible;
    }
    .random-video .wrapper #youtube-player{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .Home .container{
        display: grid;
        grid-template-columns: repeat(4, calc(100% / 4 - 11.25px));
        grid-gap: 30px 15px;
        padding: 15px 0;
    }
    .Home .container .wrapper button{
        position: relative;
        padding-top: 56.25%;
        overflow: hidden;
        width: 100%;
        display: block;
        border: none;
    }
    .Home .container .wrapper .title{
        padding-top: 5px !important;
        line-height: 1.25;
    }
    .Home button:hover,
    .Home .container .wrapper .title:hover{
        cursor: pointer;
        opacity: .7;
    }
    .Home .container .wrapper button img{
        position: absolute;
        width: 100%;
        min-height: 100%;
        top: 0;
        left: 0;
    }
    .Home .container .wrapper button .play-icon{
        width: auto;
        min-height: auto;
        width: 15%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
    }
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }
    .Home .container .wrapper button p{
        position: absolute;
        top: 0;
        left: 0;
        padding: 2px 5px;
        color: orange;
        font-family: Vidaloka, OdorMeanChey;
        display: none;
        animation: blink 1s steps(2) infinite;
    }
    .Home .container .wrapper .title{
        padding-top: 0;
    }
    .Home .navigation{
        text-align: center;
        padding-bottom: 30px;
    }
    
    @media only screen and (max-width: 600px){
        .random-video{
            grid-template-columns: 100%;
            padding: 10px;
        }
        .random-video .wrapper{
            grid-column: 1 / span 1;
            grid-row: 1 / span 1;
            padding-top: 51.7%;
        }
        .Home .container{
            grid-template-columns: 100%;
            padding: 30px 10px;
        }
    }   
    </style>