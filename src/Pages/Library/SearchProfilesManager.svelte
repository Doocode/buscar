<script>
    // Imports
    import { Modal, DataTable, Button, OverflowMenu, Breakpoint,
        OverflowMenuItem, Search, InlineNotification,
        ContentSwitcher, Switch, Tooltip }
        from 'carbon-components-svelte'
    import { listSearchProfiles }
        from '../../Stores/search'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import { multiSelectionSearchEngines }
        from '../../Stores/settings'
    import { onDestroy }
        from 'svelte'
    import Icofont
        from '../../UI/Icofont.svelte'
    import SearchEnginesBubbles
        from '../../UI/SearchEnginesBubbles.svelte'
    import ModalSearchEnginesSelector
        from '../../Modals/ModalSearchEnginesSelector.svelte'
    import ModalSelectIcofont
        from '../../Modals/ModalSelectIcofont.svelte'
    import SearchEnginesManager
        from '../../Classes/SearchEnginesManager'
    import SearchProfilesManager
        from '../../Classes/SearchProfilesManager'
    import SearchProfileEditor
        from './SearchProfile/Editor.svelte'
    import SearchProfilePreview
        from './SearchProfile/Preview.svelte'



    // MAJ du header
    pageName.set("Profils de recherche")
    pageIcon.set("search")



    // Propriétés
    const SE_MANAGER = new SearchEnginesManager
    const SP_MANAGER = new SearchProfilesManager
    let size
    let tableColumns = []
    let idSelectedItems = [] // Les profils de recherche sélectionnés (id)
    let listMessages = [] // Liste des notifications
    let contentIndex = 0 // Index pour le ContentSwitcher (Editeur/Aperçu)
    let zebra = false
    let extendedView = true
    let searchEnabled = true
    let searchValue = ""
    let sp_id = -1
    let sp_name = ""
    let sp_icon = ""
    let sp_searchEnginesIds = []
    let sp_orderPresentation = 0



    // Flags
    let modalAddItem = false
    let modalPreviewItem = false
    let modalEditItem = false
    let modalDeleteItem = false
    let modalSearchEngines = false
    let modalIcons = false



    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        SE_MANAGER.destroy()
        SP_MANAGER.destroy()
    })



    // Réactivité
    $: doResponsive(size)
    $: tableData = formatTableData($listSearchProfiles, searchValue, searchEnabled)
    $: contentSwitcherDisabled = isFormValid(sp_name, sp_icon, sp_searchEnginesIds, sp_orderPresentation) != true



    // Méthodes
    const formatTableData = () => {
        // Formattage des données
        let data = $listSearchProfiles.map(item => {
            return {
                id: item.id,
                name: item.name,
                icon: item.icon,
                searchEnginesIds: item.searchEnginesIds,
                orderPresentation: item.orderPresentation,
            }
        })

        // Filtrer la recherche
        const searchBarVisible = searchEnabled || ['md', 'lg', 'xlg', 'max'].indexOf(size) > -1
        if (searchValue.length > 0 && searchBarVisible) {
            // Vérifie si un string contient les termes recherché
            const containSearch = str => str.toLowerCase().indexOf(searchValue.toLowerCase()) > -1

            // Filtres
            data = data.filter(item => {
                const searchName = containSearch(item.name)
                const searchIcon = containSearch(item.icon)
                // TODO: Chercher dans les moteurs aussi
                return searchName || searchIcon
            })
        }

        return data
    }
    const toggleSearch = () => {
        searchEnabled = !searchEnabled
        if (!searchEnabled)
            searchValue = ""
    }
    const closeModals = () => {
        // Fermer les popups
        modalPreviewItem = false
        modalDeleteItem = false
        modalIcons = false
        // Si une des popup d'edition est ouverte
        if (modalAddItem || modalEditItem) {
            // Et que celle des moteurs est ouverte
            if (modalSearchEngines)
                return modalSearchEngines = false
        }
        modalAddItem = false
        modalEditItem = false
        modalSearchEngines = false

        // Vider le formulaire
        clearForm()
    }
    const clearForm = () => {
        // Vider le formulaire
        sp_id = -1
        sp_name = "(Sans nom)"
        sp_icon = ""
        sp_searchEnginesIds = []
        sp_orderPresentation = 0
    }
    const validateForm = () => {
        if (sp_name.length < 1)
            return "Vous devez donner un nom au profil de recherche"
        if (sp_icon.length < 1)
            return "Vous devez attribuer une icône au profil de recherche"
        /*if (sp_searchEnginesIds.length < 1)
            return "Vous devez sélectionner au moins un moteur de recherche"*/
        /*if (sp_orderPresentation < 1)
            return "Vous ne pouvez pas entrer de nombre inferieur à 1"*/
        // TODO: Valider positionNumber

        // Les données saisies sont correctes
        return true
    }
    const isFormValid = () => {
        if (sp_name.length < 1)
            return false
        if (sp_icon.length < 1)
            return false
        /*if (sp_searchEnginesIds.length < 1)
            return "Vous devez sélectionner au moins un moteur de recherche"*/
        /*if (sp_orderPresentation < 1)
            return "Vous ne pouvez pas entrer de nombre inferieur à 1"*/
        // TODO: Valider positionNumber

        // Les données saisies sont correctes => true
        return true
    }
    const createItem = () => {
        // Vérifier que les données du formulaire sont corrects
        const validate = validateForm()
        if (validate != true)
            return alert(validate)

        // Ajouter le profil de recherche dans le Store
        listSearchProfiles.add(sp_name, sp_icon, sp_searchEnginesIds, sp_orderPresentation)

        // Fermer la popup et vider le formulaire
        closeModals()
    }
    const displayDetails = id => {
        // Rechercher le moteur de recherche
        const item = SP_MANAGER.findById(id)

        // Avorter si le moteur de recherche n'existe pas
        if (item == null)
            return alert("Le moteur de recherche n'existe pas")

        // Récupération et attribution des champs
        sp_id = item.id
        sp_name = item.name
        sp_icon = item.icon
        sp_searchEnginesIds = item.searchEnginesIds
        sp_orderPresentation = item.orderPresentation

        // Afficher la popup de détails
        modalPreviewItem = true
    }
    const editItem = id => {
        // Retrouver le moteur de recherche
        const item = SP_MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        sp_id = item.id
        sp_name = item.name
        sp_icon = item.icon
        sp_searchEnginesIds = item.searchEnginesIds
        sp_orderPresentation = item.orderPresentation

        // Ouvrir la popup
        modalEditItem = true
    }
    const updateItem = e => {
        // Vérifie que les données du formulaire sont corrects
        const validate = validateForm()
        if (validate != true)
            return alert(validate)

        // Mettre à jour la liste
        SP_MANAGER.updateById(sp_id, sp_name, sp_icon, sp_searchEnginesIds, sp_orderPresentation)

        // Fermer les popups
        closeModals()
    }
    const duplicateItem = id => {
        // Retrouver le moteur de recherche
        const item = SP_MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        sp_name = item.name + " (2)"
        sp_icon = item.icon
        sp_searchEnginesIds = item.searchEnginesIds
        sp_orderPresentation = item.orderPresentation

        // Ouvrir la popup
        modalAddItem = true
    }
    const confirmDeleteItem = id => {
        if (typeof(id) !== "undefined" && !isNaN(id)) {
            // Retrouver le moteur de recherche
            const item = SP_MANAGER.findById(id)

            // Si l'item n'a pas été retrouvé
            if (item == null)
                return alert("L'item n'existe pas")

            // Enregistrer l'id du moteur
            sp_id = parseInt(id)
        }

        // Ouvrir la popup
        modalDeleteItem = true
    }
    const deleteSelectedItem = () => {
        // Suppression des élements sélectionnés
        if (sp_id > 0)
            SP_MANAGER.deleteById(sp_id)
        else {
            idSelectedItems.forEach(id => SP_MANAGER.deleteById(id))

            // Vider la liste des items sélectionnés (car les items n'existent plus)
            idSelectedItems = []
        }

        // Ferme tous les popups
        closeModals()
    }
    const editSearchEnginesForSearchProfile = id => {
        // Fermer les popups
        closeModals()

        // Retrouver le moteur de recherche
        const item = SP_MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("L'item n'existe pas")

        // Activer la selection multiple de moteur de recherche
        if (item.searchEnginesIds.length > 1)
            multiSelectionSearchEngines.set(true)

        // Remplir le formulaire : pour MAJ dans la base
        sp_id = item.id
        sp_name = item.name
        sp_icon = item.icon
        sp_searchEnginesIds = item.searchEnginesIds
        sp_orderPresentation = item.orderPresentation

        // Ouvrir la popup
        modalSearchEngines = true
    }
    const saveSearchEnginesForSearchProfile = e => {
        // Récupérer les id des moteurs sélectionnés
        sp_searchEnginesIds = e.detail.selectedIds

        // Mettre à jour le profil de recherche
        updateItem()
    }
    const findSearchEnginesByIds = listIds => SE_MANAGER.findByListIds(listIds)
    const onSubmitIcon = e => {
        modalIcons = false
        sp_icon = e.detail.value
    }
    const doResponsive = () => {
        // Affichage responsive
        tableColumns = [{ key: "name", value: "Profil de recherche" }]
        if (['max', 'xlg', 'lg'].indexOf(size) > -1)
            tableColumns.push({ key: "searchEnginesIds", value: "Moteurs de recherche" })
        if (['max', 'xlg', 'lg', 'mg'].indexOf(size) > -1)
            tableColumns.push({ key: "orderPresentation", value: "Ordre d'affichage" })
        tableColumns.push({ key: "overflow", empty: true })
    }
    const defineAsStartup = id => {
        const item = SP_MANAGER.findById(id)

        if (item != null) {
            SP_MANAGER.setItemAsStartup(id)
            listMessages.push({
                kind: 'success', title: 'Mise à jour réussie',
                subtitle: "Le profil de recherche \""+item.name+"\" a été défini comme profil de recherche de démarrage"
            })
            listMessages = listMessages
        }
    }
    const selectItem = id => {
        if (isItemSelected(id))
            idSelectedItems = idSelectedItems.filter(item => parseInt(item) !== parseInt(id))
        else
            idSelectedItems = [...idSelectedItems, parseInt(id)]
    }
    const clearSelection = () => idSelectedItems = []
    const selectAll = () => {
        let listIds = []
        $listSearchProfiles.forEach(item => listIds.push(parseInt(item.id)))
        idSelectedItems = listIds
    }
    const invertSelection = () => {
        let listIds = []
        $listSearchProfiles.forEach(item => {
            if (!isItemSelected(item.id))
                listIds.push(parseInt(item.id))
        })
        idSelectedItems = listIds
    }
    const selectOnlyFilteredItems = () => {
        let listIds = []
        tableData.forEach(item => listIds.push(parseInt(item.id)))
        idSelectedItems = listIds
    }
    const addFilteredItemsToSelection = () => {
        tableData.forEach(item => {
            if (!isItemSelected(item.id))
                selectItem(item.id)
        })
    }
    const isItemSelected = id => idSelectedItems.indexOf(parseInt(id)) >= 0
</script>

<main class="spManager">
    <Breakpoint bind:size />

    <div class="viewPage" class:extended={extendedView}>
        <!-- Barre de recherche sur mobile -->
        {#if ['sm'].indexOf(size) > -1 && searchEnabled}
            <div class="toolbar">
                <Search placeholder="Rechercher" bind:value={searchValue} />
            </div>
        {/if}

        <!-- Barre d'outils -->
        <div class="toolbar">

            <Button title="Ajouter un profil de recherche" kind="primary" on:click={() => {modalAddItem = true; clearForm()}}>
                <Icofont icon="plus" size="18" />
                <span>Nouveau</span>
            </Button>

            {#if ['md', 'lg', 'xlg', 'max'].indexOf(size) > -1}
                <div><Search placeholder="Rechercher" bind:value={searchValue} /></div>
            {/if}

            <span class="spacer"></span>

            <OverflowMenu flipped style="width: auto; height: auto;">
                <div slot="menu" class="menu-button">
                    <Icofont icon="select_all" size="22" />
                    {#if [/*'md',*/ 'lg', 'xlg', 'max'].indexOf(size) > -1}
                        {#if idSelectedItems.length > 0}
                            <span class="label">Sélection ({idSelectedItems.length})</span>
                        {:else}
                            <span class="label">Sélection</span>
                        {/if}
                    {/if}
                    <Icofont icon="dropdown" size="14" />
                </div>

                {#if idSelectedItems.length > 0}
                    <OverflowMenuItem danger
                        title="Supprimer la sélection"
                        on:click={confirmDeleteItem}
                        style="margin-bottom: 1rem"
                    >
                        <div class="label">
                            <Icofont icon="bin" size="18" />
                            <span class="text">Supprimer la sélection</span>
                        </div>
                    </OverflowMenuItem>
                {/if}

                {#if searchValue.length > 0 && $listSearchProfiles.length != tableData.length}
                    <OverflowMenuItem
                        title="Sélectionner uniquement les éléments filtrés"
                        on:click={selectOnlyFilteredItems}
                    >
                        <div class="label">
                            <Icofont icon="filter" size="18" />
                            <span class="text">Sélectionner uniquement les éléments filtrés</span>
                        </div>
                    </OverflowMenuItem>

                    <OverflowMenuItem
                        title="Ajouter les éléments filtrés à la sélection"
                        on:click={addFilteredItemsToSelection}
                        style="margin-bottom: 1rem"
                    >
                        <div class="label">
                            <Icofont icon="plus" size="18" />
                            <span class="text">Ajouter les éléments filtrés à la sélection</span>
                        </div>
                    </OverflowMenuItem>
                {/if}

                <OverflowMenuItem
                    title="Tout sélectionner"
                    on:click={selectAll}
                >
                    <div class="label">
                        <Icofont icon="select_all" size="18" />
                        <span class="text">Tout sélectionner</span>
                    </div>
                </OverflowMenuItem>

                <OverflowMenuItem
                    title="Ne rien sélectionner"
                    on:click={clearSelection}
                >
                    <div class="label">
                        <Icofont icon="disable" size="18" />
                        <span class="text">Ne rien sélectionner</span>
                    </div>
                </OverflowMenuItem>

                <OverflowMenuItem
                    title="Inverser la sélection"
                    on:click={invertSelection}
                >
                    <div class="label">
                        <Icofont icon="select_invert" size="18" />
                        <span class="text">Inverser la sélection</span>
                    </div>
                </OverflowMenuItem>
            </OverflowMenu>
            
            <OverflowMenu flipped style="width: auto; height: auto;">
                <div slot="menu" class="menu-button">
                    {#if [/*'md',*/ 'lg', 'xlg', 'max'].indexOf(size) > -1}
                        <span class="label">Menu</span>
                    {/if}
                    <Icofont icon="menu_dots" size="22" />
                </div>
    
                {#if ['sm'].indexOf(size) > -1}
                    <OverflowMenuItem title="Activer/désactiver la recherche"
                        on:click={toggleSearch}
                    >
                        <div class="label">
                            {#if searchEnabled}
                                <Icofont icon="hide" size="16" />
                                <span class="text">Masquer la barre de recherche</span>
                            {:else}
                                <Icofont icon="search" size="16" />
                                <span class="text">Rechercher</span>
                            {/if}
                        </div>
                    </OverflowMenuItem>
                {/if}
                {#if zebra}
                    <OverflowMenuItem text={'Désactiver "Zebra"'}
                        on:click={() => {zebra=!zebra}} />
                {:else}
                    <OverflowMenuItem text={'Activer "Zebra"'}
                        on:click={() => {zebra=!zebra}} />
                {/if}
                {#if size != "sm"}
                    {#if extendedView}
                        <OverflowMenuItem text="Centrer l'affichage"
                            on:click={() => {extendedView=!extendedView}} />
                    {:else}
                        <OverflowMenuItem text="Étendre l'affichage"
                            on:click={() => {extendedView=!extendedView}} />
                    {/if}
                {/if}
            </OverflowMenu>

        </div>

        <!-- Liste des messages -->
        {#if listMessages.length > 0}
            <div>
                {#each listMessages as msg}
                    <InlineNotification lowContrast {...msg} />
                {/each}
            </div>
        {/if}

        <DataTable sortable selectable={true} {zebra}
            headers={tableColumns} rows={tableData}
            bind:selectedRowIds={idSelectedItems} >

            <svelte:fragment slot="cell-header" let:header>
                {header.value}
            </svelte:fragment>

            <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === "name"}
                    <div class="name clickable" on:click={() => selectItem(row.id)}>
                        <Icofont icon="{row.icon}" size="22" />
                        <span class="text">{row.name}</span>
                    </div>
                {:else if cell.key === "searchEnginesIds"}
                    <div class="table-bubbles">
                        {#if row.searchEnginesIds.length > 0}
                            <SearchEnginesBubbles bubbleSize="30px" clickable
                                searchEngines={findSearchEnginesByIds(row.searchEnginesIds)}
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
                            <Icofont icon="info" size="18" />
                        </Button>
                        <Button title="Modifier '{row.name}'" kind="ghost" on:click={() => {editItem(row.id)}}>
                            <Icofont icon="pencil" size="18" />
                        </Button>
                        <Button title="Gérer les moteurs de recherche pour '{row.name}'" kind="ghost" on:click={() => editSearchEnginesForSearchProfile(row.id)} >
                            <Icofont icon="circles" size="18" />
                        </Button>
                    {:else}
                        <Button title="Voir et tester '{row.name}'" kind="ghost" on:click={() => {displayDetails(row.id)}}>
                            <Icofont icon="info" size="18" />
                            <span class="text">Détails</span>
                        </Button>
                        <Button title="Modifier '{row.name}'" kind="ghost" on:click={() => {editItem(row.id)}}>
                            <Icofont icon="pencil" size="18" />
                        </Button>
                        <Button title="Gérer les moteurs de recherche pour '{row.name}'" kind="ghost" on:click={() => editSearchEnginesForSearchProfile(row.id)} >
                            <Icofont icon="circles" size="18" />
                        </Button>
                    {/if}
                    <OverflowMenu flipped>
                        {#if size == "sm"}
                            <OverflowMenuItem on:click={() => displayDetails(row.id)} >
                                <div class="label">
                                    <Icofont icon="eye" size="16" />
                                    <span class="text">Détails</span>
                                </div>
                            </OverflowMenuItem>
                            <OverflowMenuItem on:click={() => editItem(row.id)} >
                                <div class="label">
                                    <Icofont icon="pencil" size="16" />
                                    <span class="text">Modifier</span>
                                </div>
                            </OverflowMenuItem>
                            <OverflowMenuItem on:click={() => editSearchEnginesForSearchProfile(row.id)} >
                                <div class="label">
                                    <Icofont icon="circles" size="16" />
                                    <span class="text">Gérer les moteurs de recherche</span>
                                </div>
                            </OverflowMenuItem>
                        {/if}
                        <OverflowMenuItem on:click={() => defineAsStartup(row.id)} >
                            <div class="label">
                                <Icofont icon="upload" size="16" />
                                <span class="text">Définir comme sélection au démarrage</span>
                            </div>
                        </OverflowMenuItem>
                        <OverflowMenuItem on:click={() => duplicateItem(row.id)} >
                            <div class="label">
                                <Icofont icon="duplicate" size="16" />
                                <span class="text">Dupliquer</span>
                            </div>
                        </OverflowMenuItem>
                        {#if idSelectedItems.length == 0}
                            <OverflowMenuItem danger on:click={() => confirmDeleteItem(row.id)} >
                                <div class="label">
                                    <Icofont icon="bin" size="16" />
                                    <span class="text">Supprimer</span>
                                </div>
                            </OverflowMenuItem>
                        {/if}
                    </OverflowMenu>
                {:else}
                    {cell.value}
                {/if}
            </svelte:fragment>

        </DataTable>
    </div>

    <div class="modals">
        <Modal
            bind:open={modalAddItem}
            modalHeading="Créer un profil de recherche"
            primaryButtonText="Créer"
            secondaryButtonText="Annuler"
            bind:primaryButtonDisabled={contentSwitcherDisabled}
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={createItem}
        >
            <ContentSwitcher bind:selectedIndex={contentIndex}>
                <Switch text="Edition" disabled={contentSwitcherDisabled} />
                <Switch text="Aperçu" disabled={contentSwitcherDisabled} />
            </ContentSwitcher>
            <br/>
            {#if contentSwitcherDisabled}
                <Tooltip triggerText="Mode Aperçu désactivé" align="center">
                    <p>Le mode "Aperçu" est désactivé car le formulaire
                        n'est pas correctement renseigné.</p>
                </Tooltip>
            {/if}
            <br/>

            {#if contentIndex == 0}
                <SearchProfileEditor
                    bind:id={sp_id} bind:name={sp_name} bind:icon={sp_icon}
                    bind:searchEnginesIds={sp_searchEnginesIds}
                    bind:orderPresentation={sp_orderPresentation}
                    on:requestSearchEngines={() => modalSearchEngines = true}
                    on:requestIcon={() => modalIcons = true} />
            {:else}
                <SearchProfilePreview
                    bind:name={sp_name} bind:icon={sp_icon}
                    bind:searchEnginesIds={sp_searchEnginesIds}
                    bind:orderPresentation={sp_orderPresentation} />
            {/if}
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
                <SearchProfilePreview
                    bind:name={sp_name} bind:icon={sp_icon}
                    bind:searchEnginesIds={sp_searchEnginesIds}
                    bind:orderPresentation={sp_orderPresentation} />
            {/if}
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalEditItem}
            modalHeading="Modifier le profil de recherche"
            primaryButtonText="Enregistrer"
            secondaryButtonText="Annuler"
            bind:primaryButtonDisabled={contentSwitcherDisabled}
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={updateItem}
        >
            <ContentSwitcher bind:selectedIndex={contentIndex}>
                <Switch text="Edition" disabled={contentSwitcherDisabled} />
                <Switch text="Aperçu" disabled={contentSwitcherDisabled} />
            </ContentSwitcher>
            <br/>
            {#if contentSwitcherDisabled}
                <Tooltip triggerText="Mode Aperçu désactivé" align="center">
                    <p>Le mode "Aperçu" est désactivé car le formulaire
                        n'est pas correctement renseigné.</p>
                </Tooltip>
            {/if}
            <br/>

            {#if contentIndex == 0}
                <SearchProfileEditor
                    bind:id={sp_id} bind:name={sp_name} bind:icon={sp_icon}
                    bind:searchEnginesIds={sp_searchEnginesIds}
                    bind:orderPresentation={sp_orderPresentation}
                    on:requestSearchEngines={() => modalSearchEngines = true}
                    on:requestIcon={() => modalIcons = true} />
            {:else}
                <SearchProfilePreview
                    bind:name={sp_name} bind:icon={sp_icon}
                    bind:searchEnginesIds={sp_searchEnginesIds}
                    bind:orderPresentation={sp_orderPresentation} />
                <br /><br />
            {/if}
        </Modal>

        <Modal
            bind:open={modalDeleteItem} danger
            modalHeading="Supprimer {(sp_id > 0 ? [sp_id] : idSelectedItems).length == 1 ? "un profil" : "des profils" } de recherche"
            primaryButtonText="Supprimer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={deleteSelectedItem}
        >
            {#if idSelectedItems.length == 1 || sp_id > 0}
                <p>Voulez-vous vraiment supprimer le profil de recherche suivant ?</p>
            {:else if idSelectedItems.length > 1}
                <p>Voulez-vous vraiment supprimer les profils de recherche suivants ?</p>
            {/if}
            <br/>

            <div class="list-sp">
                {#each (sp_id > 0 ? [sp_id] : idSelectedItems) as idItem }
                    <div class="sp-item">
                        <Icofont icon={SP_MANAGER.findById(idItem).icon} size="50" />

                        <div class="text">
                            <p class="name">{SP_MANAGER.findById(idItem).name}</p>
                            <p class="count">{SP_MANAGER.findById(idItem).searchEnginesIds.length} {SP_MANAGER.findById(idItem).searchEnginesIds.length > 1 ? "moteurs" : "moteur"} de recherche</p>
                            <SearchEnginesBubbles fontSize="14px"
                                searchEngines={findSearchEnginesByIds(SP_MANAGER.findById(idItem).searchEnginesIds)} />
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

        <ModalSelectIcofont
            value={sp_icon}
            bind:open={modalIcons}
            on:submit={onSubmitIcon}
            on:open={() => sp_icon = sp_icon} />
    </div>
</main>

<style lang="scss">
    main.spManager {
        // Affichage
        .viewPage {
            --width: 640px;
            max-width: 100%;
            transition: all .3s;

            @media (min-width: 672px) { // width > sm
                &:not(.extended) {
                    max-width: var(--width);
                    margin: var(--cds-spacing-09) auto;

                    .toolbar {
                        --border-radius: 8px;
                        margin-bottom: var(--cds-spacing-04);
                        gap: var(--cds-spacing-04);

                        :global(.bx--btn),
                        :global(.bx--overflow-menu) {border-radius: var(--border-radius);}

                        // Barre de recherche
                        :global(.bx--search-input) {border-radius: var(--border-radius);}
                        :global(.bx--search--xl .bx--search-close) {
                            border-radius: 0 var(--border-radius) var(--border-radius) 0;
                        }
                    }

                    /*:global(.bx--data-table thead),
                    :global(.bx--data-table thead tr),
                    :global(.bx--data-table--sort th) {
                        background: transparent;
                    }

                    :global(.bx--data-table thead th:first-child .bx--table-sort) {
                        border-top-left-radius: 10px;
                    }
                    :global(.bx--data-table thead th:last-child) {
                        border-top-right-radius: 10px;
                        background: var(--cds-layer-accent);
                    }*/
                }
            }

            @media (min-width: 1056px) { // width > md
                & {--width: 1000px;}
            }

            @media (min-width: 1312px) { // width > lg
                & {--width: 1300px;}
            }

            @media (min-width: 1584px) { // width > xlg
                & {--width: 1550px;}
            }
        }

        // Barre d'outils
        .toolbar {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            transition: all .3s;
            background: var(--cds-ui-background);

            // Bouton
            :global(.bx--btn) {
                justify-content: center;
                align-items: center;
                gap: .5rem;
            }

            // Barre de recherche
            :global(.bx--search-input) {margin: 0;}

            // Espacement
            .spacer {flex: 1}

            // Bouton Menu
            .menu-button {
                padding: .8rem .9rem;
                color: var(--cds-text-02);
                display: inline-flex;
                align-items: center;
                gap: var(--cds-spacing-03);
            }
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

            &.clickable {
                cursor: pointer;
                padding: 10px 0;
            }
        }
        .number {font-size: 1.2em;}

        // Popups

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