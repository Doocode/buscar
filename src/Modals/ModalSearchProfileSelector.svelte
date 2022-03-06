<script>
    // Imports
    import { Modal, TextInput, RadioTile, TileGroup }
        from "carbon-components-svelte"
	import { listSearchProfiles, listSearchEngines }
        from '../Stores/search'
	import { multiSelectionSearchEngines}
        from '../Stores/settings'
    import { createEventDispatcher, onDestroy }
        from 'svelte'
    import SearchEnginesBubbles from "../UI/SearchEnginesBubbles.svelte"
    import Icofont from "../UI/Icofont.svelte"
    import Utils from "../Classes/Utils"

    // Propriétés externes
    export let open = false; // Flag pour afficher la popup
    export let selectedID = 0; // Liste des ID des moteurs sélectionnés

    // Propriétés internes
    const dispatch = createEventDispatcher(); // Pour créer des events
    let multiSelectSearchEngines // Flag pour la sélection multiple
    let inputSearchSP = "" // Filter les moteurs de recherche
    let searchEngines = []
    let searchProfiles = []

    // Reactivité
    $: sortedSearchProfiles = resortList(open, inputSearchSP) // Liste des profils de recherche filtré et trié
    $: updateSelection(open)
    $: if (open) { // À l'ouverture de la popup
        inputSearchSP = "" // Reset les termes recherchés
    }

    // Méthodes
    const assignSearchEngines = () => {
        // Ajouter les moteurs de recherches dans les différents profils de recherche
        searchProfiles.forEach((spItem, index) => {
            searchProfiles[index].searchEngines = getListSearchEnginesById(spItem.searchEnginesIds)
        });
    }
    const updateSelection = () => {
        // Actualiser le profile de recherche sélectionné
        searchProfiles.forEach((spItem, index) => {
            searchProfiles[index].selected = parseInt(searchProfiles[index].id) === parseInt(selectedID)
        })
        selectedID = selectedID
    }
    const sortSearchProfiles = (a, b) => {
        if (a.orderPresentation < b.orderPresentation)
            return -1
        if (a.orderPresentation > b.orderPresentation)
            return 1
        return 0
    }
    const resortList = () => {
        // Tri des profils de recherche
        let list = searchProfiles.sort(sortSearchProfiles)

        // Filter les profils de recherche
        if (inputSearchSP.length > 0) {
            // Filtrer la liste des profils de recherche
            list = list.filter((spItem) => {
                // Filtres
                // - Sur le nom du profil de recherche
                let filterNameProfile = Utils.stringContains(spItem.name, inputSearchSP)
                // - Sur les moteurs de recherche
                let filterSearchEngines = false
                if (spItem.searchEngines != null && spItem.searchEngines.length > 0) { // S'il y a des moteurs recherche
                    for (let ii=0; ii<spItem.searchEngines.length; ii++) { // Parcourir la liste des moteurs de recherche
                        if (Utils.stringContains(spItem.searchEngines[ii].name, inputSearchSP)) { // Filtrer le nom du moteur
                            filterSearchEngines = true
                            break
                        }
                    }
                }
                return filterNameProfile || filterSearchEngines
            })
        }

        // Sélectionner le profil de recherche
        searchProfiles.forEach((spItem, index) => {
            searchProfiles[index].selected = parseInt(spItem.id) == parseInt(selectedID)
        })

        return list;
    }
    const confirmSelection = () => {
        // Id du profile de recherche
        selectedID = searchProfiles.filter((e) => e.selected)[0].id
        
        // Signaler la confirmation
        dispatch('submit', {
            selectedId: selectedID
        });

        //selectedID = -1
    }
    const findSearchEngineById = (id) => {
        // Rechercher l'item dans la liste
        for (let ii=0; ii<searchEngines.length; ii++) {
            // Si l'item a été retrouvé
            if (parseInt(searchEngines[ii].id) === parseInt(id))
                return searchEngines[ii] // Retourner l'item
        }
        return null
    }
    const getListSearchEnginesById = (listIdSE) => { // Liste des id des moteurs de recherche
        // Initialisation des données à retourner
        let data = []

        // Remplissage de la liste
        for (let ii=0; ii<listIdSE.length; ii++)
            data.push(findSearchEngineById(listIdSE[ii]))

        // Retour des données
        return data
    }

	// Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        searchEngines = value;
        assignSearchEngines()
    });
    const unsub_listSearchProfiles = listSearchProfiles.subscribe(value => {
        searchProfiles = value;
        assignSearchEngines()
    });
	const unsub_multiSelectionSearchEngines = multiSelectionSearchEngines.subscribe(value => {
		multiSelectSearchEngines = value;
	});

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines();
        unsub_listSearchProfiles();
        unsub_multiSelectionSearchEngines();
    });

</script>

<main class="modalSelector-SP">
    <Modal
        bind:open
        modalHeading="Profils de recherche"
        primaryButtonText="Valider"
        secondaryButtonText="Annuler"
        on:click:button--primary={confirmSelection}
        on:click:button--secondary={() => open = false}
    >
        <TextInput labelText="Rechercher" bind:value={inputSearchSP} />

        <br/>

        {#if sortedSearchProfiles.length > 0}
            <TileGroup legend="Liste des profils de recherche">
                <div class="sp-items" role="group" aria-label="Liste des profils de recherche">
                    {#each sortedSearchProfiles as spItem}
                        <RadioTile value="{spItem.id}" bind:checked={spItem.selected} >
                            <div class="ident">
                                <Icofont icon="{spItem.icon}" size="18" />
                                <p>{spItem.name}</p>
                            </div>
                            <div class="searchEngines">
                                {#if spItem.searchEnginesIds.length > 0}
                                    <SearchEnginesBubbles bubbleSize="25px" collapse
                                        searchEngines={getListSearchEnginesById(spItem.searchEnginesIds)} />
                                {:else}
                                    <p>(Vide)</p>
                                {/if}
                            </div>
                        </RadioTile>
                    {/each}
                </div>
            </TileGroup>
            <br />
        {:else}
            {#if searchProfiles.length > 0}
                <p>Aucun profil de recherche ne correspond à votre recherche</p>
            {:else}
                <p>Vous n'avez pas défini de profil de recherche</p>
            {/if}
            <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        {/if}
    </Modal>
</main>

<style lang="scss">
    main.modalSelector-SP .sp-items { // Liste des profils de recherche (search profiles items)
        display: grid;
        grid-gap: .3rem;
        grid-template-columns: 1fr 1fr;

        // Tuile de sélection
        :global(.bx--tile--selectable) {
            border-radius: .6rem;
            padding: var(--cds-spacing-04);
            min-width: 6rem;
        }
        
        // Nom et logo du profil de recherche
        .ident {
            width: calc(100% - 15px);
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            gap: 5px;

            p {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                //background: red;
                padding-right: 0;
                flex: 1;
            }
        }

        // Moteurs de recherche
        .searchEngines {
            display: flex;
            align-items: flex-end;
            height: 30px;
            
            p {
                font-size: .9em;
                opacity: .6;
            }
        }
    }

    @media (max-width: 672px) {
        main.modalSelector-SP :global(.bx--tab-content) {
            border: 1px solid var(--cds-ui-04);
        }
        main.modalSelector-SP .sp-items {
            grid-template-columns: 1fr 1fr 1fr;

            :global(.bx--tile__checkmark) {
                top: var(--cds-spacing-04);
                right: var(--cds-spacing-04);
            }
        }
    }

    @media (max-width: 350px) {
        main.modalSelector-SP .sp-items {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (min-width: 672px) {
        main.modalSelector-SP .sp-items {
            --icon-size: 50px;
            grid-template-columns: 1fr 1fr 1fr 1fr;

            :global(.bx--tile--selectable) {
                padding: var(--cds-spacing-05);
            }
        }
    }

    @media (min-width: 1056px) {
        main.modalSelector-SP .sp-items {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }
</style>