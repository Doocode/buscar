<script>
import Search from './Search.svelte'
import SpeedDial from './SpeedDial.svelte'


</script>

<main id="homePage">
    <Search
        size="fit"
    />
    <SpeedDial
        size="fit"
        underHeader={false}
    />
</main>

<style lang="scss">
    :global(html[theme=white] main#speedialPage) {
        --mask-bg-color: #ffffffaa;
    }
    :global(html[theme=g10] main#speedialPage) {
        --mask-bg-color: #f4f4f4aa;
    }
    :global(html[theme=g80] main#speedialPage) {
        --mask-bg-color: #262626aa;
    }
    :global(html[theme=g90] main#speedialPage) {
        --mask-bg-color: #262626aa;
    }
    :global(html[theme=g100] main#speedialPage) {
        --mask-bg-color: #161616aa;
    }

    main#homePage :global(main#speedialPage) {
        padding: 50px 0;
        background-color: var(--mask-bg-color);
        backdrop-filter: blur(25px);
    }
</style>