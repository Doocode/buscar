<script>
    // Exports
    /**
     * La liste des items à afficher
     * @type {array}
     */
    export let items = []

    /**
     * Le nombre de colonne
     * @type {number}
     */
    export let gridColumns = 3

    /**
     * Afficher les libellés des tuiles
     * @type {boolean}
     */
    export let labelVisible = true

    /**
     * Afficher un masque sur les libellés des tuiles
     * @type {boolean}
     */
    export let labelMask = true

    /**
     * Limiter le texte dans le libellé des tuiles
     * @type {boolean}
     */
    export let limitLabelTextOverflow = true

    /**
     * Afficher les dossiers comme des liens vers une page web
     * @type {boolean}
     */
    export let renderFolderAsLink = true

    /**
     * Afficher les moteurs de recherche comme des liens vers une page web
     * @type {boolean}
     */
    export let renderSearchEnginesAsLink = true

    /**
     * Afficher les profils de recherche comme des liens vers une page web
     * @type {boolean}
     */
    export let renderSearchProfilesAsLink = true



    // Imports
    import { ClickableTile }
        from 'carbon-components-svelte'
    import { BookmarkTypes }
        from '../../Classes/Bookmarks/BookmarkType'
    import { listSearchEngines }
        from '../../Stores/search'
    import BookmarkIcon
        from './BookmarkIcon.svelte'
    import Icofont
        from '../Icofont.svelte'
    import SearchEnginesBubbles
        from '../SearchEnginesBubbles.svelte'
    import { createEventDispatcher }
        from 'svelte'
    import { scale }
        from 'svelte/transition'
    import bookmarksHelper
        from '../../Classes/Helpers/BookmarksHelper'



    // Propriétés
    let gridWidth = 0
    let tileLogoSize = 20
    const dispatch = createEventDispatcher()



    // Réactivité
    $: calcTileSize(gridWidth, gridColumns, items)
    $: folderIconSize = tileLogoSize * .7
    $: fontIconSize = tileLogoSize * .3

    $: searchProfileIconSize = tileLogoSize * .50
    $: searchProfileIconGap = tileLogoSize * .05
    $: bubblesSize = tileLogoSize * .22

    $: style = '--sp-icon-gap:'+searchProfileIconGap+'px; '+
    '--icon-text-size:'+fontIconSize+'px; '+
    '--tile-logo-size:'+tileLogoSize+'px; '



    // Fonctions
    const dataForBubbles = listIds => {
        return $listSearchEngines.filter(item => listIds.includes(item.id))
    }
    const onSelectFolder = e => dispatch('selectFolder', e)
    const onSelectSearchEngine = e => dispatch('selectSearchEngine', e)
    const onSelectSearchProfile = e => dispatch('selectSearchProfile', e)
    const calcTileSize = () => tileLogoSize = parseInt(gridWidth / gridColumns) - 2 * 16 // Remove tile padding : 2 * 1rem (1rem = 16px)
    const tileTransition = ii => {
        return {
            delay: ii * 20,
            duration: 200
        }
    }
</script>

<main
    class="sd-view ncol-{gridColumns}"
    class:limitLabelTextOverflow
    class:labelVisible
    class:labelMask
    {style}
    bind:clientWidth={gridWidth}
    on:resize={calcTileSize}
>
    {#each items as child, i}
        <div in:scale={tileTransition(i)} title={child.name}>
            {#if child.type == BookmarkTypes.directory}
                <!-- Type répertoire -->
                {#if renderFolderAsLink}
                    <ClickableTile href={'/#/speeddial/'+bookmarksHelper.formatFolderForUrl(child)}>
                        <div class="sd-tile t-folder">
                            <div class="logo square center-ctn">
                                <Icofont icon="folder_close" size={folderIconSize} />
                            </div>
                            <!--BookmarkIcon bookmarkType={child.type} /-->

                            {#if labelVisible}
                                <div class="label">
                                    <Icofont icon="folder_close" />
                                    <span class="text">{child.name}</span>
                                </div>
                            {/if}
                        </div>
                    </ClickableTile>
                {:else}
                    <ClickableTile on:click={() => onSelectFolder(child)}>
                        <div class="sd-tile t-folder">
                            <div class="logo square center-ctn">
                                <Icofont icon="folder_close" size={folderIconSize} />
                            </div>
                            <!--BookmarkIcon bookmarkType={child.type} /-->

                            {#if labelVisible}
                                <div class="label">
                                    <Icofont icon="folder_close" />
                                    <span class="text">{child.name}</span>
                                </div>
                            {/if}
                        </div>
                    </ClickableTile>
                {/if}
            {:else if child.type == BookmarkTypes.website}
                <!-- Type site web -->
                <ClickableTile href={child.data.url}>
                    <div class="sd-tile t-website">
                        {#if child.data.iconType == 'image'}
                            <div class="logo square center-ctn"
                                class:logo-cover={child.data.iconImageFormat == 'cover'}
                                class:logo-medium={child.data.iconImageFormat == 'medium'}
                                class:logo-small={child.data.iconImageFormat == 'small'}
                                style="--bg-color: {child.data.iconBgColor}" >
                                <img src={child.data.icon} title={child.name}
                                    alt={"Icône/logo de " + child.name}>
                            </div>
                        {:else if child.data.iconType == 'text'}
                            <div class="logo square center-ctn logo-text" title={child.name} >
                                <p>{child.data.icon}</p>
                            </div>
                        {/if}
                        <!--BookmarkIcon bookmarkType={child.type}
                            name={child.name}
                            type={child.data.iconType}
                            value={child.data.icon}
                            bgColor={child.data.iconBgColor}
                            imageSize={child.data.iconImageFormat} /-->

                        {#if labelVisible}
                            <div class="label">
                                <span class="text">{child.name}</span>
                            </div>
                        {/if}
                    </div>
                </ClickableTile>
            {:else if child.type == BookmarkTypes.searchEngine}
                <!-- Type moteur de recherche -->
                {#if renderSearchEnginesAsLink}
                    <ClickableTile href={'/#/search/search-engine/'+child.data.id} >
                        <div class="sd-tile t-search_ng">
                            <div class="logo round logo-cover">
                                <img src={child.data.icon} title={child.name}
                                    alt={"Logo de " + child.name}>
                            </div>
                            <!--BookmarkIcon bookmarkType={child.type}
                                name={child.name}
                                value={child.data.icon} /-->

                            {#if labelVisible}
                                <div class="label">
                                    <Icofont icon="search" />
                                    <span class="text">{child.name}</span>
                                </div>
                            {/if}
                        </div>
                    </ClickableTile>
                {:else}
                    <ClickableTile on:click={() => onSelectSearchEngine(child)}>
                        <div class="sd-tile t-search_ng">
                            <div class="logo round logo-cover">
                                <img src={child.data.icon} title={child.name}
                                    alt={"Logo de " + child.name}>
                            </div>
                            <!--BookmarkIcon bookmarkType={child.type}
                                name={child.name}
                                value={child.data.icon} /-->

                            {#if labelVisible}
                                <div class="label">
                                    <Icofont icon="search" />
                                    <span class="text">{child.name}</span>
                                </div>
                            {/if}
                        </div>
                    </ClickableTile>
                {/if}
            {:else if child.type == BookmarkTypes.searchProfile}
                <!-- Type profil de recherche -->
                {#if renderSearchProfilesAsLink}
                    <ClickableTile href={'/#/search/search-profile/'+child.data.id} >
                        <div class="sd-tile t-search_pf">
                            <div class="logo square center-ctn">
                                <Icofont icon={child.data.icon} size={searchProfileIconSize} />
                                <div class="bubbles">
                                    <SearchEnginesBubbles
                                        searchEngines={dataForBubbles(child.data.searchEngines)}
                                        bubbleSize={bubblesSize + 'px'}
                                        collapse={child.data.searchEngines.length > 3} />
                                </div>
                            </div>

                            {#if labelVisible}
                                <div class="label">
                                    <Icofont icon="search_group" />
                                    <span class="text">{child.name}</span>
                                </div>
                            {/if}
                        </div>
                    </ClickableTile>
                {:else}
                    <ClickableTile on:click={() => onSelectSearchProfile(child)}>
                        <div class="sd-tile t-search_pf">
                            <div class="logo square center-ctn">
                                <Icofont icon={child.data.icon} size={searchProfileIconSize} />
                                <div class="bubbles">
                                    <SearchEnginesBubbles
                                        searchEngines={dataForBubbles(child.data.searchEngines)}
                                        bubbleSize={bubblesSize + 'px'}
                                        collapse={child.data.searchEngines.length > 3} />
                                </div>
                            </div>

                            {#if labelVisible}
                                <div class="label">
                                    <Icofont icon="search_group" />
                                    <span class="text">{child.name}</span>
                                </div>
                            {/if}
                        </div>
                    </ClickableTile>
                {/if}
            {:else}
                <!-- Type inconnu -->
                <ClickableTile>
                    <div class="sd-tile t-unknown">
                        <div class="logo square center-ctn">
                            <Icofont icon="warning" />
                        </div>

                        {#if labelVisible}
                            <div class="label">
                                <Icofont icon="warning" />
                                <span class="text">Type non reconnu</span>
                            </div>
                        {/if}
                    </div>
                </ClickableTile>
            {/if}
        </div>
    {/each}
</main>

<style lang="scss">
    .sd-view {
        --sp-icon-gap: 1px; // Search profile tile icon gap
        --icon-text-size: 2em;
        --tile-logo-size: 100px;

        display: grid;
        grid-template-columns: 1fr;
        gap: 0;

        &.labelVisible {gap: var(--cds-spacing-05) 0;}
        /*@media (min-width: 672px) { // width > sm
            &.labelVisible {gap: var(--cds-spacing-05);}
        }
        @media (max-width: 672px) { // width == sm
            &.labelVisible {gap: var(--cds-spacing-05) 0;}
        }*/

        &.ncol-2  {grid-template-columns: 1fr 1fr;}
        &.ncol-3  {grid-template-columns: 1fr 1fr 1fr;}
        &.ncol-4  {grid-template-columns: 1fr 1fr 1fr 1fr;}
        &.ncol-5  {grid-template-columns: 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-6  {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-7  {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-8  {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-9  {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-10 {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-11 {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;}
        &.ncol-12 {grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;}

        // Tuile
        :global(.bx--tile) {
            min-width: inherit;

            &:not(:hover) {
                background: transparent;
            }
        }
        :global(.bx--tile:active .sd-tile) {
            transform: scale(.9);
        }
        .sd-tile {
            display: flex;
            flex-flow: column;
            text-align: center;
            align-items: center;
            gap: var(--cds-spacing-03);
            transition: all .2s;

            // Logo
            .logo {
                aspect-ratio: 1/1;
                overflow: hidden;
                background: var(--cds-ui-03);
                border: 1px solid var(--cds-ui-01);
                width: var(--tile-logo-size);

                // Coins arrondis
                &.square {border-radius: 22%;}
                &.round {border-radius: 100%;}

                // Alignement du contenu
                &.center-ctn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                }

                // Petit logo et taille moyenne
                &.logo-small,
                &.logo-medium {
                    --bg-color: blue;
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

            // Label
            .label :global(.icofont) {
                position: relative;
                top: 1px;
            }
            
            // Type inconnu
            &.t-unknown {
                cursor: not-allowed;
            }

            // Type profil de recherche
            &.t-search_pf {
                .logo {
                    flex-flow: column;
                    align-items: stretch;
                    gap: var(--sp-icon-gap);
                }
            }

            // Type dossier
            /*&.t-search_pf,
            &.t-folder {
                .logo {
                    background: var(--cds-background-inverse);
                    border: 1px solid var(--cds-ui-03);
                    color: var(--cds-background);
                }
            }*/
        }

        // Afficher un masque sur le libellé des tuiles
        &.labelMask .sd-tile .label {
            background: var(--cds-ui-01);
            border-radius: 8px;
            padding: 4px 8px;
        }

        // Limiter le débordement du texte dans le libellé des tuiles 
        &.limitLabelTextOverflow .sd-tile .label {
            max-width: var(--tile-logo-size);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        &.labelMask.limitLabelTextOverflow .sd-tile .label {
            max-width: calc(var(--tile-logo-size) + 1rem);
            margin: 0 -.5rem;
        }

    }
</style>