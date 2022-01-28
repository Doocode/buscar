<script>
    // Imports
    import { Button, TextInput, Dropdown, Toggle, Modal, 
        FluidForm, Grid, Row, Column, Link, SelectableTile, 
        RadioTile, TileGroup } from "carbon-components-svelte";
	import { openSearchInCurrentPage, multiSelectionWebsearch, 
        } from '../Stores/settings'
    import SearchBox from "../UI/SearchBox.svelte";
    import Icofont from "../UI/Icofont.svelte";
    import async from "async";
    import { onDestroy } from 'svelte';

    // Flags
    let modalSelectWebsearch = false;
    let modalSelectSearchProfile = false;
    let modalResetSelection = false;
    let openSearchInSamePage;
    let multiSelectWebsearch;

    // Saisie de la requête
    let queryInput = "";

    // Moteurs de recherche
    // - Liste des moteurs de recherche
    const listWebsearch = [
        { id: "0", text: "Google", icon: "/assets/web-search/google.png", query: "http://www.google.fr/search?q=%query%" },
        { id: "1", text: "Bing", icon: "/assets/web-search/bing.png", query: "http://www.bing.com/search?q=%query%" },
        { id: "2", text: "Qwant", icon: "/assets/web-search/qwant.png", query: "http://www.qwant.com/?q=%query%" },
        { id: "3", text: "DuckDuckGo", icon: "/assets/web-search/duckduckgo.png", query: "http://www.duckduckgo.com/?q=%query%" },
        { id: "4", text: "Ecosia", icon: "/assets/web-search/ecosia.png", query: "http://www.ecosia.com/search?q=%query%" },
        { id: "5", text: "Lilo", icon: "/assets/web-search/lilo.png", query: "http://search.lilo.org/?q=%query%" },
        { id: "6", text: "Yandex", icon: "/assets/web-search/yandex.png", query: "http://www.yandex.com/search/?text=%query%" },
    ];
    let queryInputLabel = "Rechercher"; // Label de la barre de recherche
    let selectedWebsearchIDs = []; // Liste des moteurs de recherche sélectionnés
    $: {
        // Initialisation
        selectedWebsearchIDs = [];
        let listSelectedName = [];

        // Parcourir les sites web sélectionnés
        listWebsearch.forEach((wsearch, index) => {
            // Si l'item est sélectionné
            if (wsearch.selected) {
                // Mémoriser le nom de l'item
                listSelectedName.push(wsearch.text);

                // Mémoriser l'id de l'item
                selectedWebsearchIDs.push(parseInt(wsearch.id));
            }

            // Si liste a été complètement parcourue
            if (index+1 == listWebsearch.length) {
                // MAJ le texte pour le label de la barre de recherche
                switch (selectedWebsearchIDs.length) {
                    case 0: // Aucun site web sélectionné
                        queryInputLabel = "Rechercher";
                        break;
                    case 1: case 2: case 3: // 1 à 3 sites web sélectionnés
                        queryInputLabel = "Rechercher sur ";

                        // Parcourir les noms de sites web choisis
                        listSelectedName.forEach((name, ii) => {
                            if (ii == 0) // 1er item
                                queryInputLabel += name;
                            else if (ii+1 < selectedWebsearchIDs.length) // Items au milieu
                                queryInputLabel += ", " + name;
                            else // Dernier item
                                queryInputLabel += " et " + name;
                        });
                        break;
                    default: // Plusieurs sites web sélectionnés
                        queryInputLabel = "Rechercher sur " + selectedWebsearchIDs.length + " sites web";
                        break;
                }
            }
        });
    }


    // Profils de recherche
    // - Index pour Valider/Annuler
    let selectedSearchProfileIndex = 0;
    let lastSelectedSearchProfileIndex = 0;
    // - Liste des profils de recherche
    const listSearchProfile = [
        { id: 0, text: "Personnalisé", icon: "circles", websearch: [] },
        { id: 1, text: "Général", icon: "web", websearch: [0] },
        { id: 2, text: "Images", icon: "image", websearch: [1,2] },
        { id: 3, text: "Vidéos", icon: "play", websearch: [] },
        { id: 4, text: "Musiques", icon: "music", websearch: [] },
        { id: 5, text: "Mail", icon: "mail", websearch: [] },
    ];

	// Observations
	const unsub_openSearchInCurrentPage = openSearchInCurrentPage.subscribe(value => {
		openSearchInSamePage = value;
	});
	const unsub_multiSelectionWebsearch = multiSelectionWebsearch.subscribe(value => {
		multiSelectWebsearch = value;
	});

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_openSearchInCurrentPage();
        unsub_multiSelectionWebsearch();
    });

    // Méthodes
    function confirmChangeWebsearch() {
        // Masquer la popup
        modalSelectWebsearch = false;
        
        // Mémoriser l'ancien profil de recherche
        if (lastSelectedSearchProfileIndex != selectedSearchProfileIndex)
            lastSelectedSearchProfileIndex = selectedSearchProfileIndex;

        // Initialisation pour rechercher un profil correspondant aux moteurs de recherche sélectionnés
        let profileMatch = false;
        let profileFound = 0;

        // Callback pour vérifier si un profil de recherche correspond à la sélection actuelle
        let checkSearchProfile = function(sp, done) {
            // Ne rien faire si un profil de recherche correspondant a été repéré
            if (profileMatch)
                return done();

            // Au départ, on considère que ce profil de recherche ne correspond pas
            profileMatch = false;

            // Avorter si le profil de recherche ne contient pas le même nombre d'items que la sélection actuelle
            if (selectedWebsearchIDs.length != sp.websearch.length)
                return done();

            // À ce stade, il faut vérifier si les items du profils et de la sélection actuelle correspondent
            let listWSearch = sp.websearch;
            if (selectedWebsearchIDs.sort().join(',') === listWSearch.sort().join(',')) {
                profileMatch = true;
                profileFound = sp.id;
            }
            done();
        };

        // Parcourir les profils de recherche
        async.eachSeries(listSearchProfile, checkSearchProfile, () => {
            // Les profils de recherches ont été parcourus
            selectedSearchProfileIndex = profileFound; // MAJ le profil de recherche choisi
            lastSelectedSearchProfileIndex = selectedSearchProfileIndex; // Effacer l'historique
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
        if (listSearchProfile[selectedSearchProfileIndex].websearch.length > 1)
            multiSelectionWebsearch.set(true);

        // Charger les moteurs de recherche du profil :
        // Parcours de la liste des moteurs de recherche local
        listWebsearch.map((wsearch, index) => {
            // Vérifier si le moteurs de recherche fait partie du profil de recherche
            if (listSearchProfile[selectedSearchProfileIndex].websearch.indexOf(index) > -1)
                listWebsearch[index].selected = true; // Sélectionner le moteurs de recherche
            else
                listWebsearch[index].selected = false;
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

        window.websearch = listWebsearch
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
        on:askSearchEngines={() => (modalSelectWebsearch = true)}
        searchEngines={listWebsearch.filter((ws) => ws.selected)}
    />

    <div class="bottomToolbar">
        <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => (modalSelectWebsearch = true)}>
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
        bind:open={modalSelectWebsearch}
        modalHeading="Choisir un moteur de recherche"
        primaryButtonText="Continuer"
        on:click:button--primary={confirmChangeWebsearch}
        hasForm="true"
        on:open
        on:close={confirmChangeWebsearch}
        on:submit={confirmChangeWebsearch}
    >
        <Grid style="padding: 0">
            <Row>
                <Column>
                    <Toggle labelText="Lancer la recherche dans la page actuelle" 
                        labelA="Non" labelB="Oui" bind:toggled={$openSearchInCurrentPage} />
                </Column>
                <Column>
                    <Toggle labelText="Autoriser la sélection multiple" 
                        labelA="Non" labelB="Activé" bind:toggled={$multiSelectionWebsearch} />
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

        <div class="wsearch-list">
            <TileGroup legend="Liste des sites web">
                <div class="wsearch-items" role="group" aria-label="Liste des sites web">
                    {#each listWebsearch as ws_item}
                        {#if multiSelectWebsearch}
                            <SelectableTile bind:selected={ws_item.selected}>
                                <img src="{ws_item.icon}" alt="Logo de { ws_item.text }" />
                                <p>{ws_item.text}</p>
                            </SelectableTile>
                        {:else}
                            <RadioTile value="{ws_item.id}" bind:checked={ws_item.selected}>
                                <img src="{ws_item.icon}" alt="Logo de { ws_item.text }" />
                                <p>{ws_item.text}</p>
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
    .wsearch-items {
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