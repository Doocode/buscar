<script>
    // Exports
    /**
     * Le type de l'icône (pour les sites web uniquement)
     * @type {'image' | 'text'}
     */
    export let type = 'image'

    /**
     * La valeur de l'icône (texte, icofont, url ou searchProfile)
     * @type {string}
     */
    export let value = ''

    /**
     * La taille de l'image
     * @type {'small' | 'medium' | 'cover'}
     */
    export let imageSize = 'cover'

    /**
     * La couleur de fond
     * @type {string}
     */
    export let bgColor = '#777777'

    /**
     * Le type du marque-page
     * @type {string}
     */
    export let bookmarkType = ''

    /**
     * Le nom du marque-page
     * @type {string}
     */
    export let name = ''

    /**
     * La liste des moteurs de recherche
     * @type {array}
     */
    export let searchEnginesIds = []



    // Imports
    import { BookmarkTypes }
        from '../../Classes/Bookmarks/BookmarkType'
    import { listSearchEngines }
        from '../../Stores/search';
    import Icofont
        from '../Icofont.svelte'
    import SearchEnginesBubbles
        from '../SearchEnginesBubbles.svelte'



    // Propriétés
    let size = 100



    // Réactivité
    $: centerContent = [
        BookmarkTypes.directory,
        BookmarkTypes.website,
        BookmarkTypes.searchProfile
    ].includes(bookmarkType)
    $: logoCover = (bookmarkType == BookmarkTypes.website && imageSize == 'cover')
        || bookmarkType == BookmarkTypes.searchEngine
    $: folderIconSize = size * .7
    $: textIconSize = size * .3
    $: searchProfileIconSize = size * .50
    $: searchProfileIconGap = size * .05
    $: bubblesSize = size * .22
    $: style = getTextCss(bgColor)



    // Fonctions
    const getTextCss = () => {
        return '--bg-color: '+bgColor+'; '
            +'--sp-icon-gap:'+searchProfileIconGap+'px; '
            +'--icon-text-size: '+textIconSize+'px; '
    }
    const dataForBubbles = listId => {
        let searchEngines = []
        listId.forEach(id => {
            // Recherche du moteur de recherche
            let results = $listSearchEngines.filter(item => parseInt(item.id) == parseInt(id))
            if (results.length > 0)
                searchEngines.push(results[0])
        })
        return searchEngines
    }
</script>

<main class="bk-icon"
    class:square={bookmarkType != BookmarkTypes.searchEngine}
    class:rounded={bookmarkType == BookmarkTypes.searchEngine}
    class:center-ctn={centerContent}
    class:logo-text={bookmarkType == BookmarkTypes.website && type == 'text'}
    class:logo-small={bookmarkType == BookmarkTypes.website && imageSize == 'small'}
    class:logo-medium={bookmarkType == BookmarkTypes.website && imageSize == 'medium'}
    class:logo-cover={logoCover}
    class:flow-column={bookmarkType == BookmarkTypes.searchProfile}
    bind:offsetWidth={size}
    {style}
>
    {#if bookmarkType == BookmarkTypes.directory}

        <Icofont icon="folder_close" size={folderIconSize} />

    {:else if bookmarkType == BookmarkTypes.website}

        {#if type == 'image'}
            <img src={value} title={name}
                alt={"Icône/logo de " + name}>
        {:else if type == 'text'}
            <p>{value}</p>
        {/if}

    {:else if bookmarkType == BookmarkTypes.searchEngine}

        <img src={value} title={name}
            alt={"Logo de " + name}>

    {:else if bookmarkType == BookmarkTypes.searchProfile}

        {#if size > 100}
            <Icofont icon={value} size={searchProfileIconSize} />
            <div class="bx-bubbles">
                {#if searchEnginesIds.length > 0}
                    <!-- Avec moteur de recherche -->
                    <SearchEnginesBubbles
                        searchEngines={dataForBubbles(searchEnginesIds)}
                        bubbleSize={bubblesSize + 'px'}
                        collapse={searchEnginesIds.length > 3} />
                {:else}
                    <!-- Aucun moteur de recherche -->
                    <Icofont icon="danger" size={bubblesSize+2} />
                {/if}
            </div>
        {:else}
            <Icofont icon={value} size={folderIconSize} />
        {/if}
        
    {/if}
</main>

<style lang="scss">
    .bk-icon {
        --sp-icon-gap: 1px; // Search profile icon gap
        --icon-text-size: 2em;
        --bg-color: blue;

        aspect-ratio: 1/1;
        overflow: hidden;
        background: var(--cds-ui-03);
        border: 1px solid var(--cds-ui-01);
        width: 100%;

        // Coins arrondis
        &.square {border-radius: 22%;}
        &.rounded {border-radius: 100%;}

        // Alignement du contenu
        &.center-ctn {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        // Orientation en colonne
        &.flow-column {
            flex-flow: column;
        }

        // Logo Icofont
        :global(.icofont) {
            font-size: 50px;
        }

        // Logo en texte (initiales)
        &.logo-text p {
            font-size: var(--icon-text-size);
            text-transform: uppercase;
            margin: 0;
            padding: 0;
        }

        // Petit logo et taille moyenne
        &.logo-small,
        &.logo-medium {
            background: var(--bg-color);
        }

        // Petit logo
        &.logo-small img {
            max-width: 32px;
            max-height: 32px;
        }

        // Logo de taille moyenne
        &.logo-medium img {
            max-width: 70%;
            max-height: 70%;
        }

        // Logo qui occupe toute la place
        &.logo-cover img {
            width: 100%;
            height: 100%;
        }
    }
</style>