<script>
    // Exports
    /**
     * Ouvrir la popup
     * @type {boolean}
     */
    export let open = false // Flag pour afficher la popup
    
    /**
     * L'id de l'image choisie
     * @type {string}
     */
    export let value = ""



    // Imports
    import { Modal, RadioTile, TileGroup, Breakpoint, Search,
        OverflowMenu, OverflowMenuItem, ContentSwitcher, Switch }
        from "carbon-components-svelte"
    import { createEventDispatcher }
        from 'svelte'
    import Icofont
        from "../UI/Icofont.svelte"
    import { listBgImgs, BackgroundImageTypes }
        from '../Stores/bgImages'

    

    // Propriétés internes
    const dispatch = createEventDispatcher() // Pour créer des events
    const sortMenu = [
        { id: 0, text: "Nom (A-Z)", sort: {on: "name", order: "asc"} },
        { id: 1, text: "Nom (Z-A)", sort: {on: "name", order: "desc"} },
        { id: 2, text: "Adresse URL (A-Z)", sort: {on: "url", order: "asc"} },
        { id: 3, text: "Adresse URL (Z-A)", sort: {on: "url", order: "desc"} },
    ]
    const switcherItems = [
        { id: 0, text: "Tout", icon: 'image' },
        { id: 1, text: "PC", icon: 'screen' },
        { id: 2, text: "Mobile", icon: 'smartphone' },
    ]
    let selectedSortMode = 0 // Mode de tri
    let switcherIndex = 0 // Type de fonds d'écran à afficher
    let searchValue = "" // Filter les images
    let size // Taille de l'écran (responsive)



    // Réactivité
    /* Recalculer la liste des images lorsque un des éléments suivants change :
        - Le mode de tri (ordre d'affichage)
        - La valeur exportée
        - Le filtre sur les images
    */
    $: sortedBgs4PC = resortList(filterByCategory(BackgroundImageTypes.pc), selectedSortMode, value, searchValue)
    $: sortedBgs4Mobile = resortList(filterByCategory(BackgroundImageTypes.smartphone), selectedSortMode, value, searchValue)
    $: label4PC = formatListLegend(sortedBgs4PC, searchValue)
    $: label4Mobile = formatListLegend(sortedBgs4Mobile, searchValue)



    // Méthodes
    const confirmSelection = () => {
        // Récupérer les images sélectionnés
        const results = $listBgImgs.filter(item => parseInt(item.id) == parseInt(value))
        let choice = ""
        if (results.length > 0)
            choice = results[0].id
        
        // Signaler la confirmation
        dispatch('submit', {
            value: choice
        })
    }
    const sortBgImgs = (a, b) => {
        // Récupérer le mode de tri
        const sortMode = sortMenu[selectedSortMode].sort

        // En fonction du mode de tri
        switch (sortMode.on) {
            case "name": // Trier sur le nom
                if ( a.name < b.name )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.name > b.name )
                    return sortMode.order == "asc" ? 1 : -1
                break
            case "url": // Trier sur la valeur
                if ( a.url < b.url )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.url > b.url )
                    return sortMode.order == "asc" ? 1 : -1
                break
        }
        return 0
    }
    const filterByCategory = category => {
        return $listBgImgs.filter(item =>
            item.type.indexOf(category) > -1)
    }
    const resortList = listBgs => {
        // Tri des images
        let list = listBgs.sort(sortBgImgs)

        // Filtrer les images
        if (searchValue.length > 0) {
            list = list.filter(item => {
                let filterName = item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
                let filterValue = item.url.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
                return filterName || filterValue
            })
        }

        return list
    }
    const formatListLegend = listImg => {
        let type = ""
        if (listImg == sortedBgs4PC)
            type = " pour pc "
        else if (listImg == sortedBgs4Mobile)
            type = " pour mobile "

        if (searchValue.length > 0) {
            switch (listImg.length) {
                case 0: return "Aucune fond d'écran" + type + "trouvé"
                case 1: return "Un seul fond d'écran" + type + "trouvé"
            }
            return "Les " + listImg.length + " fonds d'écran" + type + "trouvés"
        }
        return "Liste des " + listImg.length + " fonds d'écran" + type
    }
</script>

<main class="modalSelector-bgs">
    <Breakpoint bind:size />

    <Modal
        bind:open
        modalHeading="Images d'arrière plan"
        primaryButtonText="Valider"
        secondaryButtonText="Annuler"
        on:click:button--primary={confirmSelection}
        on:click:button--secondary={() => open = false}
        on:open
    >
        <div class="toolbar" class:flow-column={["sm"].indexOf(size) > -1}>
            <Search placeholder="Rechercher une image"
                bind:value={searchValue} />
        
            <div class="toolbar">
                <OverflowMenu flipped>
                    <div slot="menu" class="menu-button">
                        <Icofont icon="sort" size="20" />
                        <span class="label">Trier</span>
                        <Icofont icon="dropdown" size="14" />
                    </div>
    
                    {#each sortMenu as item, i}
                        <OverflowMenuItem
                            primaryFocus={selectedSortMode == i}
                            on:click={() => selectedSortMode = i} >
                            <div class="label">
                                {#if item.sort.order == "asc"}
                                    <Icofont icon="arrow_diagonal_1" size="16" />
                                {:else}
                                    <Icofont icon="arrow_diagonal_2" size="16" />
                                {/if}
                                <span class="text">{item.text}</span>
                            </div>
                        </OverflowMenuItem>
                    {/each}
                </OverflowMenu>
                
                <!--<OverflowMenu flipped>
                    <div slot="menu" class="menu-button">
                        <Icofont icon="menu_dots" size="20" />
                        <Icofont icon="dropdown" size="14" />
                    </div>
    
                    <OverflowMenuItem
                        href="/#/preferences/interface/backgrounds">
                        <div class="label">
                            <Icofont icon="settings" size="16" />
                            <span class="text">Gérer les fonds d'écran</span>
                        </div>
                    </OverflowMenuItem>
                </OverflowMenu>-->
            </div>
        </div>

        <ContentSwitcher bind:selectedIndex={switcherIndex}>
            {#each switcherItems as item }
                <Switch>
                    <div class="label">
                        <Icofont icon={item.icon} size="16" />
                        <span class="text">{item.text}</span>
                    </div>
                </Switch>
            {/each}
        </ContentSwitcher>
        <br/>

        {#if switcherIndex == 0 || switcherIndex == 1}
            {#if sortedBgs4PC.length > 0}
                <TileGroup legend={label4PC} on:select={e => value = e.detail}>
                    <div class="bgs-items" role="group" aria-label={label4PC}>
                        {#each sortedBgs4PC as item}
                            <RadioTile value="{item.id}" checked={parseInt(item.id) == parseInt(value)} >
                                <img src={item.url} alt={item.name} />
                                <p>{item.name}</p>
                            </RadioTile>
                        {/each}
                    </div>
                </TileGroup>
            {:else}
                <legend class="bx--label">Aucun fond pour PC</legend>
            {/if}
            <br />
        {/if}

        {#if switcherIndex == 0 || switcherIndex == 2}
            {#if sortedBgs4Mobile.length > 0}
                <TileGroup legend={label4Mobile} on:select={e => value = e.detail}>
                    <div class="bgs-items" role="group" aria-label={label4Mobile}>
                        {#each sortedBgs4Mobile as item}
                            <RadioTile value="{item.id}" checked={parseInt(item.id) == parseInt(value)} >
                                <img src={item.url} alt={item.name} />
                                <p>{item.name}</p>
                            </RadioTile>
                        {/each}
                    </div>
                </TileGroup>
            {:else}
                <legend class="bx--label">Aucun fond pour smartphone</legend>
            {/if}
            <br />
        {/if}

    </Modal>
</main>

<style lang="scss">
    main.modalSelector-bgs {
        // Barre d'outils
        .toolbar {
            display: flex;
            align-items: center;
            gap: var(--cds-spacing-03);
            --border-radius: 7px;

            &.flow-column {
                flex-flow: column;
                align-items: flex-end;
            }
        }
        :global(.bx--modal-content > .toolbar) {
            position: sticky;
            top: -8px;
            background: var(--cds-ui-01);
            margin-top: -8px;
            z-index: 5;
            margin-left: -15px;
            margin-right: -15px;
            padding: 8px 15px;

            @supports (backdrop-filter: blur(40px)) {
                backdrop-filter: blur(40px);
                background: linear-gradient(to bottom, var(--cds-ui-01), transparent);
            }
        }

        // Barre de recherche
        :global(.bx--search--xl .bx--search-input),
        :global(.bx--search--xl .bx--search-close) {
            border-radius: var(--border-radius);
            height: 3rem;
            margin: 0;
        }
        :global(.bx--search--xl .bx--search-close) {
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }

        // Bouton menu
        :global(.bx--overflow-menu) {
            width: auto;
            height: 3rem;
            border-radius: var(--border-radius);
        }
        .menu-button {
            padding: 1rem .9rem;
            color: var(--cds-text-02);
            display: inline-flex;
            align-items: center;
            gap: var(--cds-spacing-03);
        }
        div.label {
            display: inline-flex;
            align-items: center;
            gap: var(--cds-spacing-03);
        }

        // Liste des images
        .bgs-items {
            display: grid;
            grid-gap: .3rem;
            grid-template-columns: 1fr 1fr;

            :global(.bx--tile--selectable) {
                border-radius: .6rem;
                padding: var(--cds-spacing-02);
                min-width: 6rem;
                text-align: center;
            }

            :global(p) {
                padding: 0;
                margin: var(--cds-spacing-02) 0;
            }

            img {
                max-width: 100%;
                border-radius: 6px;
            }
        }
    }

    @media (max-width: 672px) {
        main.modalSelector-bgs :global(.bx--tab-content) {
            border: 1px solid var(--cds-ui-04);
        }
        main.modalSelector-bgs .bgs-items {
            grid-template-columns: 1fr 1fr 1fr;

            :global(.bx--tile__checkmark) {
                top: var(--cds-spacing-04);
                right: var(--cds-spacing-04);
            }
        }
    }

    @media (max-width: 350px) {
        main.modalSelector-bgs .bgs-items {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (min-width: 672px) {
        main.modalSelector-bgs .bgs-items {
            grid-template-columns: 1fr 1fr 1fr;

            :global(.bx--tile--selectable) {
                padding: var(--cds-spacing-03);
            }
        }
    }
</style>