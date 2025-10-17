<script>
    let { data, children } = $props()
    import Header from "$lib/components/Header.svelte"
    import Menu from "$lib/components/Menu.svelte"
    import Ad from "$lib/components/Ad.svelte"
    import Footer from "$lib/components/Footer.svelte"
</script>

<svelte:head>
    <title>Test</title>
    <link href="/fonts/setup.css" rel="stylesheet" />
    <link href="/styles/base-frontend.css?001" rel="stylesheet" />
</svelte:head>

<Header { data } />
<Menu { data } />
<Ad />

{@render children()}
<Footer />