<script>
    // Imports
    import { Modal, DataTable, Button, TextInput, Dropdown, OverflowMenu,
        OverflowMenuItem, NumberInput, Breakpoint }
        from "carbon-components-svelte"
    import { listSearchProfiles, listSearchEngines } from '../../Stores/search'
    import { pageName, pageIcon } from '../../Stores/header'
    import { multiSelectionSearchEngines } from '../../Stores/settings'
    import { onDestroy } from 'svelte'
    import Icofont from "../../UI/Icofont.svelte"
    import SearchEnginesBubbles from "../../UI/SearchEnginesBubbles.svelte"
    import ModalSearchEnginesSelector from "../../Modals/ModalSearchEnginesSelector.svelte"

    // MAJ du header
    pageName.set("Profils de recherche")
    pageIcon.set("search")

    // Initialisation
    let size
    let tableColumns = []
    let tableData = []
    let idSelectedItems = []
    let searchEngines
    let searchProfiles
    let sp_name = ""
    let sp_icon = ""
    let sp_searchEnginesIds = []
    let sp_orderPresentation = 0
    let dropdownIconIndex = 0
    let listIcons = [
        { value: "agenda", text: "Agenda" },
        { value: "arrow", text: "Flèche" },
        { value: "bag", text: "Travail" },
        { value: "bell", text: "Cloche" },
        { value: "bin", text: "Déchets" },
        { value: "blog", text: "Actus" },
        { value: "bookmark", text: "Marque-page" },
        { value: "check", text: "Check" },
        { value: "circle", text: "Rond" },
        { value: "circles", text: "Bulles" },
        { value: "clock", text: "Horloge" },
        { value: "compass", text: "Boussole" },
        { value: "config", text: "Configuration" },
        { value: "critical", text: "Critique" },
        { value: "cross", text: "Croix" },
        { value: "details", text: "Détails" },
        { value: "dice", text: "Dés" },
        { value: "disable", text: "Interdit" },
        { value: "download", text: "Téléchargement" },
        { value: "dropdown", text: "Descendre" },
        { value: "duplicate", text: "Copier" },
        { value: "expand", text: "Aggrandir" },
        { value: "experiment", text: "Chimie" },
        { value: "eye", text: "Vue" },
        { value: "file", text: "Fichier" },
        { value: "flag", text: "Drapeau" },
        { value: "folder", text: "Dossier" },
        { value: "hide", text: "Masquer" },
        { value: "home", text: "Maison" },
        { value: "image", text: "Image" },
        { value: "info", text: "Information" },
        { value: "inline_dots", text: "Points alignés" },
        { value: "input", text: "Entrée" },
        { value: "joystick", text: "Manette de jeu" },
        { value: "labo", text: "Plot" },
        { value: "layers", text: "Calques" },
        { value: "line", text: "Ligne" },
        { value: "link", text: "Lien" },
        { value: "lock", text: "Verrou" },
        { value: "mail", text: "Mail" },
        { value: "menu", text: "Menu" },
        { value: "moon", text: "Lune" },
        { value: "music", text: "Musique" },
        { value: "network", text: "Réseau" },
        { value: "output", text: "Sortie" },
        { value: "palette", text: "Palette" },
        { value: "palette_filled", text: "Palette 2" },
        { value: "pause", text: "Pause" },
        { value: "pen", text: "Ecrire" },
        { value: "pie_chart", text: "Camembert" },
        { value: "pin", text: "Epingler" },
        { value: "play", text: "Lecture" },
        { value: "plus", text: "Plus" },
        { value: "profile", text: "Profil" },
        { value: "program", text: "Programme" },
        { value: "project", text: "Boite" },
        { value: "reload", text: "Relancer" },
        { value: "rename", text: "Texte" },
        { value: "screen", text: "Ecran de PC" },
        { value: "script", text: "Script" },
        { value: "search", text: "Loupe" },
        { value: "send", text: "Envoyer" },
        { value: "settings", text: "Réglages" },
        { value: "shopping", text: "Shopping" },
        { value: "slideshow", text: "Présentation" },
        { value: "smartphone", text: "Smartphone" },
        { value: "sort", text: "Entonnoir" },
        { value: "square", text: "Carré" },
        { value: "squares", text: "Petits carrés" },
        { value: "star", text: "Etoile" },
        { value: "stop", text: "Stop" },
        { value: "sun", text: "Soleil" },
        { value: "unlock", text: "Déverrouiller" },
        { value: "unpin", text: "Désépingler" },
        { value: "upload", text: "Importer" },
        { value: "warning", text: "Danger" },
        { value: "web", text: "Web" },
    ]
    for (let ii=0; ii<listIcons.length; ii++) // Ajout d'un id aux icônes
        listIcons[ii].id = ii

    // Flags
    let modalAddItem = false
    let modalPreviewItem = false
    let modalEditItem = false
    let modalDeleteItem = false
    let modalSearchEngines = false

    // Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        searchEngines = value
    })
    const unsub_listSearchProfiles = listSearchProfiles.subscribe(value => {
        searchProfiles = value
        tableData = searchProfiles
    })

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines()
        unsub_listSearchProfiles()
    })

    // Réactivité
    $: {
        // Affichage responsive
        tableColumns = [
            { key: "name", value: "Profil de recherche" },
        ]
        switch (size) {
            case "max":
            case "xlg":
            case "lg":
                tableColumns.push({ key: "searchEnginesIds", value: "Moteurs de recherche" })
        }
        switch (size) {
            case "max":
            case "xlg":
            case "lg":
            case "md":
                tableColumns.push({ key: "orderPresentation", value: "Ordre d'affichage" })
        }
        tableColumns.push({ key: "overflow", empty: true })
    }
    $: sortedIconList = listIcons.sort((a, b) => { // Liste d'icônes triés alphabétiquement
        if ( a.text < b.text )
            return -1
        if ( a.text > b.text )
            return 1
        return 0
    })

    // Méthodes
    function findItemById(id) {
        // Rechercher l'item dans la liste
        for (let ii=0; ii<searchProfiles.length; ii++) {
            // Si l'item a été retrouvé
            if (parseInt(searchProfiles[ii].id) === parseInt(id))
                return searchProfiles[ii] // Retourner l'item
        }
        return null
    }
    function findItemIndexById(id) {
        // Rechercher l'item dans la liste
        for (let ii=0; ii<searchProfiles.length; ii++) {
            // Si l'item a été retrouvé
            if (parseInt(searchProfiles[ii].id) === parseInt(id))
                return ii // Retourner l'index
        }
        return -1
    }
    function findSearchEngineById(id) {
        // Rechercher l'item dans la liste
        for (let ii=0; ii<searchEngines.length; ii++) {
            // Si l'item a été retrouvé
            if (parseInt(searchEngines[ii].id) === parseInt(id))
                return searchEngines[ii]; // Retourner l'item
        }
        return null;
    }
    function findIconIndex(icon) {
        let ii // Index de l'icône

        // Recherche dans la liste des icônes
        for (ii = 0; ii<sortedIconList.length-1; ii++) {
            // Si l'icône a été retrouvé
            if (sortedIconList[ii].value == icon)
                break
        }

        // Si l'icône n'a pas été retrouvé
        if (sortedIconList[ii].value != icon)
            ii = 0

        return ii
    }
    function closeModals() {
        // Fermer les popups
        modalAddItem = false
        modalPreviewItem = false
        modalEditItem = false
        modalDeleteItem = false
        modalSearchEngines = false

        // Vider le formulaire
        clearForm()
    }
    function clearForm() {
        // Vider le formulaire
        dropdownIconIndex = 0
        sp_name = "(Sans nom)"
        sp_icon = sortedIconList[dropdownIconIndex].value
        sp_searchEnginesIds = []
        sp_orderPresentation = 0
    }
    function validateForm() {
        if (sp_name.length < 1) {
            return "Vous devez donner un nom au profil de recherche"
        }
        if (sp_icon.length < 1) {
            return "Vous devez attribuer une icône au profil de recherche"
        }
        /*if (sp_searchEnginesIds.length < 1) {
            return "Vous devez sélectionner au moins un moteur de recherche"
        }*/
        /*if (sp_orderPresentation < 1)
            return "Vous ne pouvez pas entrer de nombre inferieur à 1"*/

        // Les données saisies sont correctes
        return true
    }
    function createItem() {
        // Vérifier que les données du formulaire sont corrects
        let validate = validateForm()
        if (validate != true)
            return alert(validate)

        // Ajouter le profil de recherche dans le Store
        listSearchProfiles.add(sp_name, sp_icon, sp_searchEnginesIds, sp_orderPresentation)

        // Fermer la popup et vider le formulaire
        closeModals()
    }
    function displayDetails(id) {
        // Rechercher le moteur de recherche
        let spItem = findItemById(id)

        // Avorter si le moteur de recherche n'existe pas
        if (spItem == null)
            return alert("Le moteur de recherche n'existe pas")

        // Récupération et attribution des champs
        sp_name = spItem.name
        sp_icon = spItem.icon
        sp_searchEnginesIds = spItem.searchEnginesIds
        sp_orderPresentation = spItem.orderPresentation

        // Afficher la popup de détails
        modalPreviewItem = true
    }
    function editItem(id) {
        // Retrouver le moteur de recherche
        let spItem = findItemById(id)

        // Si l'item n'a pas été retrouvé
        if (spItem == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        idSelectedItems = [spItem.id]
        sp_name = spItem.name
        sp_icon = spItem.icon
        sp_searchEnginesIds = spItem.searchEnginesIds
        sp_orderPresentation = spItem.orderPresentation
        dropdownIconIndex = findIconIndex(sp_icon)

        // Ouvrir la popup
        modalEditItem = true
    }
    function updateItem() {
        // Vérifie que les données du formulaire sont corrects
        let validate = validateForm()
        if (validate != true)
            return alert(validate)

        // Mettre à jour la liste
        listSearchProfiles.updateByIndex(
            findItemIndexById(idSelectedItems[0]),
            sp_name, sp_icon, sp_searchEnginesIds, sp_orderPresentation
        )

        // Fermer les popups
        closeModals()
    }
    function duplicateItem(id) {
        // Retrouver le moteur de recherche
        let spItem = findItemById(id)

        // Si l'item n'a pas été retrouvé
        if (spItem == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        sp_name = spItem.name + " (2)"
        sp_icon = spItem.icon
        sp_searchEnginesIds = spItem.searchEnginesIds
        sp_orderPresentation = spItem.orderPresentation
        dropdownIconIndex = findIconIndex(sp_icon)

        // Ouvrir la popup
        modalAddItem = true
    }
    function confirmDeleteItem(id) {
        // Retrouver le profil de recherche
        let spItem = findItemById(id)

        // Si l'item n'a pas été retrouvé
        if (spItem == null)
            return alert("L'item n'existe pas")

        // Enregistrer l'id du profil
        idSelectedItems = [id]

        // Ouvrir la popup
        modalDeleteItem = true
    }
    function deleteSelectedItem() {
        // Suppression des élements sélectionnés
        for (let ii=0; ii<idSelectedItems.length; ii++) {
            listSearchProfiles.deleteById(idSelectedItems[ii])
        }

        // Vider la liste des items sélectionnés (car les items n'existent plus)
        idSelectedItems = []

        // Ferme tous les popups
        closeModals()
    }
    function editSearchEnginesForSearchProfile(id) {
        // Fermer les popups
        closeModals()

        // Retrouver le moteur de recherche
        let spItem = findItemById(id)

        // Si l'item n'a pas été retrouvé
        if (spItem == null)
            return alert("L'item n'existe pas")

        // Activer la selection multiple de moteur de recherche
        if (spItem.searchEnginesIds.length > 1)
            multiSelectionSearchEngines.set(true)

        // Remplir le formulaire : pour MAJ dans la base
        idSelectedItems = [spItem.id]
        sp_name = spItem.name
        sp_icon = spItem.icon
        sp_searchEnginesIds = spItem.searchEnginesIds
        sp_orderPresentation = spItem.orderPresentation

        // Ouvrir la popup
        modalSearchEngines = true
    }
    function saveSearchEnginesForSearchProfile(e) {
        // Récupérer les id des moteurs sélectionnés
        sp_searchEnginesIds = e.detail.selectedIds

        // Mettre à jour le profil de recherche
        updateItem()
    }
    function getDataForBubbles(listIdSE) { // Liste des id des moteurs de recherche
        // Initialisation des données à retourner
        let data = []

        // Remplissage de la liste
        for (let ii=0; ii<listIdSE.length; ii++)
            data.push(findSearchEngineById(listIdSE[ii]))

        // Retour des données
        return data
    }
</script>

<main class="spManager">
    <Breakpoint bind:size />

    <div class="toolbar">

        <Button title="Ajouter un profil de recherche" kind="primary" on:click={() => {modalAddItem = true; clearForm()}}>
            <Icofont icon="plus" size="18" />
            <span>Nouveau</span>
        </Button>

        <span class="spacer"></span>

        <!--Button title="Affichage" kind="ghost">
            <Icofont icon="squares" size="18" />
            <span>Affichage</span>
        </Button-->
        <!-- ContextMenu -->

    </div>

    <DataTable sortable headers={tableColumns} rows={tableData}>

        <svelte:fragment slot="cell-header" let:header>
            {header.value}
        </svelte:fragment>

        <svelte:fragment slot="cell" let:row let:cell>
            {#if cell.key === "name"}
                <div class="name">
                    <Icofont icon="{row.icon}" size="22" />
                    <span class="text">{row.name}</span>
                </div>
            {:else if cell.key === "searchEnginesIds"}
                <div class="table-bubbles">
                    {#if row.searchEnginesIds.length > 0}
                        <SearchEnginesBubbles bubbleSize="30px" clickable
                            searchEngines={getDataForBubbles(row.searchEnginesIds)}
                            on:click={() => editSearchEnginesForSearchProfile(row.id)} />
                    {:else}
                        (Aucun)
                    {/if}
                </div>
            {:else if cell.key === "orderPresentation"}
                <p class="number">
                    {row.orderPresentation}
                </p>
            {:else if cell.key === "overflow"}
                {#if size == "sm"}
                    <!-- Ne pas afficher de boutons supplémentaire -->
                {:else if size == "md"}
                    <Button title="Voir et tester '{row.name}'" kind="ghost" on:click={() => {displayDetails(row.id)}}>
                        <Icofont icon="search" size="18" />
                    </Button>
                    <Button title="Modifier '{row.name}'" kind="ghost" on:click={() => {editItem(row.id)}}>
                        <Icofont icon="settings" size="18" />
                    </Button>
                    <Button title="Gérer les moteurs de recherche pour '{row.name}'" kind="ghost" on:click={() => editSearchEnginesForSearchProfile(row.id)} >
                        <Icofont icon="circles" size="18" />
                    </Button>
                {:else}
                    <Button title="Voir et tester '{row.name}'" kind="ghost" on:click={() => {displayDetails(row.id)}}>
                        <Icofont icon="search" size="18" />
                        <span class="text">Aperçu</span>
                    </Button>
                    <Button title="Modifier '{row.name}'" kind="ghost" on:click={() => {editItem(row.id)}}>
                        <Icofont icon="settings" size="18" />
                    </Button>
                    <Button title="Gérer les moteurs de recherche pour '{row.name}'" kind="ghost" on:click={() => editSearchEnginesForSearchProfile(row.id)} >
                        <Icofont icon="circles" size="18" />
                    </Button>
                {/if}
                <OverflowMenu flipped>
                    {#if size == "sm"}
                        <OverflowMenuItem text="Aperçu" on:click={() => {displayDetails(row.id)}} />
                        <OverflowMenuItem text="Modifier" on:click={() => {editItem(row.id)}} />
                        <OverflowMenuItem text="Moteurs de recherche" on:click={() => {editSearchEnginesForSearchProfile(row.id)}} />
                    {/if}
                    <OverflowMenuItem text="Dupliquer" on:click={() => {duplicateItem(row.id)}} />
                    <OverflowMenuItem danger text="Supprimer" on:click={() => {confirmDeleteItem(row.id)}} />
                </OverflowMenu>
            {:else}
                {cell.value}
            {/if}
        </svelte:fragment>

    </DataTable>

    <div class="modals">
        <Modal
            bind:open={modalAddItem}
            modalHeading="Créer un profil de recherche"
            primaryButtonText="Créer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={createItem}
        >
            <div class="form-row">
                <Icofont icon="{sp_icon}" />
                <Dropdown
                    titleText="Icône du profil de recherche"
                    items={sortedIconList}
                    bind:selectedIndex={dropdownIconIndex}
                    on:select={(e) => {
                        sp_icon = e.detail.selectedItem.value
                    }}
                />
            </div>
            <br/><br/>
            <TextInput required
                labelText="Nom du profil de recherche"
                bind:value={sp_name}
                placeholder="Lorem ipsum" />
            <br/><br/>
            <NumberInput required
                label="Ordre d'affichage"
                bind:value={sp_orderPresentation} />
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalPreviewItem}
            modalHeading="Aperçu du profil de recherche"
            primaryButtonText="Retour"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={closeModals}
        >
            {#if modalPreviewItem}
                <div class="preview">
                    <Icofont icon={sp_icon} size="100" />
                    <div class="content">
                        <p class="name">{sp_name}</p>
                        <p class="count">{sp_searchEnginesIds.length} {sp_searchEnginesIds.length > 1 ? "moteurs" : "moteur"} de recherche</p>
                        <SearchEnginesBubbles fontSize="14px"
                            searchEngines={getDataForBubbles(sp_searchEnginesIds)} />
                    </div>
                </div>
            {/if}
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalEditItem}
            modalHeading="Modifier le profil de recherche"
            primaryButtonText="Enregistrer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={updateItem}
        >
            <div class="form-row">
                <Icofont icon="{sp_icon}" />
                <Dropdown
                    titleText="Icône du profil de recherche"
                    items={sortedIconList}
                    bind:selectedIndex={dropdownIconIndex}
                    on:select={(e) => {
                        sp_icon = e.detail.selectedItem.value
                    }}
                />
            </div>
            <br/><br/>
            <TextInput required
                labelText="Nom du profil de recherche"
                bind:value={sp_name}
                placeholder="Lorem ipsum" />
            <br/><br/>
            <NumberInput required
                label="Ordre d'affichage"
                bind:value={sp_orderPresentation} />
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalDeleteItem} danger
            modalHeading="Supprimer {idSelectedItems.length == 1 ? "un profil" : "des profils" } de recherche"
            primaryButtonText="Supprimer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={deleteSelectedItem}
        >
            <p>Voulez-vous vraiment supprimer {idSelectedItems.length == 1 ? "le profil de recherche suivant" : "les profils de recherche suivants" } ?</p>
            <br/>

            <div class="list-sp">
                {#each idSelectedItems as idItem }
                    <div class="sp-item">
                        <Icofont icon={searchProfiles[findItemIndexById(idItem)].icon} size="50" />

                        <div class="text">
                            <p class="name">{searchProfiles[findItemIndexById(idItem)].name}</p>
                            <p class="count">{searchProfiles[findItemIndexById(idItem)].searchEnginesIds.length} {searchProfiles[findItemIndexById(idItem)].searchEnginesIds.length > 1 ? "moteurs" : "moteur"} de recherche</p>
                            <SearchEnginesBubbles fontSize="14px"
                                searchEngines={getDataForBubbles(searchProfiles[findItemIndexById(idItem)].searchEnginesIds)} />
                        </div>
                    </div>
                {/each}
            </div>
            <br /><br />
        </Modal>

        <ModalSearchEnginesSelector
            bind:open={modalSearchEngines}
            idSelectedSearchEngines={sp_searchEnginesIds}
            on:submit={saveSearchEnginesForSearchProfile} />
    </div>
</main>

<style lang="scss">
    main.spManager {
        .toolbar {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            :global(.bx--btn) {
                justify-content: center;
                align-items: center;
                gap: .5rem;
            }

            .spacer {flex: 1}
        }

        // Tableau
        :global(.bx--data-table-container) {
            padding: 0;

            // Boutons d'action
            :global(.bx--btn) {
                gap: .5rem;

                &:hover {
                    background: var(--cds-layer-selected-hover);
                }
            }

            // Bouton menu
            :global(.bx--overflow-menu) {
                display: inline-flex;
                height: 100%;
                padding: .75rem 0rem;
                width: 52px;

                :global(.bx--overflow-menu__icon) {
                    width: 1.5rem;
                    height: 1.5rem;
                }
            }
        }
        // - Bubbles
        .table-bubbles {
            display: inline-flex;
            padding-top: 4px;
        }
        // - Actions
        :global(.bx--data-table tbody tr td:last-child) {text-align: right}
        // - Nom
        .name {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .number {font-size: 1.2em;}

        // Popups
        // - Aperçu
        .preview {
            --icon-size: 120px;

            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 1rem;
            gap: 1rem;

            .content {
                display: flex;
                flex-flow: column;
                align-items: flex-start;
                gap: 5px;
            }

            p {padding: 0}

            .name {font-size: 2em}
            .count {margin-bottom: 10px}
        }

        // - Modifier l'icône
        .form-row {
            display: flex;
            align-items: center;
            gap: 1rem;

            :global(.icofont) {font-size: 70px;}
            :global(.bx--dropdown__wrapper) {flex: 1;}
        }

        // - Liste des profils sélectionnés
        .list-sp {
            --icon-size: 35px;

            display: flex;
            flex-flow: column;
            padding: 0 2rem;

            .sp-item {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                padding: 1rem 0;
                gap: 1rem;

                .text {
                    flex: 1;
                    display: flex;
                    flex-flow: column;
                    align-items: flex-start;
                    gap: 3px;

                    p {
                        width: 100%;
                        padding: 0;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .name {font-weight: bold}
                    .count {margin-bottom: 10px}
                }
            }
        }
    }
</style>