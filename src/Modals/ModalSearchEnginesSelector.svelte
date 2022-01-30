<script>
    // Imports
    import { Dropdown, Toggle, Modal, Grid, Row, Column, TextInput,
        SelectableTile,  RadioTile, TileGroup, Breakpoint, 
        Tabs, Tab, TabContent, ButtonSet, Button, FormGroup }
        from "carbon-components-svelte"
	import { multiSelectionSearchEngines}
        from '../Stores/settings'
	import { listSearchEngines } from '../Stores/search'
    import async from "async"
    import { createEventDispatcher, onDestroy } from 'svelte';
    import Icofont from "../UI/Icofont.svelte";

    // Propriétés externes
    export let open = false; // Flag pour afficher la popup
    export let idSelectedSearchEngines = []; // Liste des ID des moteurs sélectionnés

    // Propriétés internes
    const dispatch = createEventDispatcher(); // Pour créer des events
    let multiSelectSearchEngines // Flag pour la sélection multiple
    let searchEngines = [] // Liste des moteurs de recherche
    let sortMenu = [
        { id: 0, text: "Nom [asc]", sort: {on: "name", order: "asc"} },
        { id: 1, text: "Nom [desc]", sort: {on: "name", order: "desc"} },
        { id: 2, text: "Sélection [asc]", sort: {on: "selected", order: "asc"} },
        { id: 3, text: "Sélection [desc]", sort: {on: "selected", order: "desc"} },
    ]
    let selectedSortMode = 0 // Mode de tri
    let inputSearchSE = "" // Filter les moteurs de recherche
    let size // Taille de l'écran (responsive)

    // Réactivité
    $: {
        // Activer la sélection multiple s'il y plusieurs moteurs sélectionnés
        if (idSelectedSearchEngines.length > 1)
            multiSelectSearchEngines = true
    }
    /* Recalculer la liste des moteurs de recherche lorsque un des éléments suivants change :
        - Le mode de tri (ordre d'affichage)
        - La sélection des moteurs de recherche
        - Le filtre sur les moteurs de recherche
    */
    $: sortedSearchEngine = resortList(selectedSortMode, idSelectedSearchEngines, inputSearchSE)

	// Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        // Regénération de la liste en local
        let listSE = [];
        async.eachSeries(value, function parseSE(seItem, done) {
            // Ajouts des propriétés manquantes
            seItem.selected = idSelectedSearchEngines.indexOf(seItem.id) > -1

            // Ajout dans la liste
            listSE.push(seItem)
            return done()
        }, function finished() {
            // Mise à jour
            searchEngines = listSE;
        });
    });
	const unsub_multiSelectionSearchEngines = multiSelectionSearchEngines.subscribe(value => {
		multiSelectSearchEngines = value;
	});

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines();
        unsub_multiSelectionSearchEngines();
    });

    // Méthodes
    function updateSelection() {
        // Actualiser la liste des moteurs sélectionnés
        searchEngines.forEach((seItem, index) => {
            searchEngines[index].selected = idSelectedSearchEngines.indexOf(seItem.id) > -1
        })
    }
    function confirmSelection() {
        // Récupérer les moteurs sélectionnés
        let listIds = [];
        let listItems = searchEngines.filter((seItem) => {
            if (seItem.selected)
                listIds.push(parseInt(seItem.id))
            return seItem.selected;
        })
        
        // Signaler la confirmation
        dispatch('submit', {
            selectedItems: listItems,
            selectedIds: listIds
        });
    }
    function sortSearchEngines(a, b) {
        // Récupérer le mode de tri
        let sortMode = sortMenu[selectedSortMode].sort;

        // En fonction du mode de tri
        switch (sortMode.on) {
            case "name": // Trier sur le nom
                if ( a.name < b.name )
                    return sortMode.order == "asc" ? -1 : 1;
                if ( a.name > b.name )
                    return sortMode.order == "asc" ? 1 : -1;
                break;
            case "selected":
                if ( a.selected < b.selected )
                    return sortMode.order == "asc" ? -1 : 1;
                if ( a.selected > b.selected )
                    return sortMode.order == "asc" ? 1 : -1;
                break;
        }
        return 0;
    }
    function resortList() {
        // Tri des moteurs de recherche
        let list = searchEngines.sort(sortSearchEngines)

        // Filter les moteurs de recherche
        if (inputSearchSE.length > 0) {
            list = list.filter((seItem) => seItem.name.toLowerCase().indexOf(inputSearchSE.toLowerCase()) > -1)
        }

        return list;
    }
    function selectAll() {
        // Activer la sélection multiple
        multiSelectionSearchEngines.set(true)

        // Initialisation de la liste des IDs
        let listIds = [];

        // Parcourir les moteurs de recherche
        for (let ii=0; ii<searchEngines.length; ii++) {
            searchEngines[ii].selected = true // Sélectionner l'item
            listIds.push(searchEngines[ii].id) // Mémoriser l'id
        }
        
        // Mettre à jour l'affichage
        resortList()
        idSelectedSearchEngines = listIds
    }
    function unselectAll() {
        // Initialisation de la liste des IDs
        let listIds = [];

        // Parcourir les moteurs de recherche
        for (let ii=0; ii<searchEngines.length; ii++) {
            searchEngines[ii].selected = false // Sélectionner l'item
        }
        
        // Mettre à jour l'affichage
        resortList()
        idSelectedSearchEngines = listIds
    }
    function toggleSelection() {
        // Activer la sélection multiple
        multiSelectionSearchEngines.set(true)

        // Initialisation de la liste des IDs
        let listIds = [];

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
        bind:open={open}
        modalHeading="Choisir un moteur de recherche"
        primaryButtonText="Continuer"
        hasForm="true"
        on:click:button--primary={confirmSelection}
        on:open={updateSelection}
        on:close={confirmSelection}
        on:submit={confirmSelection}
    >
        <Tabs>
            <Tab label="Filtrer" />
            <Tab label="Sélection" />

            <svelte:fragment slot="content">
                <TabContent>
                    <Grid style="padding: 0">
                        <Row>
                            <Column style="padding-top: .2rem;">
                                <TextInput labelText="Rechercher"
                                    placeholder="Rechercher dans le nom du moteur de recherche"
                                    bind:value={inputSearchSE} />
                            </Column>
                            <Column>
                                <Dropdown
                                    titleText="Trier par"
                                    bind:selectedIndex={selectedSortMode}
                                    items={sortMenu}
                                />
                            </Column>
                            <!--Column>
                                <Dropdown
                                    titleText="Affichage"
                                    selectedIndex="0"
                                    items={[
                                        { id: "0", text: "Icônes" },
                                        { id: "1", text: "Mosaïques" },
                                        { id: "2", text: "Liste détaillé" },
                                    ]}
                                />
                            </Column-->
                        </Row>
                    </Grid>
                </TabContent>
                <TabContent>
                    <Grid style="padding: 0">
                        <Row>
                            <Column>
                                <FormGroup legendText="Sélectionner" style="margin: 0">
                                    <ButtonSet class="big">
                                        <Button kind="ghost" on:click={selectAll}>
                                            <Icofont icon="squares" size="22" />
                                            <span class="text">Tout</span>
                                        </Button>
                                        <Button kind="ghost" on:click={unselectAll}>
                                            <Icofont icon="disable" size="22" />
                                            <span class="text">Aucun</span>
                                        </Button>
                                        {#if size != "sm"}
                                            <Button kind="ghost" on:click={toggleSelection}>
                                                <Icofont icon="reload" size="22" />
                                                <span class="text">Inverser</span>
                                            </Button>
                                        {/if}
                                    </ButtonSet>
                                    {#if size == "sm"}
                                        <ButtonSet>
                                            <Button kind="ghost" on:click={toggleSelection}>
                                                <Icofont icon="reload" size="16" />
                                                <span class="text">Inverser</span>
                                            </Button>
                                        </ButtonSet>
                                    {/if}
                                </FormGroup>
                            </Column>
                            <Column>
                                <Toggle labelText="Sélection multiple" 
                                    labelA="Non" labelB="Activé" bind:toggled={$multiSelectionSearchEngines} />
                            </Column>
                        </Row>
                    </Grid>
                </TabContent>
            </svelte:fragment>
        </Tabs>

        <br/><br/>

        <TileGroup legend="Liste des moteurs de recherche">
            <div class="se-items" role="group" aria-label="Liste des moteurs de recherche">
                {#each sortedSearchEngine as seItem}
                    {#if multiSelectSearchEngines}
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
    </Modal>
</main>

<style lang="scss">
    main.modalSelector-SE :global(.bx--tab-content) {
        border: 2px solid var(--cds-ui-03);
        margin-top: -2px;

        // Boutons "Sélectionner"
        :global(.bx--btn-set .bx--btn) {
            text-align: left;
            box-shadow: none;
            border-radius: 6px;
            justify-content: flex-start;
            padding: .5rem .7rem;
            min-height: initial;
            min-width: initial;
            width: initial;
            gap: .5rem;
        }

        // Boutons "Sélectionner"
        :global(.bx--btn-set.big .bx--btn) {
            text-align: center;
            flex-flow: column;
            min-width: 70px;
        }
    }
    main.modalSelector-SE .se-items { // Liste des moteurs de recherche (search engines items)
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