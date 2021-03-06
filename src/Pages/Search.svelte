<script>
    // Exports
    /**
     * Les paramètres depuis le routeur (svelte-spa-router)
     * @type {object}
     */
    export let params = {}

    /**
     * La hauteur du composant ("extend" pour plein écran - "fit" pour compact)
     * @type {"expand" | "fit"}
     */
    export let size = "expand"

    /**
     * Placer sous l'en-tête
     * @type {boolean}
     */
    export let underHeader = true



    // Imports
    import ModalSearchEnginesSelector
        from '../Modals/ModalSearchEnginesSelector.svelte'
    import ModalSearchProfileSelector
        from '../Modals/ModalSearchProfileSelector.svelte'
    import { Button, Modal, Link }
        from 'carbon-components-svelte'
	import { multiSelectionSearchEngines, enableSelectSearchEnginesLimit, 
        enableSearchEngineAlias, actionWhenOpeningSearchPage,
        startupSearchProfileId, startupSearchEnginesIds,
        selectSearchEnginesLimitValue, openSearchInCurrentPage,
        backgroundType }
        from '../Stores/settings'
	import { listSearchEngines, listSearchProfiles }
        from '../Stores/search'
    import { pageName, pageIcon, transparentHeader }
        from '../Stores/header'
    import SearchBox from '../UI/SearchBox.svelte'
    import Icofont from '../UI/Icofont.svelte'
    import AliasChecker from '../AliasChecker.svelte'
    import async from 'async'
    import { onDestroy, onMount } from 'svelte'



    // MAJ du header
    pageName.set("Rechercher")
    pageIcon.set("search")
    transparentHeader.set(true)



    // Flags
    let modalSelectSearchEngines = false
    let modalSelectSearchProfile = false
    let modalResetSelection = false
    let modalErrorLimitReached = false
    let innerHeight



    // Saisie de la requête
    let queryInput = ""
    let searchBox // L'instance de la barre de recherche



    // Moteurs de recherche
    let searchEngines = [] // Liste des moteurs de recherche
    let selectedSearchEnginesIDs = [] // Liste des moteurs de recherche sélectionnés
    $: enableBgMask = $transparentHeader == true && $backgroundType != "neutral"
    $: {
        // Initialisation
        selectedSearchEnginesIDs = []

        // Parcourir les moteurs de recherche
        searchEngines.forEach((seItem, index) => {
            // Si l'item est sélectionné
            if (seItem.selected) {
                // Mémoriser l'id de l'item
                selectedSearchEnginesIDs.push(parseInt(seItem.id))
            }
        })
    }



    // Profils de recherche
    let selectedSearchProfileID = [] // ID du profil de recherche sélectionné
    const maxSearchProfilesInNavbar = 5



	// Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        // Regénération de la liste en local
        let listSE = []
        async.eachSeries(value, function parseSE(seItem, done) {
            // Ajouts des propriétés manquantes
            seItem.selected = selectedSearchEnginesIDs.indexOf(seItem.id) > -1

            // Ajout dans la liste
            listSE.push(seItem)
            return done()
        }, function finished() {
            // Mise à jour
            searchEngines = listSE
        })
    })



    // Méthodes
    const confirmChangeSearchEngines = e => {
        // Masquer la popup
        modalSelectSearchEngines = false

        // Appliquer la sélection
        selectSearchEngineByIds(e.detail.selectedIds)

        // Sélectionner le profil de recherche correspondant aux moteurs séléctionnés
        updateSelectedSearchProfile()
    }
    const updateSelectedSearchProfile = () => {
        // Initialisation pour rechercher un profil correspondant aux moteurs de recherche sélectionnés
        let profileMatch = false
        let idProfileFound = 0

        // Callback pour vérifier si un profil de recherche correspond à la sélection actuelle
        let checkSearchProfile = (sp, done) => {
            // Ne rien faire si un profil de recherche correspondant a été repéré
            if (profileMatch)
                return done()

            // Au départ, on considère que ce profil de recherche ne correspond pas
            profileMatch = false

            // Avorter si le profil de recherche ne contient pas le même nombre d'items que la sélection actuelle
            if (selectedSearchEnginesIDs.length != sp.searchEnginesIds.length)
                return done()

            // À ce stade, il faut vérifier si les items du profils et de la sélection actuelle correspondent
            let listSE = sp.searchEnginesIds
            if (selectedSearchEnginesIDs.sort().join(',') === listSE.sort().join(',')) {
                profileMatch = true
                idProfileFound = sp.id
            }
            done()
        }

        // Parcourir les profils de recherche
        async.eachSeries($listSearchProfiles, checkSearchProfile, () => {
            // Les profils de recherches ont été parcourus
            selectedSearchProfileID = idProfileFound // MAJ l'id du profil de recherche choisi
        })
    }
    const selectSearchEngineByIds = (listIds) => {
        // Vérifier s'il faut limiter le nombre d'items
        let limitSelectionReached = listIds.length > $selectSearchEnginesLimitValue
        if ($enableSelectSearchEnginesLimit && limitSelectionReached) {
            modalErrorLimitReached = true
            listIds = []
        }
        selectedSearchEnginesIDs = listIds
        
        // Parcours de la liste des moteurs de recherche
        searchEngines.map((seItem, index) => {
            // Sélectionner le moteur de recherche s'il fait partie de la liste des ID
            searchEngines[index].selected = listIds.indexOf(seItem.id) > -1
        })
        
        // Sélectionner le profil de recherche correspondant aux moteurs séléctionnés
        if ($enableSelectSearchEnginesLimit && limitSelectionReached)
            updateSelectedSearchProfile()
    }
    const confirmChangeSearchProfile = e => {
        // MAJ l'historique
        selectSearchProfileById(e.detail.selectedId)

        // Masquer la popup
        modalSelectSearchProfile = false
    }
    const selectSearchProfileById = idSearchProfile => {
        // MAJ le profil de recherche choisi
        selectedSearchProfileID = parseInt(idSearchProfile)

        let searchProfile = $listSearchProfiles.filter(spItem => parseInt(spItem.id) == parseInt(idSearchProfile))[0]

        // Activer la sélection multiple s'il y a plusieurs items dans le profil de recherche
        if (searchProfile.searchEnginesIds.length > 1)
            multiSelectionSearchEngines.set(true)

        // Charger les moteurs de recherche du profil :
        let listSE = searchProfile.searchEnginesIds // Moteurs de recherche du profil de recherche

        // Sélectionner les moteurs de recherche
        selectSearchEngineByIds(listSE)
    }
    const resetSelection = () => {
        // Choisir le 1er item
        loadPreferences()

        modalResetSelection = false // Fermer la popup
    }
    const executeQuery = e => {
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
            if (pages[0] == url && $openSearchInCurrentPage == true)
                return done()

            // Ouvrir l'adresse URL dans une nouvelle page
            window.open(url)

            // Passer au suivant
            return done()
        }, function finished() {
            // Ouvrir la page restante dans la page actuelle si le paramètre est activé
            if ($openSearchInCurrentPage == true)
                window.open(pages[0], "_self") // "_self" => Ouvrir l'adresse URL dans la page actuelle
        })
    }
    const loadPreferences = () => {
        switch ($actionWhenOpeningSearchPage) {
            case "searchProfile":
                // Charger le profil de recherche par défaut (charge le moteur de recherche du profil)
                selectSearchProfileById($startupSearchProfileId)
                break
            case "searchEngines":
                // Charger les moteurs de recherche par défaut
                selectSearchEngineByIds($startupSearchEnginesIds)
                // Sélectionner le profil de recherche correspondant aux moteurs séléctionnés
                updateSelectedSearchProfile()
                break
        }
    }
    const addSearchEngineToSelection = e => {
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
    const removeSearchEngineToSelection = e => {
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
    const replaceSearchEngineToSelection = e => {
        // Le moteur de recherche à sélectionner
        let searchEngine = e.detail.searchEngine

        // Ajouter le moteur de recherche à la séléction
        selectedSearchEnginesIDs = [searchEngine.id]
        selectSearchEngineByIds(selectedSearchEnginesIDs)

        // Séléctionner le profil de recherche correspondant
        updateSelectedSearchProfile()

        // TODO: Afficher une notification : https://carbon-components-svelte.onrender.com/components/ToastNotification#hidden-close-button
    }
    const onUpdateQuery = e => { // Mettre à jour la requete
        queryInput = e.detail.query
        searchBox.changeValue(e.detail.query)
    }
    const onPageMount = () => {
        // Charger les paramètres par défaut
        loadPreferences()

        // Vérifier si des paramètres ont été transmises
        if (Object.keys(params).length == 2) {
            const sectionExists = typeof (params.section) !== 'undefined'
            const idExists = typeof (params.section) !== 'undefined'
            if (sectionExists && idExists) {
                switch (params.section) {
                    case 'search-engine':
                        return selectSearchEngineByIds([parseInt(params.id)])
                    case 'search-profile':
                        return selectSearchProfileById(parseInt(params.id))
                }
            }
        }
    }



    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines()
    })
    onMount(onPageMount)

</script>

<div class="scanners">
    {#if $enableSearchEngineAlias}
        <AliasChecker
            bind:query={ queryInput }
            on:updateQuery={onUpdateQuery}
            on:selectSearchEngine={addSearchEngineToSelection}
            on:deselectSearchEngine={removeSearchEngineToSelection}
            on:replaceSearchEngine={replaceSearchEngineToSelection}
            selectedSearchEngines={searchEngines.filter(seItem => seItem.selected)}
        />
    {/if}
</div>

<svelte:window bind:innerHeight={innerHeight} />

<main id="searchPage"
    class:fit={size == "fit"}
    class:expand={size == "expand"}
    class:underHeader
    style="--height: {innerHeight}px"
>
    <nav class="nav-searchProfile" class:bgMask={enableBgMask}>
        {#each $listSearchProfiles.slice(0, maxSearchProfilesInNavbar) as sp}
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
        {#if $listSearchProfiles.length > maxSearchProfilesInNavbar}
            <Link on:click={() => {modalSelectSearchProfile = true}}>
                <span class="label">Plus {$listSearchProfiles.length - maxSearchProfilesInNavbar}</span>
                <Icofont icon="dropdown" size="16" />
            </Link>
        {/if}
    </nav>

    <div class="centered-form">
        <SearchBox
            bind:this={ searchBox }
            bind:value={ queryInput }
            on:submit={ executeQuery }
            on:askSearchEngines={() => modalSelectSearchEngines = true}
            searchEngines={searchEngines.filter(seItem => seItem.selected)}
            placeholder="Tapez votre requête ici"
            clickableBubbles={true} />
    </div>

    <div class="bottomToolbar" class:bgMask={enableBgMask}>
        <div class="fixed-width">
            <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => modalSelectSearchEngines = true}>
                <Icofont icon="search" />
                <span class="text">Moteurs de recherche</span>
            </Button>
            <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => modalSelectSearchProfile = true}>
                <Icofont icon="search_group" />
                <span class="text">Profils de recherche</span>
            </Button>

            <span class="spacer"></span>

            <Button kind="ghost" style="display: flex; gap: 5px;" on:click={() => modalResetSelection = true}>
                <Icofont icon="bin" />
                <span class="text">Réinitialiser</span>
            </Button>
        </div>
    </div>
</main>

<div class="modals">
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
        modalHeading="Réinitialiser la sélection"
        primaryButtonText="Continuer"
        secondaryButtonText="Annuler"
        on:click:button--primary={resetSelection}
        on:click:button--secondary={() => (modalResetSelection = false)}
        on:open
        on:close={() => (modalResetSelection = false)}
        on:submit={resetSelection}
    >
        <p>Souhaitez-vous réellement rétablir la sélection initiale des moteurs de recherche ?</p>
        <br /><br /><br />
    </Modal>

    <Modal
        size="sm"
        bind:open={modalErrorLimitReached}
        modalHeading="Limite atteinte"
        primaryButtonText="D'accord"
        on:click:button--primary={() => modalErrorLimitReached = false}
        on:close={() => modalErrorLimitReached = false}
    >
        <span style="float: right; color: var(--cds-support-03); margin-left: var(--cds-spacing-04);">
            <Icofont icon="warning" size="50" />
        </span>
        <strong>Vous ne pouvez pas sélectionner plus de {$selectSearchEnginesLimitValue} moteur(s) de recherche.</strong>
        <br/><br/>
        <p>Si vous souhaitez quand même en sélectionner plus, réhaussez la limite ou désactivez le paramètre dans vos préférences.</p>
        <br /><br /><br />
    </Modal>
</div>

<style lang="scss">
    :global(html[theme=white]) main#searchPage {
        --mask-bg-color: #ffffffaa;
    }
    :global(html[theme=g10]) main#searchPage {
        --mask-bg-color: #f4f4f4aa;
    }
    :global(html[theme=g80]) main#searchPage {
        --mask-bg-color: #262626aa;
    }
    :global(html[theme=g90]) main#searchPage {
        --mask-bg-color: #262626aa;
    }
    :global(html[theme=g100]) main#searchPage {
        --mask-bg-color: #161616aa;
    }

    @supports (backdrop-filter: blur(20px)) {
        :global(html[theme=white]) main#searchPage {
            --mask-bg-color: #ffffff66;
        }
        :global(html[theme=g10]) main#searchPage {
            --mask-bg-color: #f4f4f466;
        }
        :global(html[theme=g80]) main#searchPage {
            --mask-bg-color: #26262666;
        }
        :global(html[theme=g90]) main#searchPage {
            --mask-bg-color: #26262666;
        }
        :global(html[theme=g100]) main#searchPage {
            --mask-bg-color: #16161666;
        }
    }

    main#searchPage {
        margin-top: -92px;
        padding: 10px;
        transition: all .3s;

        &.fit,
        &.expand {
            position: relative;
            display: flex;
            flex-flow: column;
            align-items: stretch;
            justify-content: space-between;
            gap: 10px;
        }
        //&.fit {min-height: 500px;}
        &.fit {min-height: 400px;}
        &.expand {
            --height: 300px;
            height: var(--height);
        }
    }

    // Profils de recherche (liens en haut de l'écran)
    .nav-searchProfile {
        margin: -10px;
        padding: 37px 101px;
        padding-bottom: 17px;
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
        display: flex;
        transition: all .5s;
        position: static;
        padding: 10px;

        .fixed-width {
            display: flex;
            width: 100%;
        }

        .spacer {flex: 1;}
        :global(.bx--btn) {
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
        }
        :global(.icofont) {font-size: 16px;}

        &.bgMask {
            margin: -10px;
            padding: 10px;
        }
    }
    
    .bgMask {
        background-color: var(--mask-bg-color);

        /*@supports (backdrop-filter: blur(20px)) {
            backdrop-filter: blur(20px);
        }*/

        :global(.bx--btn) {
            border-radius: 10px;
            color: var(--cds-text-01);
        }

        &.nav-searchProfile {
            background: linear-gradient(to bottom, var(--mask-bg-color), transparent);

            // Lien
            :global(.bx--link) {
                color: var(--cds-text-01);
                position: relative;
            }
            // Lien survolé
            :global(.bx--link.current),
            :global(.bx--link:hover) {
                text-decoration: none;
            }
            // Soulignage des liens
            :global(.bx--link)::after {
                content: '';
                display: block;
                height: 2px;
                border-radius: 5px;
                background: var(--cds-text-01);
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                bottom: -8px;
                opacity: 0;
                transition: all .2s;
            }
            :global(.bx--link:hover)::after {
                opacity: .3;
            }
            :global(.bx--link.current)::after {
                opacity: 1;
            }
        }

        &.bottomToolbar {
            background: linear-gradient(to top, var(--mask-bg-color), transparent);
        }
    }

    // Barre de recherche
    .centered-form {
        display: flex;
        justify-content: center;

        :global(.searchBox) {
            flex: 1;
        }
    }

    @media (max-width: 672px) {
        // Profils de recherche
        .nav-searchProfile {
            padding: 15px 18px;
            justify-content: flex-start;
        }

        // Composant
        main#searchPage {
            margin: 0;

            // En plein écran
            &.expand {
                height: calc(var(--height));
            }

            // Placé sous le header
            &.underHeader {
                margin-top: -52px; // 52px = hauteur du header

                .nav-searchProfile {
                    padding-top: 60px;
                }
            }
        }

        // Barre d'outils en bas
        main#searchPage .bottomToolbar {
            padding: 0;

            :global(.icofont) {font-size: 22px;}
            :global(.text) {display: none;}
        }
    }

    @media (min-width: 672px) {
        main#searchPage .bottomToolbar .fixed-width {
            width: 80%;
            width: calc(80% + 2rem);
            margin: 0 auto;
        }
    }
</style>