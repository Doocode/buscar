<script>
    // Imports
    import { Button, Dropdown, Toggle, Modal, Grid, Row, 
        Column, Link, SelectableTile,  RadioTile, TileGroup } 
        from "carbon-components-svelte";
	import { openSearchInCurrentPage, multiSelectionSearchEngines, 
        } from '../Stores/settings'
	import { listSearchEngines } from '../Stores/search'
    import SearchBox from "../UI/SearchBox.svelte";
    import Icofont from "../UI/Icofont.svelte";
    import async from "async";
    import { onDestroy } from 'svelte';

    // Flags
    let modalSelectSearchEngines = false;
    let modalSelectSearchProfile = false;
    let modalResetSelection = false;
    let openSearchInSamePage;
    let multiSelectSearchEngines;

    // Saisie de la requête
    let queryInput = "";

    // Moteurs de recherche
    let searchEngines = []; // Liste des moteurs de recherche
    let selectedSearchEnginesIDs = []; // Liste des moteurs de recherche sélectionnés
    $: {
        // Initialisation
        selectedSearchEnginesIDs = [];

        // Parcourir les moteurs de recherche
        searchEngines.forEach((seItem, index) => {
            // Si l'item est sélectionné
            if (seItem.selected) {
                // Mémoriser l'id de l'item
                selectedSearchEnginesIDs.push(parseInt(seItem.id));
            }
        });
    }

    // Profils de recherche
    // - Index pour Valider/Annuler
    let selectedSearchProfileIndex = 0;
    let lastSelectedSearchProfileIndex = 0;
    // - Liste des profils de recherche
    const listSearchProfile = [
        { id: 0, text: "Personnalisé", icon: "circles", searchEnginesId: [] },
        { id: 1, text: "Général", icon: "web", searchEnginesId: [1] },
        { id: 2, text: "Images", icon: "image", searchEnginesId: [8,9,10] },
        { id: 3, text: "Vidéos", icon: "play", searchEnginesId: [] },
        { id: 4, text: "Musiques", icon: "music", searchEnginesId: [] },
        { id: 5, text: "Mails", icon: "mail", searchEnginesId: [] },
    ];

	// Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        // Regénération de la liste en local
        let listSE = [];
        async.eachSeries(value, function parseSE(seItem, done) {
            // Ajouts des propriétés manquantes
            seItem.selected = selectedSearchEnginesIDs.indexOf(seItem.id) > -1

            // Ajout dans la liste
            listSE.push(seItem)
            return done()
        }, function finished() {
            // Mise à jour
            searchEngines = listSE;
        });
    });
	const unsub_openSearchInCurrentPage = openSearchInCurrentPage.subscribe(value => {
		openSearchInSamePage = value;
	});
	const unsub_multiSelectionSearchEngines = multiSelectionSearchEngines.subscribe(value => {
		multiSelectSearchEngines = value;
	});

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines();
        unsub_openSearchInCurrentPage();
        unsub_multiSelectionSearchEngines();
    });

    // Méthodes
    function confirmChangeSearchEngines() {
        // Masquer la popup
        modalSelectSearchEngines = false;
        
        // Mémoriser l'ancien profil de recherche
        if (lastSelectedSearchProfileIndex != selectedSearchProfileIndex)
            lastSelectedSearchProfileIndex = selectedSearchProfileIndex;

        // Initialisation pour rechercher un profil correspondant aux moteurs de recherche sélectionnés
        let profileMatch = false;
        let idProfileFound = 0;

        // Callback pour vérifier si un profil de recherche correspond à la sélection actuelle
        let checkSearchProfile = function(sp, done) {
            // Ne rien faire si un profil de recherche correspondant a été repéré
            if (profileMatch)
                return done();

            // Au départ, on considère que ce profil de recherche ne correspond pas
            profileMatch = false;

            // Avorter si le profil de recherche ne contient pas le même nombre d'items que la sélection actuelle
            if (selectedSearchEnginesIDs.length != sp.searchEnginesId.length)
                return done();

            // À ce stade, il faut vérifier si les items du profils et de la sélection actuelle correspondent
            let listSE = sp.searchEnginesId;
            if (selectedSearchEnginesIDs.sort().join(',') === listSE.sort().join(',')) {
                profileMatch = true;
                idProfileFound = sp.id;
            }
            done();
        };

        // Parcourir les profils de recherche
        async.eachSeries(listSearchProfile, checkSearchProfile, () => {
            // Les profils de recherches ont été parcourus
            selectedSearchProfileIndex = idProfileFound; // MAJ le profil de recherche choisi
            lastSelectedSearchProfileIndex = idProfileFound; // Effacer l'historique
        });
    }
    function cancelChangeSearchProfile() {
        selectedSearchProfileIndex = lastSelectedSearchProfileIndex;
        modalSelectSearchProfile = false;
    }
    function confirmChangeSearchProfile() {
        // MAJ l'historique
        selectSearchProfileById(selectedSearchProfileIndex)

        // Masquer la popup
        modalSelectSearchProfile = false;
    }
    function selectSearchProfileById(idProfile) {
        // MAJ le profil de recherche choisi
        selectedSearchProfileIndex = idProfile;

        // Effacer l'historique
        lastSelectedSearchProfileIndex = selectedSearchProfileIndex;

        // Activer la sélection multiple s'il y a plusieurs items dans le profil de recherche
        if (listSearchProfile[selectedSearchProfileIndex].searchEnginesId.length > 1)
            multiSelectionSearchEngines.set(true);

        // Charger les moteurs de recherche du profil :
        let listSE = listSearchProfile[selectedSearchProfileIndex].searchEnginesId; // Moteurs de recherche du profil de recherche
        
        // Parcours de la liste des moteurs de recherche local
        searchEngines.map((seItem, index) => {
            // Vérifier si le moteurs de recherche fait partie du profil de recherche
            if (listSE.indexOf(seItem.id) > -1)
                searchEngines[index].selected = true; // Sélectionner le moteurs de recherche
            else
                searchEngines[index].selected = false;
        });
    }
    function resetSelection() {
        // Choisir le 1er item
        loadPreferences(); // TODO: Choisir uniquement le profil par défaut

        modalResetSelection = false // Fermer la popup
    }
    function executeQuery(e) {
        // Liste des pages à ouvrir
        let pages = e.detail.urls;

        // Erreur si la requête saisie n'est pas valide
        if (e.detail.value.length == 0) 
            return alert("Vous ne pouvez pas lancer une recherche vide");

        // Erreur s'il n'y a aucun moteur de recherche sélectionné
        if (pages.length == 0)
            return alert("Vous devez choisir au moins un moteur de recherche");

        // Ouverture des pages
        async.eachSeries(pages, function openPage(url, done) {
            // Ne pas prendre en charge la 1ère page dans cette fonction s'il faut l'ouvrir dans la page actuelle
            if (pages[0] == url && openSearchInSamePage)
                return done();

            // Ouvrir l'adresse URL dans une nouvelle page
            window.open(url);

            // Passer au suivant
            return done();
        }, function finished() {
            // Ouvrir la page restante dans la page actuelle si le paramètre est activé
            if (openSearchInSamePage)
                window.open(pages[0], "_self"); // "_self" => Ouvrir l'adresse URL dans la page actuelle
        });
    }
    function loadPreferences() {
        // Charger le profil de recherche par défaut (charge le moteur de recherche du profil)
        selectSearchProfileById(1);
    }
    function sortSearchEngines(a, b) {
        if ( a.name < b.name )
            return -1;
        if ( a.name > b.name )
            return 1;
        return 0;
    }

    // Charger les paramètres par défaut
    loadPreferences();
</script>

<main>
    <nav class="nav-searchProfile">
        {#each listSearchProfile as sp}
            {#if parseInt(selectedSearchProfileIndex) === parseInt(sp.id)}
                <Link href="/#/" class="current" on:click={() => {selectSearchProfileById(sp.id)}}>
                    <Icofont icon="{sp.icon}" size="16" />
                    <span class="label">{sp.text}</span>
                </Link>
            {:else}
                {#if sp.id != 0}
                    <Link href="/#/" on:click={() => {selectSearchProfileById(sp.id)}}>
                        <Icofont icon="{sp.icon}" size="16" />
                        <span class="label">{sp.text}</span>
                    </Link>
                {/if}
            {/if}
        {/each}
    </nav>

    <SearchBox
        bind:value={ queryInput }
        on:submit={ executeQuery }
        on:askSearchEngines={() => (modalSelectSearchEngines = true)}
        searchEngines={searchEngines.filter((seItem) => seItem.selected)}
    />

    <div class="bottomToolbar">
        <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => (modalSelectSearchEngines = true)}>
            <Icofont icon="circles" />
            <span class="text">Moteurs de recherche</span>
        </Button>
        <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => (modalSelectSearchProfile = true)}>
            <Icofont icon="search" />
            <span class="text">Profils de recherche</span>
        </Button>

        <span class="spacer"></span>

        <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => (modalResetSelection = true)}>
            <Icofont icon="bin" />
            <span class="text">Réinitialiser</span>
        </Button>
    </div>


    <Modal
        bind:open={modalSelectSearchEngines}
        modalHeading="Choisir un moteur de recherche"
        primaryButtonText="Continuer"
        on:click:button--primary={confirmChangeSearchEngines}
        hasForm="true"
        on:open
        on:close={confirmChangeSearchEngines}
        on:submit={confirmChangeSearchEngines}
    >
        <Grid style="padding: 0">
            <Row>
                <Column>
                    <Toggle labelText="Lancer la recherche dans la page actuelle" 
                        labelA="Non" labelB="Oui" bind:toggled={$openSearchInCurrentPage} />
                </Column>
                <Column>
                    <Toggle labelText="Autoriser la sélection multiple" 
                        labelA="Non" labelB="Activé" bind:toggled={$multiSelectionSearchEngines} />
                </Column>
                <!--Column>Rechercher</Column>
                <Column>
                    <Dropdown
                        titleText="Trier par"
                        selectedId="0"
                        items={[
                            { id: "0", text: "Nom" },
                            { id: "1", text: "Sélection" },
                        ]}
                    />
                </Column>
                <Column>
                    <Dropdown
                        titleText="Affichage"
                        selectedId="0"
                        items={[
                            { id: "0", text: "Icônes" },
                            { id: "1", text: "Mosaïques" },
                            { id: "2", text: "Liste détaillé" },
                        ]}
                    />
                </Column-->
            </Row>
        </Grid>

        <br/><br/>

        <div class="se-list">
            <TileGroup legend="Liste des moteurs de recherche">
                <div class="se-items" role="group" aria-label="Liste des moteurs de recherche">
                    {#each searchEngines.sort(sortSearchEngines) as seItem}
                        {#if multiSelectSearchEngines}
                            <SelectableTile bind:selected={seItem.selected}>
                                <img src="{seItem.icon}" alt="Logo de { seItem.name }" />
                                <p>{seItem.name}</p>
                            </SelectableTile>
                        {:else}
                            <RadioTile value="{seItem.id}" bind:checked={seItem.selected}>
                                <img src="{seItem.icon}" alt="Logo de { seItem.name }" />
                                <p>{seItem.name}</p>
                            </RadioTile>
                        {/if}
                    {/each}
                </div>
            </TileGroup>
        </div>
    </Modal>

    <Modal
        bind:open={modalSelectSearchProfile}
        modalHeading="Choisir un profil de recherche"
        primaryButtonText="Continuer"
        secondaryButtonText="Annuler"
        on:click:button--secondary={cancelChangeSearchProfile}
        on:click:button--primary={confirmChangeSearchProfile}
        hasForm="true"
        on:open
        on:close={cancelChangeSearchProfile}
        on:submit={confirmChangeSearchProfile}
    >
        <Dropdown
            titleText="Profils de recherche"
            bind:selectedIndex={selectedSearchProfileIndex}
            items={listSearchProfile}
        />
        <br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/>
    </Modal>

    <Modal
        danger
        size="sm"
        bind:open={modalResetSelection}
        modalHeading="Rétablir le profil de recherche par défaut"
        primaryButtonText="Réinitialiser"
        secondaryButtonText="Annuler"
        on:click:button--primary={resetSelection}
        on:click:button--secondary={() => (modalResetSelection = false)}
        on:open
        on:close={() => (modalResetSelection = false)}
        on:submit={resetSelection}
    >
        <p>Voulez-vous vraiment rétablir le profil de recherche par défaut ?</p>
    </Modal>
</main>

<style lang="scss">
    main {
        margin-top: -92px;
        padding: 10px;
        transition: all .3s;
    }

    // Profils de recherche (liens en haut de l'écran)
    .nav-searchProfile {
        padding: 27px 91px;
        display: flex;
        flex-flow: wrap;
        gap: 20px 30px;
        justify-content: center;
        transition: all .5s;

        :global(.bx--link) {
            display: flex;
            align-items: center;
            gap: 5px;
            text-underline-offset: 4px;
        }
        :global(.bx--link.current) {
            color: var(--cds-text-01);
            text-decoration: underline;
        }
    }

    // Barre d'outils (boutons en bas de l'écran)
    .bottomToolbar {
        position: absolute;
        left: 0; right: 0;
        bottom: 0;

        display: flex;
        padding: 25px;
        transition: all .5s;

        .spacer {flex: 1;}
        :global(button) {
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
        }
        :global(.icofont) {font-size: 16px;}
    }

    // Popup des moteurs de recherche
    .se-items { // Liste des moteurs de recherche (search engines items)
        --icon-size: 50px;

        display: flex;
        flex-flow: wrap;

        :global(.bx--tile--selectable) {
            width: 140px;
        }

        img {
            width: var(--icon-size);
            height: var(--icon-size);
            border-radius: var(--icon-size);
            box-shadow: 0 0 0 1px rgba(127,127,127,.5);
        }
    }

    @media (max-width: 672px) {
        main {margin: 0;}
        :global(.query-form) {max-width: 400px;}

        .nav-searchProfile {
            padding: 8px;
            justify-content: flex-start;
        }

        .bottomToolbar {
            padding: 10px;
            :global(.icofont) {font-size: 22px;}
            :global(.text) {display: none;}
        }
    }
</style>