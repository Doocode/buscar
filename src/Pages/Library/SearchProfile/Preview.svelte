<script>
    // Exports
    /**
     * Le nom du profil de recherche
     * @type {string}
     */
    export let name = "(Sans nom)"
    
    /**
     * L'icône du profil de recherche
     * @type {string}
     */
    export let icon = ""
    
    /**
     * Les moteurs de recherche
     * @type {[]}
     */
    export let searchEnginesIds = []



    // Imports
    import { listSearchEngines } 
        from '../../../Stores/search'
    import Icofont
        from '../../../UI/Icofont.svelte'
    import SearchEnginesBubbles
        from '../../../UI/SearchEnginesBubbles.svelte'
    import { slide }
        from 'svelte/transition'



    // Réactivité
    $: dataForBubbles = $listSearchEngines
        .filter(item => searchEnginesIds.indexOf(parseInt(item.id)) > -1)
</script>

<main class="sp-preview" transition:slide|local>
    <div class="ident">
        <div class="title">
            <Icofont {icon} size="24" />
            <span>{name}</span>
        </div>
        <div>
            <SearchEnginesBubbles searchEngines={dataForBubbles}
                bubbleSize="64px" fontSize="22px" collapse />
        </div>
    </div>

    <div class="searchEngines">
        <legend class="bx--label">Moteurs de recherche</legend>
        {#if dataForBubbles.length > 0}
            <div class="list-se">
                {#each dataForBubbles as item}
                    <div class="se-item">
                        <img src="{item.icon}"
                            alt="Logo de {item.name}"/>

                        <div class="text">
                            <p class="name">{item.name}</p>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="empty-box">
                <Icofont icon="warning" size="18" />
                <p>Non défini</p>
            </div>
        {/if}
    </div>
</main>

<style lang="scss">
    .sp-preview {
        // Section Identité
        .ident {
            // Nom et icône
            .title {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--cds-spacing-03);
                margin-bottom: var(--cds-spacing-05);

                span {font-size: 18px;}
            }
        }



        // Section "Moteurs de recherche"
        .searchEngines {
            margin-top: var(--cds-spacing-08);
        }
        // - Vue sans moteurs de recherche
        .empty-box {
            display: flex;
            align-items: center;
            gap: var(--cds-spacing-03);
        }
        // - Vue avec moteurs de recherche
        .list-se {
            display: flex;
            flex-flow: wrap;
            gap: var(--cds-spacing-05);
            --icon-size: 28px;

            // Item
            .se-item {
                display: flex;
                align-items: center;
                justify-items: flex-start;
                gap: var(--cds-spacing-03);
            }
            // Logo
            img {
                width: var(--icon-size);
                height: var(--icon-size);
                border-radius: var(--icon-size);
                box-shadow: 0 0 0 1px rgba(127, 127, 127, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: var(--font-size);
                text-align: center;
            }
            // Nom
            p.name {
                padding: 0;
                margin: 0;
                font-size: 100%;
            }
        }
    }
</style>