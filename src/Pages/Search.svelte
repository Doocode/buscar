<script>
    // Imports
    import ModalSearchEnginesSelector
        from "../Modals/ModalSearchEnginesSelector.svelte"
    import ModalSearchProfileSelector
        from "../Modals/ModalSearchProfileSelector.svelte"
    import { Button, Modal, Link }
        from "carbon-components-svelte"
	import { openSearchInCurrentPage, multiSelectionSearchEngines,
        enableSearchEngineAlias }
        from '../Stores/settings'
	import { listSearchEngines, listSearchProfiles }
        from '../Stores/search'
    import { pageName, pageIcon, transparentHeader }
        from '../Stores/header'
    import SearchBox from "../UI/SearchBox.svelte"
    import Icofont from "../UI/Icofont.svelte"
    import AliasChecker from "../AliasChecker.svelte"
    import async from "async"
    import { onDestroy } from 'svelte'

    // MAJ du header
    pageName.set("Rechercher")
    pageIcon.set("search")
    transparentHeader.set(true)

    // Flags
    let modalSelectSearchEngines = false
    let modalSelectSearchProfile = false
    let modalResetSelection = false
    let openSearchInSamePage

    // Saisie de la requête
    let queryInput = ""
    let searchBox // L'instance de la barre de recherche

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
    let searchProfiles
    let selectedSearchProfileID = [] // ID du profil de recherche sélectionné
    const maxSearchProfilesInNavbar = 5

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
    const unsub_listSearchProfiles = listSearchProfiles.subscribe(value => {
        searchProfiles = value;
    });
	const unsub_openSearchInCurrentPage = openSearchInCurrentPage.subscribe(value => {
		openSearchInSamePage = value;
	});

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines();
        unsub_listSearchProfiles();
        unsub_openSearchInCurrentPage();
    });

    // Méthodes
    const confirmChangeSearchEngines = (e) => {
        // Masquer la popup
        modalSelectSearchEngines = false;

        // Appliquer la sélection
        selectSearchEngineByIds(e.detail.selectedIds)

        // Sélectionner le profil de recherche correspondant aux moteurs séléctionnés
        updateSelectedSearchProfile()
    }
    const updateSelectedSearchProfile = () => {
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
            if (selectedSearchEnginesIDs.length != sp.searchEnginesIds.length)
                return done();

            // À ce stade, il faut vérifier si les items du profils et de la sélection actuelle correspondent
            let listSE = sp.searchEnginesIds;
            if (selectedSearchEnginesIDs.sort().join(',') === listSE.sort().join(',')) {
                profileMatch = true;
                idProfileFound = sp.id;
            }
            done();
        };

        // Parcourir les profils de recherche
        async.eachSeries(searchProfiles, checkSearchProfile, () => {
            // Les profils de recherches ont été parcourus
            selectedSearchProfileID = idProfileFound; // MAJ l'id du profil de recherche choisi
        });
    }
    function selectSearchEngineByIds(listIds) {
        selectedSearchEnginesIDs = listIds;
        
        // Parcours de la liste des moteurs de recherche
        searchEngines.map((seItem, index) => {
            // Sélectionner le moteur de recherche s'il fait partie de la liste des ID
            searchEngines[index].selected = listIds.indexOf(seItem.id) > -1;
        });
    }
    function confirmChangeSearchProfile(e) {
        // MAJ l'historique
        selectSearchProfileById(e.detail.selectedId)

        // Masquer la popup
        modalSelectSearchProfile = false;
    }
    function selectSearchProfileById(idSearchProfile) {
        // MAJ le profil de recherche choisi
        selectedSearchProfileID = parseInt(idSearchProfile);

        let searchProfile = searchProfiles.filter((spItem) => parseInt(spItem.id) == parseInt(idSearchProfile))[0]

        // Activer la sélection multiple s'il y a plusieurs items dans le profil de recherche
        if (searchProfile.searchEnginesIds.length > 1)
            multiSelectionSearchEngines.set(true);

        // Charger les moteurs de recherche du profil :
        let listSE = searchProfile.searchEnginesIds; // Moteurs de recherche du profil de recherche

        // Sélectionner les moteurs de recherche
        selectSearchEngineByIds(listSE)
    }
    const resetSelection = () => {
        // Choisir le 1er item
        loadPreferences()

        modalResetSelection = false // Fermer la popup
    }
    const executeQuery = (e) => {
        // Liste des pages à ouvrir
        let pages = e.detail.urls

        // Erreur si la requête saisie n'est pas valide
        if (e.detail.value.length == 0) 
            return alert("Vous ne pouvez pas lancer une recherche vide")

        // Erreur s'il n'y a aucun moteur de recherche sélectionné
        if (pages.length == 0)
            return alert("Vous devez choisir au moins un moteur de recherche")

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
    const addSearchEngineToSelection = (e) => {
        // Le moteur de recherche à ajouter
        let searchEngine = e.detail.searchEngine

        // Vérifier si le moteur de recherche n'est pas déjà séléctionné
        if (selectedSearchEnginesIDs.indexOf(searchEngine.id) < 0) {
            // Ajouter le moteur de recherche à la sélection
            selectedSearchEnginesIDs.push(searchEngine.id)
            selectSearchEngineByIds(selectedSearchEnginesIDs)

            // Séléctionner le profil de recherche correspondant aux moteurs séléctionnés
            updateSelectedSearchProfile()

            // TODO: Afficher une notification : https://carbon-components-svelte.onrender.com/components/ToastNotification#hidden-close-button
        }
    }
    const removeSearchEngineToSelection = (e) => {
        // Le moteur de recherche à retirer
        let searchEngine = e.detail.searchEngine

        // Vérifier si le moteur de recherche est séléctionné
        let index = selectedSearchEnginesIDs.indexOf(searchEngine.id)
        if (index >= 0) {
            // Ajouter le moteur de recherche à la sélection
            selectedSearchEnginesIDs.splice(index, 1)
            selectSearchEngineByIds(selectedSearchEnginesIDs)

            // Séléctionner le profil de recherche correspondant aux moteurs restants
            updateSelectedSearchProfile()

            // TODO: Afficher une notification : https://carbon-components-svelte.onrender.com/components/ToastNotification#hidden-close-button
        }
    }
    const replaceSearchEngineToSelection = (e) => {
        // Le moteur de recherche à sélectionner
        let searchEngine = e.detail.searchEngine

        // Ajouter le moteur de recherche à la séléction
        selectedSearchEnginesIDs = [searchEngine.id]
        selectSearchEngineByIds(selectedSearchEnginesIDs)

        // Séléctionner le profil de recherche correspondant
        updateSelectedSearchProfile()

        // TODO: Afficher une notification : https://carbon-components-svelte.onrender.com/components/ToastNotification#hidden-close-button
    }
    const onUpdateQuery = (e) => { // Mettre à jour la requete
        searchBox.changeValue(e.detail.query)
    }

    // Charger les paramètres par défaut
    loadPreferences();
</script>

<main id="searchPage">
    <nav class="nav-searchProfile">
        {#each searchProfiles.slice(0, maxSearchProfilesInNavbar) as sp}
            {#if parseInt(selectedSearchProfileID) === parseInt(sp.id)}
                <Link class="current" on:click={() => {selectSearchProfileById(sp.id)}}>
                    <Icofont icon="{sp.icon}" size="16" />
                    <span class="label">{sp.name}</span>
                </Link>
            {:else}
                {#if sp.id != 0}
                    <Link on:click={() => {selectSearchProfileById(sp.id)}}>
                        <Icofont icon="{sp.icon}" size="16" />
                        <span class="label">{sp.name}</span>
                    </Link>
                {/if}
            {/if}
        {/each}
        {#if searchProfiles.length > maxSearchProfilesInNavbar}
            <Link on:click={() => {modalSelectSearchProfile = true}}>
                <span class="label">Plus {searchProfiles.length - maxSearchProfilesInNavbar}</span>
                <Icofont icon="dropdown" size="16" />
            </Link>
        {/if}
    </nav>

    <SearchBox
        bind:this={ searchBox }
        bind:value={ queryInput }
        on:submit={ executeQuery }
        on:askSearchEngines={() => (modalSelectSearchEngines = true)}
        searchEngines={searchEngines.filter((seItem) => seItem.selected)}
        placeholder="Tapez votre requête ici"
    />

    {#if $enableSearchEngineAlias}
        <AliasChecker
            bind:query={ queryInput }
            on:updateQuery={onUpdateQuery}
            on:selectSearchEngine={addSearchEngineToSelection}
            on:deselectSearchEngine={removeSearchEngineToSelection}
            on:replaceSearchEngine={replaceSearchEngineToSelection}
            selectedSearchEngines={searchEngines.filter((seItem) => seItem.selected)}
        />
    {/if}

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


    <ModalSearchEnginesSelector
        bind:open={modalSelectSearchEngines}
        idSelectedSearchEngines={selectedSearchEnginesIDs.filter(() => true)}
        on:submit={confirmChangeSearchEngines}
    />

    <ModalSearchProfileSelector
        bind:open={modalSelectSearchProfile}
        selectedID={selectedSearchProfileID}
        on:submit={confirmChangeSearchProfile}
    />

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
        <br /><br /><br />
    </Modal>
</main>

<style lang="scss">
    main#searchPage {
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
            cursor: pointer;
        }
        :global(.bx--link.current) {
            color: var(--cds-text-01);
            text-decoration: underline;
        }
    }

    // Barre d'outils (boutons en bas de l'écran)
    main#searchPage .bottomToolbar {
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

    @media (max-width: 672px) {
        main#searchPage {margin: 0;}
        :global(.query-form) {max-width: 400px;}

        .nav-searchProfile {
            padding: 8px;
            justify-content: flex-start;
        }

        main#searchPage .bottomToolbar {
            padding: 10px;
            :global(.icofont) {font-size: 22px;}
            :global(.text) {display: none;}
        }
    }
</style>