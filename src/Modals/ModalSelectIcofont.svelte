<script>
    // Exports
    /**
     * Ouvrir la popup
     * @type {boolean}
     */
    export let open = false
    
    /**
     * L'icône choisie
     * @type {string}
     */
    export let value = ""



    // Imports
    import { Modal, RadioTile, TileGroup, Breakpoint, Search, Tag,
        OverflowMenu, OverflowMenuItem }
        from 'carbon-components-svelte'
    import { createEventDispatcher }
        from 'svelte'
    import Icofont
        from '../UI/Icofont.svelte'
    import { listIcons }
        from '../Stores/icofont'

    

    // Propriétés internes
    const dispatch = createEventDispatcher()
    let sortMenu = [
        { id: 0, text: "Nom (A-Z)", sort: {on: "name", order: "asc"} },
        { id: 1, text: "Nom (Z-A)", sort: {on: "name", order: "desc"} },
        /*{ id: 2, text: "Section", sort: {on: "section", order: "asc"} },
        { id: 3, text: "Section", sort: {on: "section", order: "desc"} },*/
        { id: 2, text: "Valeur (A-Z)", sort: {on: "value", order: "asc"} },
        { id: 3, text: "Valeur (Z-A)", sort: {on: "value", order: "desc"} },
    ]
    let selectedSortMode = 2 // Mode de tri
    let searchValue = "" // Filter les icônes
    let size // Taille de l'écran (responsive)



    // Réactivité
    /* Recalculer la liste des icônes lorsque un des éléments suivants change :
        - Le mode de tri (ordre d'affichage)
        - La valeur exportée
        - Le filtre sur les icônes
    */
    $: sortedIcons = resortList(selectedSortMode, value, searchValue)
    $: listLabel = formatListLegend(searchValue)



    // Méthodes
    const confirmSelection = () => {
        // Récupérer les icônes sélectionnés
        let results = $listIcons.filter(item => item.value == value)
        let choice = ""
        if (results.length > 0)
            choice = results[0].value
        
        // Signaler la confirmation
        dispatch('submit', {
            value: choice
        })
    }
    const sortIcons = (a, b) => {
        // Récupérer le mode de tri
        let sortMode = sortMenu[selectedSortMode].sort

        // En fonction du mode de tri
        switch (sortMode.on) {
            case "name": // Trier sur le nom
                if ( a.name < b.name )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.name > b.name )
                    return sortMode.order == "asc" ? 1 : -1
                break
            /*case "section":
                if ( a.section.id < b.section.id )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.section.id > b.section.id )
                    return sortMode.order == "asc" ? 1 : -1
                break*/
            case "value": // Trier sur la valeur
                if ( a.value < b.value )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.value > b.value )
                    return sortMode.order == "asc" ? 1 : -1
                break
        }
        return 0
    }
    const resortList = () => {
        // Tri des icônes
        let list = $listIcons.sort(sortIcons)

        // Filtrer les icônes
        if (searchValue.length > 0) {
            list = list.filter(item => {
                let filterName = item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
                let filterValue = item.value.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
                return filterName || filterValue
            })
        }

        return list
    }
    const formatListLegend = () => {
        if (searchValue.length > 0) {
            switch (sortedIcons.length) {
                case 0: return "Aucune icône trouvée"
                case 1: return "Une seule icône trouvée"
            }
            return "Les " + sortedIcons.length + " icônes trouvées"
        }
        return "Liste des " + sortedIcons.length + " icônes"
    }
</script>

<main class="modalSelector-icons">
    <Breakpoint bind:size />

    <Modal
        bind:open
        modalHeading="Icônes"
        primaryButtonText="Valider"
        secondaryButtonText="Annuler"
        on:click:button--primary={confirmSelection}
        on:click:button--secondary={() => open = false}
        on:open
    >
        <div class="toolbar" class:flow-column={["sm"].indexOf(size) > -1}>
            <Search placeholder="Rechercher une icône"
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
            </div>
        </div>

        <br/>

        <TileGroup legend={listLabel} on:select={e => value = e.detail}>
            <div class="icons-items" role="group" aria-label="Liste des icônes">
                {#each sortedIcons as item}
                    <RadioTile value="{item.value}" checked={item.value == value} >
                        <Icofont icon="{item.value}" />
                        <p>{item.name}</p>
                        <Tag size="sm">{item.value}</Tag>
                    </RadioTile>
                {/each}
            </div>
        </TileGroup>
        <br />
    </Modal>
</main>

<style lang="scss">
    main.modalSelector-icons {
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
            z-index: 2;
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

        // Liste des icônes
        .icons-items {
            --icon-size: 40px;
            
            display: grid;
            grid-gap: .3rem;
            grid-template-columns: 1fr 1fr;

            :global(.bx--tile--selectable) {
                border-radius: .6rem;
                padding: var(--cds-spacing-04);
                min-width: 6rem;
                text-align: center;
            }

            :global(.icofont) {
                width: var(--icon-size);
                height: var(--icon-size);
                font-size: var(--icon-size);
            }
            :global(p) {
                padding: 0;
                margin: var(--cds-spacing-02) 0;
            }
            :global(.bx--tag:not(:first-child)) {
                margin: 0;
            }
        }
    }

    @media (max-width: 672px) {
        main.modalSelector-icons :global(.bx--tab-content) {
            border: 1px solid var(--cds-ui-04);
        }
        main.modalSelector-icons .icons-items {
            grid-template-columns: 1fr 1fr 1fr;

            :global(.bx--tile__checkmark) {
                top: var(--cds-spacing-04);
                right: var(--cds-spacing-04);
            }
        }
    }

    @media (max-width: 350px) {
        main.modalSelector-icons .icons-items {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (min-width: 672px) {
        main.modalSelector-icons .icons-items {
            --icon-size: 50px;
            grid-template-columns: 1fr 1fr 1fr 1fr;

            :global(.bx--tile--selectable) {
                padding: var(--cds-spacing-05);
            }
        }
    }

    @media (min-width: 1056px) {
        main.modalSelector-icons .icons-items {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }
</style>