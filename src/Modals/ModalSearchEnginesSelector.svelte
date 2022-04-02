<script>
    // Exports
    export let open = false // Flag pour afficher la popup
    export let idSelectedSearchEngines = [] // Liste des ID des moteurs sélectionnés



    // Imports
    import { Modal, SelectableTile,  RadioTile, TileGroup, Breakpoint, Search,
        OverflowMenu, OverflowMenuItem }
        from "carbon-components-svelte"
	import { multiSelectionSearchEngines }
        from '../Stores/settings'
	import { listSearchEngines }
        from '../Stores/search'
    import async
        from "async"
    import { createEventDispatcher, onDestroy }
        from 'svelte'
    import Icofont
        from "../UI/Icofont.svelte"

    

    // Propriétés internes
    const dispatch = createEventDispatcher() // Pour créer des events
    let searchEngines = [] // Liste des moteurs de recherche
    let sortMenu = [
        { id: 0, text: "Nom", sort: {on: "name", order: "asc"} },
        { id: 1, text: "Nom", sort: {on: "name", order: "desc"} },
        { id: 2, text: "Type", sort: {on: "type", order: "asc"} },
        { id: 3, text: "Type", sort: {on: "type", order: "desc"} },
        { id: 4, text: "Sélection", sort: {on: "selected", order: "asc"} },
        { id: 5, text: "Sélection", sort: {on: "selected", order: "desc"} },
    ]
    let selectedSortMode = 0 // Mode de tri
    let inputSearchSE = "" // Filter les moteurs de recherche
    let size // Taille de l'écran (responsive)



    // Réactivité
    $: if (idSelectedSearchEngines.length > 1) // S'il faut sélectionner plusieurs moteurs
            multiSelectionSearchEngines.set(true) // Activer la sélection multiple
    /* Recalculer la liste des moteurs de recherche lorsque un des éléments suivants change :
        - Le mode de tri (ordre d'affichage)
        - La sélection des moteurs de recherche
        - Le filtre sur les moteurs de recherche
    */
    $: sortedSearchEngines = resortList(selectedSortMode, idSelectedSearchEngines, inputSearchSE)
    $: updateSelection(open)



	// Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        // Regénération de la liste en local
        let listSE = []
        async.eachSeries(value, function parseSE(seItem, done) {
            // Ajouts des propriétés manquantes
            seItem.selected = idSelectedSearchEngines.indexOf(seItem.id) > -1

            // Ajout dans la liste
            listSE.push(seItem)
            return done()
        }, function finished() {
            // Mise à jour
            searchEngines = listSE
        })
    })



    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines()
    })



    // Méthodes
    const updateSelection = () => {
        // Actualiser la liste des moteurs sélectionnés
        searchEngines.forEach((seItem, index) => {
            searchEngines[index].selected = idSelectedSearchEngines.indexOf(seItem.id) > -1
        })
        idSelectedSearchEngines = idSelectedSearchEngines
    }
    const confirmSelection = () => {
        // Récupérer les moteurs sélectionnés
        let listIds = []
        let listItems = searchEngines.filter((seItem) => {
            if (seItem.selected)
                listIds.push(parseInt(seItem.id))
            return seItem.selected
        })
        idSelectedSearchEngines = listIds
        
        // Signaler la confirmation
        dispatch('submit', {
            selectedItems: listItems,
            selectedIds: listIds
        })
    }
    const sortSearchEngines = (a, b) => {
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
            case "selected":
                if ( a.selected < b.selected )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.selected > b.selected )
                    return sortMode.order == "asc" ? 1 : -1
                break
            case "type":
                if ( a.type.id < b.type.id )
                    return sortMode.order == "asc" ? -1 : 1
                if ( a.type.id > b.type.id )
                    return sortMode.order == "asc" ? 1 : -1
                break
        }
        return 0
    }
    const resortList = () => {
        // Tri des moteurs de recherche
        let list = searchEngines.sort(sortSearchEngines)

        // Filter les moteurs de recherche
        if (inputSearchSE.length > 0) {
            list = list.filter((seItem) => seItem.name.toLowerCase().indexOf(inputSearchSE.toLowerCase()) > -1)
        }

        return list
    }
    const selectAll = () => {
        // Activer la sélection multiple
        multiSelectionSearchEngines.set(true)

        // Initialisation de la liste des IDs
        let listIds = []

        // Parcourir les moteurs de recherche
        for (let ii=0; ii<searchEngines.length; ii++) {
            searchEngines[ii].selected = true // Sélectionner l'item
            listIds.push(searchEngines[ii].id) // Mémoriser l'id
        }
        
        // Mettre à jour l'affichage
        resortList()
        idSelectedSearchEngines = listIds
    }
    const unselectAll = () => {
        // Activer la sélection multiple
        multiSelectionSearchEngines.set(true)
        
        // Initialisation de la liste des IDs
        let listIds = []

        // Parcourir les moteurs de recherche
        for (let ii=0; ii<searchEngines.length; ii++)
            searchEngines[ii].selected = false // Sélectionner l'item
        
        // Mettre à jour l'affichage
        resortList()
        idSelectedSearchEngines = listIds
    }
    const toggleSelection = () => {
        // Activer la sélection multiple
        multiSelectionSearchEngines.set(true)

        // Initialisation de la liste des IDs
        let listIds = []

        // Parcourir les moteurs de recherche
        for (let ii=0; ii<searchEngines.length; ii++) {
            searchEngines[ii].selected = !searchEngines[ii].selected // Inversion la sélection

            if (searchEngines[ii].selected) // Si l'item est sélectionné
                listIds.push(searchEngines[ii].id) // Mémoriser l'id
        }
        
        // Mettre à jour l'affichage
        resortList()
        idSelectedSearchEngines = listIds
    }
</script>

<main class="modalSelector-SE">
    <Breakpoint bind:size />

    <Modal
        bind:open
        modalHeading="Moteurs de recherche"
        primaryButtonText="Valider"
        secondaryButtonText="Annuler"
        on:click:button--primary={confirmSelection}
        on:click:button--secondary={() => open = false}
        on:open={updateSelection}
    >
        <div class="toolbar" class:flow-column={["sm"].indexOf(size) > -1}>
            <Search placeholder="Rechercher un moteur de recherche"
                bind:value={inputSearchSE} />
        
            <div class="toolbar">
                <OverflowMenu flipped>
                    <div slot="menu" class="menu-button">
                        <Icofont icon="sort" size="16" />
                        <span class="label">Trier</span>
                        <Icofont icon="dropdown" size="14" />
                    </div>
    
                    {#each sortMenu as item, i}
                        <OverflowMenuItem
                            primaryFocus={selectedSortMode == i}
                            on:click={() => selectedSortMode = i} >
                            <div class="label">
                                {#if item.sort.order == "asc"}
                                    <Icofont icon="arrow_up" size="16" />
                                {:else}
                                    <Icofont icon="arrow_down" size="16" />
                                {/if}
                                <span class="text">{item.text}</span>
                            </div>
                        </OverflowMenuItem>
                    {/each}
                </OverflowMenu>
                
                <OverflowMenu flipped>
                    <div slot="menu" class="menu-button">
                        <Icofont icon="circles" size="16" />
                        <span class="label">Sélection</span>
                        <Icofont icon="dropdown" size="14" />
                    </div>
    
                    <OverflowMenuItem on:click={selectAll} >
                        <div class="label">
                            <Icofont icon="squares" size="16" />
                            <span class="text">Tout</span>
                        </div>
                    </OverflowMenuItem>
                    <OverflowMenuItem on:click={unselectAll} >
                        <div class="label">
                            <Icofont icon="disable" size="16" />
                            <span class="text">Aucun</span>
                        </div>
                    </OverflowMenuItem>
                    <OverflowMenuItem on:click={toggleSelection} >
                        <div class="label">
                            <Icofont icon="reload" size="16" />
                            <span class="text">Inverser</span>
                        </div>
                    </OverflowMenuItem>
                    {#if $multiSelectionSearchEngines }
                        <OverflowMenuItem text="Sélection simple" on:click={() => {multiSelectionSearchEngines.set(!$multiSelectionSearchEngines)}} />
                    {:else}
                        <OverflowMenuItem text="Sélection multiple" on:click={() => {multiSelectionSearchEngines.set(!$multiSelectionSearchEngines)}} />
                    {/if}
                </OverflowMenu>
            </div>
        </div>

        <br/><br/>

        <TileGroup legend="Liste des moteurs de recherche">
            <div class="se-items" role="group" aria-label="Liste des moteurs de recherche">
                {#each sortedSearchEngines as seItem}
                    {#if $multiSelectionSearchEngines}
                        <SelectableTile bind:selected={seItem.selected} >
                            <img src="{seItem.icon}" alt="Logo de { seItem.name }" />
                            <p>{seItem.name}</p>
                        </SelectableTile>
                    {:else}
                        <RadioTile value="{seItem.id}" bind:checked={seItem.selected} >
                            <img src="{seItem.icon}" alt="Logo de { seItem.name }" />
                            <p>{seItem.name}</p>
                        </RadioTile>
                    {/if}
                {/each}
            </div>
        </TileGroup>
        <br />
    </Modal>
</main>

<style lang="scss">
    main.modalSelector-SE {
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

        // Barre de recherche
        :global(.bx--search--xl .bx--search-input),
        :global(.bx--search--xl .bx--search-close) {
            border-radius: var(--border-radius);
            height: 2.5rem;
            margin: 0;
        }
        :global(.bx--search--xl .bx--search-close) {
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }

        // Bouton menu
        :global(.bx--overflow-menu) {
            width: auto;
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

        // Liste des moteurs de recherche (search engines items)
        .se-items {
            --icon-size: 40px;
            
            display: grid;
            grid-gap: .3rem;
            grid-template-columns: 1fr 1fr;

            :global(.bx--tile--selectable) {
                border-radius: .6rem;
                padding: var(--cds-spacing-04);
                min-width: 6rem;
            }

            img {
                width: var(--icon-size);
                height: var(--icon-size);
                border-radius: var(--icon-size);
                box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            }
            :global(.bx--modal-content p) {
                padding: 0;
            }
        }
    }

    @media (max-width: 672px) {
        main.modalSelector-SE :global(.bx--tab-content) {
            border: 1px solid var(--cds-ui-04);
        }
        main.modalSelector-SE .se-items {
            grid-template-columns: 1fr 1fr 1fr;

            :global(.bx--tile__checkmark) {
                top: var(--cds-spacing-04);
                right: var(--cds-spacing-04);
            }
        }
    }

    @media (max-width: 350px) {
        main.modalSelector-SE .se-items {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (min-width: 672px) {
        main.modalSelector-SE .se-items {
            --icon-size: 50px;
            grid-template-columns: 1fr 1fr 1fr 1fr;

            :global(.bx--tile--selectable) {
                padding: var(--cds-spacing-05);
            }
        }
    }

    @media (min-width: 1056px) {
        main.modalSelector-SE .se-items {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }
</style>