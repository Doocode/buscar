<script>
    // Imports
    import { Modal, DataTable, Button, Tooltip, Search,
        OverflowMenu, OverflowMenuItem, InlineNotification,
        Breakpoint, ContentSwitcher, Switch }
        from 'carbon-components-svelte'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { listBookmarks }
        from '../../Stores/bookmarks'
    import { BookmarkTypes }
        from '../../Classes/Bookmarks/BookmarkType'
    import BookmarkIcon
        from '../../UI/SpeedDial/BookmarkIcon.svelte'
    import BookmarkPreview
        from '../../Forms/Bookmarks/BookmarkPreview.svelte'
    import BookmarkEditor
        from '../../Forms/Bookmarks/BookmarkEditor.svelte'
    import { push }
        from 'svelte-spa-router'



    // MAJ du header
    pageName.set("Marque-pages")
    pageIcon.set("bookmark")



    // Propriétés
    let size // La largeur de l'écran
    let tableColumns = [] // Les colonnes de la vue DataTable
    let idSelectedItems = [] // Les éléments sélectionnés (id)
    let listMessages = [] // Liste des notifications
    let contentIndex = 0 // Index pour le ContentSwitcher (Editeur/Aperçu)
    let zebra = false
    let extendedView = true
    let searchEnabled = true
    let searchValue = ""
    let bk_id = -1
    let bk_name = ""
    let bk_type = null
    let bk_data = {}
    let bk_previousId = null
    let bk_url = null
    let bk_icon = null
    let bk_iconType = null
    let bk_iconBgColor = null
    let bk_iconImageFormat = null



    // Flags
    let modalAddItem = false
    let modalPreviewItem = false
    let modalEditItem = false
    let modalDeleteItem = false
    let modalErrorValues = false
    let editorContainsErrors = false



    // Réactivité
    $: doResponsive(size, idSelectedItems)
    $: tableData = formatTableData($listBookmarks, searchValue, searchEnabled)
    $: contentSwitcherDisabled = editorContainsErrors



    // Méthodes
    const formatTableData = () => {
        // Formatage des données
        let data = $listBookmarks.map(item => {
            return {
                id: item.id,
                name: item.name,
                type: item.type,
                data: item.data,
                previousId: item.previousId,
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
                const searchIcon = item.type == BookmarkTypes.website && containSearch(item.data.icon)
                const searchType = containSearch(item.type.name)
                return searchName || searchIcon || searchType
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
        // Fermer la popup
        modalAddItem = false
        modalPreviewItem = false
        modalEditItem = false
        modalDeleteItem = false

        // Vider le formulaire
        bk_id = -1
        bk_name = ""
        bk_type = null
        bk_data = {}
        bk_previousId = null
        bk_url = null
        bk_icon = null
        bk_iconType = null
        bk_iconBgColor = null
        bk_iconImageFormat = null
        contentIndex = 0
    }
    const newBookmark = () => {
        // Préremplir le formulaire
        bk_id = -1
        bk_name = ""
        bk_type = BookmarkTypes.website
        bk_data = {}
        bk_previousId = null
        bk_url = ""
        bk_icon = ""
        bk_iconType = "image"
        bk_iconBgColor = '#123abc'
        bk_iconImageFormat = "medium"
        contentIndex = 0

        // Afficher le formulaire
        modalAddItem = true
    }
    const createItem = () => {
        // Vérifier si les données du formulaire sont corrects
        if (editorContainsErrors) {
            modalErrorValues = true
            return
        }

        // Mise en forme des données supplémentaires
        bk_data = {
            url: bk_url,
            icon: bk_icon,
            iconType: bk_iconType,
            iconBgColor: bk_iconBgColor,
            iconImageFormat: bk_iconImageFormat,
        }

        // Ajouter le marque-page dans le Store
        listBookmarks.add(bk_name, bk_type, bk_data)

        // Fermer la popup et vider le formulaire
        closeModals()
    }
    const findBookmarkById = id => {
        const results = $listBookmarks.filter(item => item.id == parseInt(id))
        return results.length > 0 ? results[0] : null
    }
    const displayDetails = id => {
        // Rechercher le marque-page
        const item = findBookmarkById(id)

        // Avorter si le marque-page n'existe pas
        if (item == null)
            return alert("Le marque-page n'existe pas")

        // Récupération et attribution des champs
        bk_id = item.id
        bk_name = item.name
        bk_type = item.type
        bk_data = item.data
        bk_previousId = item.previousId
        if (item.type == BookmarkTypes.website) {
            bk_url = item.data.url
            bk_icon = item.data.icon
            bk_iconType = item.data.iconType
            bk_iconBgColor = item.data.iconBgColor
            bk_iconImageFormat = item.data.iconImageFormat
        }

        // Afficher la popup de détails
        modalPreviewItem = true
    }
    const editItem = id => {
        // Retrouver le marque-page
        const item = findBookmarkById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        bk_id = item.id
        bk_name = item.name
        bk_type = item.type
        bk_data = item.data
        bk_previousId = item.previousId
        if (item.type == BookmarkTypes.website) {
            bk_url = item.data.url
            bk_icon = item.data.icon
            bk_iconType = item.data.iconType
            bk_iconBgColor = item.data.iconBgColor
            bk_iconImageFormat = item.data.iconImageFormat
        }

        // Ouvrir la popup
        contentIndex = 0
        modalEditItem = true
    }
    const updateItem = () => {
        // Vérifier si les données du formulaire sont corrects
        if (editorContainsErrors) {
            modalErrorValues = true
            return
        }

        if (bk_type == BookmarkTypes.website) {
            bk_data = {
                url: bk_url,
                icon: bk_icon,
                iconType: bk_iconType,
                iconBgColor: bk_iconBgColor,
                iconImageFormat: bk_iconImageFormat,
            }
        }

        // Mettre à jour la liste
        listBookmarks.updateById(bk_id, bk_name, bk_type, bk_data, bk_previousId)

        // Fermer les popups
        closeModals()
    }
    const duplicateItem = id => {
        // Retrouver le marque-page
        const item = findBookmarkById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        bk_id = -1
        bk_name = item.name + ' (2)'
        bk_type = item.type
        bk_data = item.data
        bk_previousId = item.previousId
        if (item.type == BookmarkTypes.website) {
            bk_url = item.data.url
            bk_icon = item.data.icon
            bk_iconType = item.data.iconType
            bk_iconBgColor = item.data.iconBgColor
            bk_iconImageFormat = item.data.iconImageFormat
        }

        // Ouvrir la popup
        modalAddItem = true
    }
    const confirmDeleteItem = id => {
        if (typeof(id) !== "undefined" && !isNaN(id)) {
            // Retrouver le marque-page
            const item = findBookmarkById(id)

            // Si l'item n'a pas été retrouvé
            if (item == null)
                return alert("L'item n'existe pas")

            // Enregistrer l'id du moteur
            bk_id = id
        }

        // Ouvrir la popup
        modalDeleteItem = true
    }
    const deleteSelectedItems = () => {
        // Suppression des élements sélectionnés
        if (bk_id > 0)
            listBookmarks.deleteById(bk_id)
        else {
            idSelectedItems.forEach(id => listBookmarks.deleteById(id))

            // Vider la liste des items sélectionnés (car les items n'existent plus)
            idSelectedItems = []
        }

        // Ferme tous les popups
        closeModals()
    }
    const scanUrlForIcons = async url => {
    }
    const openBookmark = e => {
        switch (e.type) {
            case BookmarkTypes.directory:
                break
            case BookmarkTypes.website:
                window.open(e.data.url)
                break
            case BookmarkTypes.searchEngine:
                push('/search/search-engine/' + e.data.id)
                break
            case BookmarkTypes.searchProfile:
                push('/search/search-profile/' + e.data.id)
                break
        }
    }
    const parseType = type => {
        // Affichage du type dans le tableau
        let template = {
            icon: "warning",
            text: "(inconnu)"
        }

        // Déterminer le type
        switch (type) {
            case BookmarkTypes.directory:
                template.icon = 'folder_close'
                template.text = 'Dossier'
                break
            case BookmarkTypes.website:
                template.icon = 'web'
                template.text = 'Site web'
                break
            case BookmarkTypes.searchEngine:
                template.icon = 'search'
                template.text = 'Moteur de recherche'
                break
            case BookmarkTypes.searchProfile:
                template.icon = 'search_group'
                template.text = 'Profil de recherche'
                break
        }

        return template
    }
    const doResponsive = () => {
        // Liste des colonnes visibles
        tableColumns = [{ key: "name", value: "Marque-page" }]
        if (['md', 'lg', 'xlg', 'max'].indexOf(size) > -1) {
            tableColumns.push({ key: "type", value: "Type" })
        }
        //if (idSelectedItems.length == 0)
            tableColumns.push({ key: "overflow", empty: true })
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
        $listBookmarks.forEach(item => listIds.push(parseInt(item.id)))
        idSelectedItems = listIds
    }
    const invertSelection = () => {
        let listIds = []
        $listBookmarks.forEach(item => {
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

<main class="sdManager">
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
            <Button kind="primary"
                title="Ajouter un marque-page"
                on:click={newBookmark}
            >
                <Icofont icon="plus" size="18" />
                <span>Nouveau</span>
            </Button>

            {#if ['md', 'lg', 'xlg', 'max'].indexOf(size) > -1}
                <div><Search placeholder="Rechercher" bind:value={searchValue} /></div>
            {/if}
    
            <span class="spacer"></span>

            <!--{#if idSelectedItems.length > 0}
                <OverflowMenu flipped style="width: auto; height: auto;">
                    <div slot="menu" class="menu-button">
                        <Icofont icon="search_group" size="22" />
                        {#if [/*'md',*/ 'lg', 'xlg', 'max'].indexOf(size) > -1}
                            <span class="label">Profils de recherche</span>
                        {/if}
                        <Icofont icon="dropdown" size="14" />
                    </div>



                    <OverflowMenuItem
                        title="Créer un profil de recherche à partir de la sélection"
                        on:click
                    >
                        <div class="label">
                            <Icofont icon="search_group" size="18" />
                            <span class="text">Nouveau profil de recherche à partir de la sélection</span>
                        </div>
                    </OverflowMenuItem>

                    <OverflowMenuItem
                        title="Ajouter la sélection à un profil de recherche"
                        on:click
                    >
                        <div class="label">
                            <Icofont icon="plus" size="18" />
                            <span class="text">Ajouter la sélection à un profil de recherche</span>
                        </div>
                    </OverflowMenuItem>
                </OverflowMenu>
            {/if}-->

            <OverflowMenu flipped style="width: auto; height: auto;">
                <div slot="menu" class="menu-button">
                    <Icofont icon="cursor_select" size="22" />
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

                {#if searchValue.length > 0 && $listBookmarks.length != tableData.length}
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
                        <Icofont icon="checkbox" size="18" />
                        <span class="text">Tout sélectionner</span>
                    </div>
                </OverflowMenuItem>

                <OverflowMenuItem
                    title="Ne rien sélectionner"
                    on:click={clearSelection}
                >
                    <div class="label">
                        <Icofont icon="square" size="18" />
                        <span class="text">Ne rien sélectionner</span>
                    </div>
                </OverflowMenuItem>

                <OverflowMenuItem
                    title="Inverser la sélection"
                    on:click={invertSelection}
                >
                    <div class="label">
                        <Icofont icon="checkbox_indeterminate" size="18" />
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
                    <OverflowMenuItem text={'Désactiver les rayures'}
                        on:click={() => {zebra=!zebra}} />
                {:else}
                    <OverflowMenuItem text={'Activer les rayures'}
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

        <DataTable {zebra} sortable
            selectable={true}
            headers={tableColumns} rows={tableData}
            bind:selectedRowIds={idSelectedItems} >

            <svelte:fragment slot="cell-header" let:header>
                {header.value}
            </svelte:fragment>
    
            <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === "name"}
                    <div class="name"
                        on:click={() => selectItem(row.id)}
                        on:dblclick={() => openBookmark(row)} >
                        <div style="width: 40px; margin: -.5rem 0;">
                            {#if row.type == BookmarkTypes.directory}
                                <BookmarkIcon bookmarkType={row.type} />
                            {:else if row.type == BookmarkTypes.website}
                                <BookmarkIcon bookmarkType={row.type}
                                    name={row.name}
                                    type={row.data.iconType}
                                    value={row.data.icon}
                                    bgColor={row.data.iconBgColor}
                                    imageSize={row.data.iconImageFormat} />
                            {:else if row.type == BookmarkTypes.searchEngine}
                                <BookmarkIcon bookmarkType={row.type}
                                    name={row.name}
                                    value={row.data.icon} />
                            {:else if row.type == BookmarkTypes.searchProfile}
                                <BookmarkIcon bookmarkType={row.type}
                                    name={row.name}
                                    value={row.data.icon}
                                    searchEnginesIds={row.data.searchEngines} />
                            {/if}
                        </div>
                        <span class="text">{row.name}</span>
                    </div>
                {:else if cell.key === "type"}
                    <div class="type">
                        <Icofont icon={ parseType(row.type).icon } size="18" />
                        <span class="text">{ parseType(row.type).text }</span>
                    </div>
                {:else if cell.key === "overflow"}
                    {#if size == "sm"}
                        <!-- Ne pas afficher de boutons supplémentaire -->
                    {:else if size == "md"}
                        <Button kind="ghost"
                            title="Ouvrir '{row.name}'"
                            on:click={() => openBookmark(row)}>
                            <Icofont icon="folder_open" size="18" />
                        </Button>
                        <Button kind="ghost"
                            title="Modifier '{row.name}'"
                            on:click={() => editItem(row.id)}>
                            <Icofont icon="pencil" size="18" />
                        </Button>
                        <Button kind="ghost"
                            title="Dupliquer '{row.name}'"
                            on:click={() => duplicateItem(row.id)}>
                            <Icofont icon="duplicate" size="18" />
                        </Button>
                    {:else}
                        <Button kind="ghost"
                            title="Voir et tester '{row.name}'"
                            on:click={() => openBookmark(row)}>
                            <Icofont icon="folder_open" size="18" />
                            <span class="text">Ouvrir</span>
                        </Button>
                        <Button kind="ghost"
                            title="Modifier '{row.name}'"
                            on:click={() => editItem(row.id)}>
                            <Icofont icon="pencil" size="18" />
                        </Button>
                        <Button kind="ghost"
                            title="Dupliquer '{row.name}'"
                            on:click={() => duplicateItem(row.id)}>
                            <Icofont icon="duplicate" size="18" />
                        </Button>
                    {/if}
                    <OverflowMenu flipped>
                        {#if size == "sm"}
                            <OverflowMenuItem on:click={() => openBookmark(row)} >
                                <div class="label">
                                    <Icofont icon="folder_open" size="16" />
                                    <span class="text">Ouvrir</span>
                                </div>
                            </OverflowMenuItem>
                            <OverflowMenuItem on:click={() => editItem(row.id)} >
                                <div class="label">
                                    <Icofont icon="pencil" size="16" />
                                    <span class="text">Modifier</span>
                                </div>
                            </OverflowMenuItem>
                            <OverflowMenuItem on:click={() => duplicateItem(row.id)} >
                                <div class="label">
                                    <Icofont icon="duplicate" size="16" />
                                    <span class="text">Dupliquer</span>
                                </div>
                            </OverflowMenuItem>
                        {/if}
                        {#if row.type == BookmarkTypes.website}
                            <OverflowMenuItem on:click={() => scanUrlForIcons(row.data.url)} >
                                <div class="label">
                                    <Icofont icon="search" size="16" />
                                    <span class="text">TODO: Rechercher des icônes</span>
                                </div>
                            </OverflowMenuItem>
                        {/if}
                        <OverflowMenuItem on:click={() => displayDetails(row.id)} >
                            <div class="label">
                                <Icofont icon="info" size="16" />
                                <span class="text">Détails</span>
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
            bind:primaryButtonDisabled={contentSwitcherDisabled}
            modalHeading="Créer un marque-page"
            primaryButtonText="Créer"
            secondaryButtonText="Annuler"
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
                <BookmarkEditor
                    bind:id={bk_id}
                    bind:name={bk_name}
                    bind:data={bk_data}
                    bind:type={bk_type}
                    bind:url={bk_url}
                    bind:icon={bk_icon}
                    bind:iconType={bk_iconType}
                    bind:iconBgColor={bk_iconBgColor}
                    bind:iconImageFormat={bk_iconImageFormat}
                    bind:containsErrors={editorContainsErrors}
                />
            {:else}
                <BookmarkPreview
                    bind:name={bk_name}
                    bind:data={bk_data}
                    bind:type={bk_type}
                />
                <br /><br />
            {/if}
        </Modal>

        <Modal
            bind:open={modalPreviewItem}
            modalHeading="Aperçu du marque-page"
            primaryButtonText="Retour"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={closeModals}
        >
            {#if modalPreviewItem}
                <BookmarkPreview
                    bind:name={bk_name}
                    bind:data={bk_data}
                    bind:type={bk_type}
                />
            {/if}
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalEditItem}
            bind:primaryButtonDisabled={contentSwitcherDisabled}
            modalHeading="Modifier le marque-page"
            primaryButtonText="Enregistrer"
            secondaryButtonText="Annuler"
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
                <BookmarkEditor
                    bind:id={bk_id}
                    bind:name={bk_name}
                    bind:data={bk_data}
                    bind:type={bk_type}
                    bind:url={bk_url}
                    bind:icon={bk_icon}
                    bind:iconType={bk_iconType}
                    bind:iconBgColor={bk_iconBgColor}
                    bind:iconImageFormat={bk_iconImageFormat}
                    bind:containsErrors={editorContainsErrors}
                />
            {:else}
                <BookmarkPreview
                    bind:name={bk_name}
                    bind:data={bk_data}
                    bind:type={bk_type}
                />
                <br /><br />
            {/if}
        </Modal>

        <Modal
            bind:open={modalDeleteItem} danger
            modalHeading="Supprimer {(bk_id > 0 ? [bk_id] : idSelectedItems).length == 1 ? "un marque-page" : "des marque-pages" } "
            primaryButtonText="Supprimer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={deleteSelectedItems}
        >
            {#if idSelectedItems.length == 1 || bk_id > 0}
                <p>Voulez-vous vraiment supprimer le marque-page suivant ?</p>
            {:else if idSelectedItems.length > 1}
                <p>Voulez-vous vraiment supprimer les marque-pages suivants ?</p>
            {/if}
            <br/>

            <div class="list-selected">
                {#each (bk_id > 0 ? [bk_id] : idSelectedItems) as idItem }
                    <div class="selected-item">
                        <div class="bx-icon">
                            {#if findBookmarkById(idItem).type == BookmarkTypes.directory}
                                <BookmarkIcon bookmarkType={BookmarkTypes.directory} />
                            {:else if findBookmarkById(idItem).type == BookmarkTypes.website}
                                <BookmarkIcon bookmarkType={findBookmarkById(idItem).type}
                                    name={findBookmarkById(idItem).name}
                                    type={findBookmarkById(idItem).data.iconType}
                                    value={findBookmarkById(idItem).data.icon}
                                    bgColor={findBookmarkById(idItem).data.iconBgColor}
                                    imageSize={findBookmarkById(idItem).data.iconImageFormat} />
                            {:else if findBookmarkById(idItem).type == BookmarkTypes.searchEngine}
                                <BookmarkIcon bookmarkType={findBookmarkById(idItem).type}
                                    name={findBookmarkById(idItem).name}
                                    value={findBookmarkById(idItem).data.icon} />
                            {:else if findBookmarkById(idItem).type == BookmarkTypes.searchProfile}
                                <BookmarkIcon bookmarkType={findBookmarkById(idItem).type}
                                    name={findBookmarkById(idItem).name}
                                    value={findBookmarkById(idItem).data.icon}
                                    searchEnginesIds={findBookmarkById(idItem).data.searchEngines} />
                            {/if}
                        </div>

                        <div class="text">
                            <p class="name">{findBookmarkById(idItem).name}</p>
                            <p class="type">
                                <Icofont icon={ parseType(findBookmarkById(idItem).type).icon } size="14" />
                                <span class="text">{ parseType(findBookmarkById(idItem).type).text }</span>
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalErrorValues} passiveModal
            modalHeading="Formulaire incorrect"
            on:close={closeModals}
        >
            <p>Pour pouvoir continuer, vous devez correctement remplir le formulaire.</p>
            <br /><br />
        </Modal>
    </div>
</main>

<style lang="scss">
    main.sdManager {
        // Affichage
        .viewPage {
            max-width: 100%;
            transition: all .3s;

            @media (min-width: 672px) { // width > sm
                &:not(.extended) {
                    max-width: 80%;
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
        // - Actions
        :global(.bx--data-table tbody tr td:last-child) {text-align: right;}
        // - Nom et type
        .name, .type {
            --icon-size: 25px;

            display: flex;
            align-items: center;
            gap: 10px;

            img {
                width: var(--icon-size);
                height: var(--icon-size);
                border-radius: var(--icon-size);
                box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            }
        }
        // - Nom
        .name {
            cursor: pointer;
            padding: 10px 0;
        }
        // - Type
        .type {
            gap: var(--cds-spacing-02);
            .text {font-size: .9em;}
        }

        // Popups
        // - Liste des items sélectionnés (popup de suppression)
        .list-selected {
            --icon-size: 45px;

            display: flex;
            flex-flow: column;
            padding: 0 2rem;

            .selected-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: .5rem 0;
                gap: 1rem;

                .bx-icon {
                    width: var(--icon-size);
                    height: var(--icon-size);
                }

                .text {
                    flex: 1;

                    p {
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .name {
                        font-weight: bold;
                        padding: 0;
                        cursor: default;
                    }
                }
            }
        }
    }
</style>