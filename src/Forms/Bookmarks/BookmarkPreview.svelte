<script>
    // Exports
    /**
     * Le nom du marque-page
     * @type {string}
     */
    export let name = "(Sans nom)"
    
    /**
     * Le type du marque-page
     * @type {string}
     */
    export let type = ""
    
    /**
     * Le contenu du marque-page
     * @type {object}
     */
    export let data = ""



    // Imports
    import { slide }
        from 'svelte/transition'
    import { BookmarkTypes }
        from '../../Classes/Bookmarks/BookmarkType'
    import BookmarkIcon
        from '../../UI/SpeedDial/BookmarkIcon.svelte'



    // Réactivité
    /*$: dataForBubbles = $listSearchEngines
        .filter(item => searchEnginesIds.indexOf(parseInt(item.id)) > -1)*/
</script>

<main class="sp-preview" transition:slide|local>
    <div class="ident">
        <div class="title">
            <div class="bx-icon">
                {#if type == BookmarkTypes.directory}
                    <BookmarkIcon bookmarkType={BookmarkTypes.directory} />
                {:else if type == BookmarkTypes.website}
                    <BookmarkIcon bookmarkType={type}
                        name={name}
                        type={data.iconType}
                        value={data.icon}
                        bgColor={data.iconBgColor}
                        imageSize={data.iconImageFormat} />
                {:else if type == BookmarkTypes.searchEngine}
                    <BookmarkIcon bookmarkType={type}
                        name={name}
                        value={data.icon} />
                {:else if type == BookmarkTypes.searchProfile}
                    <BookmarkIcon bookmarkType={type}
                        name={name}
                        value={data.icon}
                        searchEnginesIds={data.searchEngines} />
                {/if}
            </div>
            <p>{name}</p>
        </div>
    </div>
</main>

<style lang="scss">
    .sp-preview {
        // Section Identité
        .ident {
            // Nom et icône
            .title {
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                gap: var(--cds-spacing-05);
                margin-bottom: var(--cds-spacing-05);

                .bx-icon {
                    --size: 150px;
                    width: var(--size);
                    height: var(--size);
                }

                p {
                    font-size: 18px;
                    padding: 0;
                    margin: 0;
                }
            }
        }

    }
</style>