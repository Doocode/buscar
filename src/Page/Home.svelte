<script>
    // Imports
    import { Button, TextInput, Dropdown, Toggle, Modal, FluidForm, Grid, Row, Column } from "carbon-components-svelte";
    import Icofont from "../UI/Icofont.svelte";

    // Flags
    let modalSelectWebsearch = false;
    let modalSelectProfile = false;
    let modalResetSelection = false;
    let openInSamePage = true;

    // Saisie de la requête
    let queryInput = "";

    // Moteurs de recherche
    // - Index pour Valider/Annuler
    let selectedWebsearchIndex = 0;
    let lastSelectedWebsearchIndex = 0;
    // - Liste des moteurs de recherche
    const listWebsearch = [
        { id: "0", text: "Google", icon: "", query: "http://www.google.fr/search?q=%query%" },
        { id: "1", text: "Bing", icon: "", query: "http://www.bing.com/search?q=%query%" },
        { id: "2", text: "Qwant", icon: "", query: "http://www.qwant.com/?q=%query%" },
        { id: "3", text: "DuckDuckGo", icon: "", query: "http://www.duckduckgo.com/?q=%query%" },
        { id: "4", text: "Ecosia", icon: "", query: "http://www.ecosia.com/search?q=%query%" },
        { id: "5", text: "Lilo", icon: "", query: "http://search.lilo.org/?q=%query%" },
        { id: "6", text: "Yandex", icon: "", query: "http://www.yandex.com/search/?text=%query%" },
    ];
    // - Propriétés pour les Dropdowns
    const formatSelectedWebsearch = (i) => (listWebsearch[i] ? listWebsearch[i].text : "N/A"); // Texte pour les Dropdowns
    $: selectedWebsearchText = formatSelectedWebsearch(selectedWebsearchIndex);


    // Profils de recherche
    // - Index pour Valider/Annuler
    let selectedProfileIndex = 0;
    let lastSelectedProfileIndex = 0;
    // - Liste des profils de recherche
    const listProfiles = [
        { id: "0", text: "Personnalisé", icon: "", websearch: [] },
        { id: "1", text: "Général", icon: "", websearch: [0,1,2,3,4,5,6] },
        { id: "2", text: "Gafam", icon: "", websearch: [0,1] },
        { id: "3", text: "Français", icon: "", websearch: [2,4,5] },
        { id: "4", text: "Ethique", icon: "", websearch: [2,3,4,5] },
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
    function cancelChangeWebsearch() {
        selectedWebsearchIndex = lastSelectedWebsearchIndex;
        modalSelectWebsearch = false;
    }
    function confirmChangeWebsearch() {
        lastSelectedWebsearchIndex = selectedWebsearchIndex;
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
        selectedWebsearchIndex = 0
        lastSelectedWebsearchIndex = selectedWebsearchIndex

        // Choisir le 1er profil de recherche (Mode personnalisé)
        selectedProfileIndex = 0
        lastSelectedProfileIndex = 0

        modalResetSelection = false // Fermer la popup
    }
    function launchQuery() {
        let path = listWebsearch[selectedWebsearchIndex].query.replace("%query%", queryInput);
        
        if (openInSamePage) {
            window.open(path, "_self");
        } else {
            window.open(path);
        }
    }
</script>

<main>
    <!--p>Moteur choisi : { listWebsearch[selectedWebsearchIndex].text }</p>
    <p>Moteur choisi : { selectedWebsearchText }</p-->

    <FluidForm class="query-form">
        <TextInput size="xl" 
            labelText="Rechercher sur { selectedWebsearchText }" 
            placeholder="Qui est Shakespear ?" 
            on:keyup={(e) => {if (e.keyCode==13) launchQuery()}}
            bind:value={queryInput} />

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
        secondaryButtonText="Annuler"
        on:click:button--secondary={cancelChangeWebsearch}
        on:click:button--primary={confirmChangeWebsearch}
        hasForm="true"
        on:open
        on:close
        on:submit
    >
        <Dropdown
            titleText="Moteurs de recherche"
            bind:selectedIndex={selectedWebsearchIndex}
            items={listWebsearch}
        />
        <br/><br/>
        
        <Grid style="padding: 0">
            <Row>
                <Column><Toggle labelText="Ouvrir dans la page actuelle" labelA="Non" labelB="Oui" bind:toggled={openInSamePage} /></Column>
                <Column><Toggle labelText="Choisir plusieurs éléments" labelA="Non" labelB="Activé" /></Column>
            </Row>
        </Grid>

        <br/><br/><br/><br/>
        <br/><br/><br/>
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