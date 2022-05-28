<script>
    // Exports
    /**
     * La hauteur du composant ('extend' pour plein écran - 'fit' pour compact)
     * @type {'expand' | 'fit'}
     */
    export let size = 'expand'

    /**
     * Placer sous l'en-tête
     * @type {boolean}
     */
    export let underHeader = true



    // Imports
    import { Breakpoint, Button }
        from 'carbon-components-svelte'
    import { onMount }
        from 'svelte'
    import { fade }
        from 'svelte/transition'
    import { pageName, pageIcon, transparentHeader }
        from '../Stores/header'
    import { listBookmarks, displayTileName, displayTileNameMask, 
        renderSearchEnginesAsLink, renderSearchProfilesAsLink }
        from '../Stores/bookmarks'
    import Icofont
        from '../UI/Icofont.svelte'
    import SpeedialGrid
        from '../UI/SpeedDial/SpeedDialGrid.svelte'
    import { push }
        from 'svelte-spa-router'
    import bookmarksHelper
        from '../Classes/Helpers/BookmarksHelper'
    import { BookmarkTypes }
        from '../Classes/Bookmarks/BookmarkType'
    import { listSearchEngines, listSearchProfiles }
        from '../Stores/search'



    // Propriétés
    let innerHeight // Hauteur de la fenêtre
    let breakpoint // Largeur de la fenêtre
    let folderName = "(Sans nom)"
    let displayHeading = false
    let displayToolbar = false



    // Réactivité
    $: gridColumns = countColumnsToDisplay(breakpoint)
    $: refreshBookmarks = bookmarksHelper
        .refreshDataFromStores($listBookmarks, $listSearchEngines, $listSearchProfiles)
    $: bookmarkChain = bookmarksHelper.buildChain(refreshBookmarks, 300)



    // Lifecycle
    onMount(() => {
        // MAJ du header
        pageName.set("Accès rapide")
        pageIcon.set("apps")
        transparentHeader.set(true)
    })



    // Fonctions
    const countColumnsToDisplay = () => {
        switch (breakpoint) {
            case 'sm': return 3
            case 'md': return 5
            case 'lg': return 7
            case 'xl': return 8
            case 'xlg': return 9
            case 'max': return 10
        }
        return 3
    }
    const onSelectSearchEngine = e => {
        push('/search/search-engine/'+e.detail.data.id)
    }
    const onSelectSearchProfile = e => {
        push('/search/search-profile/'+e.detail.data.id)
    }
    const checkBookmarksData = (list) => {
        return list.map(bk => {
            let results = []
            switch (bk.type) {
                case BookmarkTypes.searchEngine:
                    results = $listSearchEngines
                        .filter(item => item.id == bk.data.id)
                    if (results.length > 0) {
                        bk.data.icon = results[0].icon
                        bk.data.name = results[0].name
                        bk.name = results[0].name
                    }
                    break
                case BookmarkTypes.searchProfile:
                    results = $listSearchProfiles
                        .filter(item => item.id == bk.data.id)
                    if (results.length > 0) {
                        bk.data.searchEngines = results[0].searchEnginesIds
                        bk.data.icon = results[0].icon
                        bk.data.name = results[0].name
                        bk.name = results[0].name
                    }
                    break
            }
            return bk
        })
    }
</script>

<svelte:window bind:innerHeight={innerHeight} />

<Breakpoint bind:size={breakpoint} />

<main id="speedialPage"
    class:fit={size == "fit"}
    class:expand={size == "expand"}
    class:under-header={underHeader}
    class:compact-header={['sm'].includes(breakpoint)}
    style="--height: {innerHeight}px"
    in:fade={{duration: 500}}
>
    {#if underHeader}
        <!-- Espacement pour le Header -->
        <div class="header-mask"
            class:compact={['sm'].includes(breakpoint)}></div>
    {/if}

    <div class="page-content"
        class:compact-page={['sm'].includes(breakpoint)}>

        <!-- Heading -->
        {#if displayHeading}
            <h2>{folderName}</h2>
        {/if}

        <!-- Toolbar -->
        {#if displayToolbar}
            <div class="toolbar">
                <div class="left">
                    <Button kind="ghost" title="Retour">
                        <Icofont icon="arrow_left" />
                    </Button>
                    <Button kind="ghost" title="Suivant">
                        <Icofont icon="arrow_right" />
                    </Button>
                </div>

                <div class="right">
                    <Button kind="ghost" title="Rechercher">
                        <Icofont icon="search" />
                    </Button>
                    <Button kind="ghost" title="Trier">
                        <Icofont icon="sort" />
                    </Button>
                    <Button kind="ghost" title="TODO: Menu overflow">
                        <Icofont icon="menu_dots" />
                    </Button>
                </div>
            </div>
        {/if}

        <!-- ExplorerItems -->
        <SpeedialGrid items={bookmarkChain} {gridColumns}
            renderSearchEnginesAsLink={$renderSearchEnginesAsLink}
            renderSearchProfilesAsLink={$renderSearchProfilesAsLink}
            labelVisible={$displayTileName}
            labelMask={$displayTileNameMask}
            on:selectSearchEngine={onSelectSearchEngine}
            on:selectSearchProfile={onSelectSearchProfile} />
    </div>
</main>

<style lang="scss">
    main#speedialPage {
        padding: 0;
        transition: all .3s;

        // Hauteur de la page
        &.fit, &.expand {
            position: relative;
            display: flex;
            flex-flow: column;
            align-items: stretch;
        }

        // Hauteur fixe
        &.fit {min-height: 400px;}

        // Hauteur étendue
        &.expand {
            --height: 400px;
            min-height: var(--height);
        }

        // Placer sous le header
        &.under-header {
            --header-height: 92px;
            margin-top: calc(-1 * var(--header-height));

            // Affichage compacte (pour smartphone)
            &.compact-header {
                --header-height: 52px;
            }

            // Masque pour le header
            .header-mask {
                padding-top: var(--header-height);
            }
        }

        // Contenu de la page
        .page-content:not(.compact-page) {
            width: 80%;
            margin: auto;
        }

        // Titre
        h2 {
            margin: 0 var(--cds-spacing-04);
            margin-bottom: var(--cds-spacing-05);
            font-size: 1.8em;
        }

        // Barre d'outils
        .toolbar {
            display: flex;
            justify-content: space-between;

            // Zones des boutons
            > div {
                display: flex;
                flex-flow: wrap;
            }

            // Boutons
            :global(.bx--btn) {
                border-radius: 10px;
                --cds-link-01: var(--cds-text-01);

                :global(.icofont) {
                    font-size: 20px;
                }
            }
        }
    }
</style>