<script>
    // Imports
    import { Button, TextInput, Dropdown, Toggle, Modal, FluidForm, Grid, Row, Column, Link, SelectableTile, RadioTile, TileGroup } from "carbon-components-svelte";
    import Icofont from "../UI/Icofont.svelte";

    // Flags
    let modalSelectWebsearch = false;
    let modalSelectProfile = false;
    let modalResetSelection = false;
    let openInSamePage = true;
    let multiSelectWebsearch = false;

    // Saisie de la requête
    let queryInput = "";

    // Moteurs de recherche
    // - Liste des moteurs/[sites web] de recherche
    const listWebsearch = [
        { id: "0", text: "Google", icon: "", query: "http://www.google.fr/search?q=%query%" },
        { id: "1", text: "Bing", icon: "", query: "http://www.bing.com/search?q=%query%" },
        { id: "2", text: "Qwant", icon: "", query: "http://www.qwant.com/?q=%query%" },
        { id: "3", text: "DuckDuckGo", icon: "", query: "http://www.duckduckgo.com/?q=%query%" },
        { id: "4", text: "Ecosia", icon: "", query: "http://www.ecosia.com/search?q=%query%" },
        { id: "5", text: "Lilo", icon: "", query: "http://search.lilo.org/?q=%query%" },
        { id: "6", text: "Yandex", icon: "", query: "http://www.yandex.com/search/?text=%query%" },
    ];
    let queryInputLabel = "Rechercher"; // Label de la barre de recherche
    let countSelectedWebsearch = 0; // Nombre de sites web sélectionnés
    loadPreferences();
    $: {
        // Initialisation
        countSelectedWebsearch = 0;
        let listSelectedName = [];

        // Parcourir les sites web sélectionnés
        listWebsearch.forEach((wsearch, index, list) => {
            // Si l'item est sélectionné
            if (wsearch.selected) {
                // Comptabiliser l'item
                countSelectedWebsearch++;

                // Mémoriser le nom de l'item
                listSelectedName.push(wsearch.text);
            }

            // Si liste a été complètement parcourue
            if (index+1 == listWebsearch.length) {
                // MAJ le texte pour le label de la barre de recherche
                switch (countSelectedWebsearch) {
                    case 0: // Aucun site web sélectionné
                        queryInputLabel = "Rechercher";
                        break;
                    case 1: case 2: case 3: // 1 à 3 sites web sélectionnés
                        queryInputLabel = "Rechercher sur ";

                        // Parcourir les noms de sites web choisis
                        listSelectedName.forEach((name, ii, list) => {
                            if (ii == 0) // 1er item
                                queryInputLabel += name;
                            else if (ii+1 < countSelectedWebsearch) // Items au milieu
                                queryInputLabel += ", " + name;
                            else // Dernier item
                                queryInputLabel += " et " + name;
                        });
                        break;
                    default: // Plusieurs sites web sélectionnés
                        queryInputLabel = "Rechercher sur " + countSelectedWebsearch + " sites web";
                        break;
                }
            }
        });
    }


    // Profils de recherche
    // - Index pour Valider/Annuler
    let selectedProfileIndex = 0;
    let lastSelectedProfileIndex = 0;
    // - Liste des profils de recherche
    const listProfiles = [
        { id: "0", text: "Personnalisé", icon: "circles", websearch: [] },
        { id: "1", text: "Général", icon: "web", websearch: [1] },
        { id: "2", text: "Images", icon: "image", websearch: [] },
        { id: "3", text: "Vidéos", icon: "play", websearch: [] },
        { id: "4", text: "Musiques", icon: "music", websearch: [] },
        { id: "5", text: "Mail", icon: "mail", websearch: [] },
        /*{ id: "2", text: "Gafam", icon: "flag", websearch: [0,1] },
        { id: "3", text: "Français", icon: "flag", websearch: [2,4,5] },
        { id: "4", text: "Ethique", icon: "flag", websearch: [2,3,4,5] },*/
    ];
    // - Propriétés pour les Dropdowns
    const formatSelectedProfile = (i) => (listProfiles[i] ? listProfiles[i].text : "N/A"); // Texte pour les Dropdowns
    $: selectedProfileText = formatSelectedProfile(selectedProfileIndex);
    /*$: { // Selection des moteurs en fonction du profil de recherhce
        if (selectedProfileIndex != 0) {
            // Sélectionner les moteurs de recherche du profil
            let websearchProfile = listProfiles[selectedProfileIndex].websearch;
        }
    }*/

    // Méthodes
    function confirmChangeWebsearch() {
        modalSelectWebsearch = false;
        
        // Choisir le 1er profil de recherche (Mode personnalisé)
        selectedProfileIndex = 0
        lastSelectedProfileIndex = 0
    }
    function cancelChangeProfile() {
        selectedProfileIndex = lastSelectedProfileIndex;
        modalSelectProfile = false;
    }
    function confirmChangeProfile() {
        lastSelectedProfileIndex = selectedProfileIndex;
        modalSelectProfile = false;
    }
    function resetSelection() {
        // Choisir le 1er item
        loadPreferences(); // TODO: Choisir uniquement le profil par défaut

        // Choisir le 1er profil de recherche (Mode personnalisé)
        selectedProfileIndex = 0
        lastSelectedProfileIndex = 0

        modalResetSelection = false // Fermer la popup
    }
    function launchQuery() {
        // Avorter si aucun site web de recherche sélectionné
        if (countSelectedWebsearch == 0) {
            return alert("Vous devez choisir au moins un site web de recherche");
        }

        // Initialisation
        let countPageOpened = 0;
        let remainingQuery = null;

        // Parcours des sites web sélectionnés
        listWebsearch.forEach((wsearch, index, list) => {
            // Si l'item est sélectionné
            if (wsearch.selected) {
                // Générer l'url de la requête
                let path = wsearch.query.replace("%query%", queryInput);

                // Puis lancer la requête
                if (openInSamePage && countSelectedWebsearch == 1) {
                    /* Dans la page actuelle si :
                        1. Le paramètre est activé
                        2. Et qu'il y qu'un seul site web sélectionné
                    */
                    
                    window.open(path, "_self");
                    countPageOpened++; // Comptabiliser le lien (ne sert à rien dans ce cas précis)
                } else { // Ou dans une nouvelle page/fenêtre/onglet
                    // S'il s'agit de la 1ère page et qu'il faut l'ouvrir dans la page actuelle
                    if (countPageOpened == 0 && remainingQuery == null && openInSamePage) {
                        /* Ne pas traiter tout de suite car la page va être changée 
                        et l'appli n'aura pas le temps de traiter les autres pages */

                        remainingQuery = path; // 1. Mémoriser l'url
                        return; // 2. Puis passer au suivant
                    }

                    // Ouvrir le lien dans une noubelle page
                    window.open(path);
                    countPageOpened++; // Comptabiliser le lien
                }
            }

            // A la fin du parcours de la liste des moteurs ET s'il reste une page à ouvrir
            if (index+1 == listWebsearch.length && remainingQuery != null) {
                window.open(remainingQuery, "_self"); // Ouvrir dans la page actuelle
            }
        });
    }
    function loadPreferences() {
        // Initialiser la liste des sites web de recherche
        listWebsearch.forEach((wsearch, index, list) => {
            let selected = false;

            // Sélectionner le 1er élément par défaut
            if (wsearch.id == 0)
                selected = true;
            
            // Créer le flag 'selected'
            listWebsearch[index].selected = selected;
        });
    }
</script>

<main>
    <nav class="navbar-profile">
        {#each listProfiles as profile}
            <Link href="/#/">
                <Icofont icon="{profile.icon}" size="16" />
                <span class="label">{profile.text}</span>
            </Link>
        {/each}
    </nav>

    <FluidForm class="query-form">
        <TextInput size="xl" 
            labelText="{ queryInputLabel }" 
            placeholder="Qui est Molière ?" 
            on:keyup={(e) => {if (e.keyCode==13) launchQuery()}}
            bind:value={ queryInput } />

        <Button on:click={launchQuery}>
            <Icofont icon="search" size="20" />
        </Button>
    </FluidForm>

    <div class="bottomToolbar">
        <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => (modalSelectWebsearch = true)}>
            <Icofont icon="circles" />
            <span class="text">Moteurs de recherche</span>
        </Button>
        <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => (modalSelectProfile = true)}>
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
        on:close
        on:submit
    >
        <Grid style="padding: 0">
            <Row>
                <Column><Toggle labelText="Lancer la recherche dans la page actuelle" labelA="Non" labelB="Oui" bind:toggled={openInSamePage} /></Column>
                <Column><Toggle labelText="Autoriser la sélection multiple" labelA="Non" labelB="Activé" bind:toggled={multiSelectWebsearch} /></Column>
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
                            <SelectableTile bind:selected={ws_item.selected}>{ws_item.text}</SelectableTile>
                        {:else}
                            <RadioTile value="{ws_item.id}" bind:checked={ws_item.selected}>{ws_item.text}</RadioTile>
                        {/if}
                    {/each}
                </div>
            </TileGroup>
        </div>
    </Modal>

    <Modal
        bind:open={modalSelectProfile}
        modalHeading="Choisir un profil de recherche"
        primaryButtonText="Continuer"
        secondaryButtonText="Annuler"
        on:click:button--secondary={cancelChangeProfile}
        on:click:button--primary={confirmChangeProfile}
        hasForm="true"
        on:open
        on:close
        on:submit
    >
        <Dropdown
            titleText="Profils de recherche"
            bind:selectedIndex={selectedProfileIndex}
            items={listProfiles}
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
        on:close
        on:submit
    >
        <p>Voulez-vous vraiment rétablir le profil de recherche par défaut ?</p>
    </Modal>
</main>

<style lang="scss">
    main {padding: 10px;}

    // Barre de recherche
    :global(.bx--form--fluid .bx--text-input-wrapper) {border-radius: 10px;}
    :global(.query-form) {
        max-width: 670px;
        display: flex;
        margin: 10px auto;
        border-radius: 10px;
        box-shadow: 0 0 0 1px rgba(0,0,0,.1), 0 3px 15px rgba(0,0,0,.2);
        transition: all .2s;

        :global(.bx--text-input) {
            margin: 0;
            border-radius: 10px 0 0 10px;
        }

        :global(.bx--btn) {
            display: flex;
            gap: 5px;
            padding: 0;
            width: 64px;
            min-height: initial;
            max-width: initial;
            justify-content: center;
            border-radius: 0 10px 10px 0;
        }
    }
    :global(.bx--form--fluid .bx--text-input-wrapper) {background: transparent;}

    // Profils de recherche (liens en haut de l'écran)
    .navbar-profile {
        padding: 27px;
        display: flex;
        flex-flow: wrap;
        gap: 20px 30px;
        transition: all .5s;

        :global(.bx--link) {
            display: flex;
            align-items: center;
            gap: 5px;
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

    // Popup des sites web de recherche
    .wsearch-items {
        display: flex;
        flex-flow: wrap;
        max-height: 300px;
        overflow: auto;
    }

    @media (max-width: 672px) {
        :global(.query-form) {max-width: 400px;}

        .navbar-profile {padding: 8px;}

        .bottomToolbar {
            padding: 10px;
            :global(.icofont) {font-size: 22px;}
            :global(.text) {display: none;}
        }
    }
</style>