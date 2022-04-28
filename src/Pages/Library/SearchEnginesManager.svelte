<script>
    // Imports
    import { Modal, DataTable, Button, Tooltip, Search,
        OverflowMenu, OverflowMenuItem, Tag, InlineNotification,
        Breakpoint, ContentSwitcher, Switch }
        from 'carbon-components-svelte'
    import { listSearchEngines } 
        from '../../Stores/search'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'
    import SearchEngineEditor
        from './SearchEngine/Editor.svelte'
    import SearchEnginePreview
        from './SearchEngine/Preview.svelte'
    import SearchEnginesManager
        from '../../Classes/SearchEnginesManager'
    import { onDestroy }
        from 'svelte'



    // MAJ du header
    pageName.set("Moteurs de recherche")
    pageIcon.set("circles")



    // Propriétés
    const MANAGER = new SearchEnginesManager
    let size // La largeur de l'écran
    let tableColumns = [] // Les colonnes de la vue DataTable
    let idSelectedItems = [] // Les moteurs sélectionnés (id)
    let listMessages = [] // Liste des notifications
    let contentIndex = 0 // Index pour le ContentSwitcher (Editeur/Aperçu)
    let zebra = false
    let extendedView = true
    let searchEnabled = true
    let searchValue = ""
    let se_id = -1
    let se_name = ""
    let se_query = ""
    let se_alias = ""
    let se_icon = ""
    let se_type = null



    // Flags
    let modalAddItem = false
    let modalPreviewItem = false
    let modalEditItem = false
    let modalDeleteItem = false
    let modalErrorValues = false



    // Réactivité
    $: doResponsive(size, idSelectedItems)
    $: tableData = formatTableData($listSearchEngines, searchValue, searchEnabled)
    $: contentSwitcherDisabled = isFormValid(se_name, se_icon, se_query, se_alias) != true



    onDestroy(() => MANAGER.destroy())



    // Méthodes
    const formatTableData = () => {
        // Formatage des données
        let data = $listSearchEngines.map(item => {
            return {
                id: item.id,
                name: item.name,
                type: item.type,
                icon: item.icon,
                alias: item.alias,
                query: item.queryUrl,
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
                const searchQuery = containSearch(item.query)
                const searchType = containSearch(item.type.name)
                return searchName || searchIcon || searchQuery || searchType
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
        se_id = -1
        se_name = ""
        se_query = ""
        se_alias = ""
        se_icon = ""
        se_type = null
        contentIndex = 0
    }
    const isFormValid = () => {
        // Retourner false si une de ces condition est valide
        if (se_name.length < 1)
            return false
        if (se_icon.length < 1)
            return false
        if (se_query.length < 1)
            return false
        if (se_query.indexOf("%query%") < 1)
            return false
        if (!MANAGER.isAliasUnique(se_id, se_alias))
            return false

        // Les données saisies sont correctes => true
        return true
    }
    const createItem = () => {
        // Vérifier si les données du formulaire sont corrects
        if (!isFormValid()) {
            modalErrorValues = true
            return
        }

        // Ajouter le moteur de recherche dans le Store
        listSearchEngines.add(se_name, se_alias, se_icon, se_query, se_type)

        // Fermer la popup et vider le formulaire
        closeModals()
    }
    const displayDetails = id => {
        // Rechercher le moteur de recherche
        const se = MANAGER.findById(id)

        // Avorter si le moteur de recherche n'existe pas
        if (se == null)
            return alert("Le moteur de recherche n'existe pas")

        // Récupération et attribution des champs
        se_id = se.id
        se_name = se.name
        se_query = se.queryUrl
        se_alias = se.alias
        se_icon = se.icon
        se_type = se.type

        // Afficher la popup de détails
        modalPreviewItem = true
    }
    const editItem = id => {
        // Retrouver le moteur de recherche
        const se = MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (se == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        se_id = se.id
        se_name = se.name
        se_query = se.queryUrl
        se_alias = se.alias
        se_icon = se.icon
        se_type = se.type

        // Ouvrir la popup
        modalEditItem = true
    }
    const updateItem = () => {
        // Vérifier si les données du formulaire sont corrects
        if (!isFormValid()) {
            modalErrorValues = true
            return
        }

        // Mettre à jour la liste
        MANAGER.updateById(se_id, se_name, se_alias, se_icon, se_query, se_type)

        // Fermer les popups
        closeModals()
    }
    const duplicateItem = id => {
        // Retrouver le moteur de recherche
        const se = MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (se == null)
            return alert("L'item n'existe pas")

        // Remplir le formulaire
        se_id = -1
        se_name = se.name + " (2)"
        se_query = se.queryUrl
        se_alias = se.alias + "2"
        se_icon = se.icon
        se_type = se.type

        // Ouvrir la popup
        modalAddItem = true
    }
    const confirmDeleteItem = id => {
        if (typeof(id) !== "undefined" && !isNaN(id)) {
            // Retrouver le moteur de recherche
            const se = MANAGER.findById(id)

            // Si l'item n'a pas été retrouvé
            if (se == null)
                return alert("L'item n'existe pas")

            // Enregistrer l'id du moteur
            se_id = id
        }

        // Ouvrir la popup
        modalDeleteItem = true
    }
    const deleteSelectedItems = () => {
        // Suppression des élements sélectionnés
        if (se_id > 0)
            MANAGER.deleteById(se_id)
        else {
            idSelectedItems.forEach(id => MANAGER.deleteById(id))

            // Vider la liste des items sélectionnés (car les items n'existent plus)
            idSelectedItems = []
        }

        // Ferme tous les popups
        closeModals()
    }
    const parseType = (type) => {
        // Affichage du type dans le tableau
        let template = {
            icon: "warning",
            text: "(inconnu)"
        }

        if (type != null) {
            template.icon = type.icon
            template.text = type.name
        }

        return template
    }
    const doResponsive = () => {
        // Liste des colonnes visibles
        tableColumns = [{ key: "name", value: "Moteur de recherche" }]
        if (['md', 'lg', 'xlg', 'max'].indexOf(size) > -1) {
            tableColumns.push({ key: "type", value: "Type" })
            tableColumns.push({ key: "alias", value: "Alias" })
        }
        //if (idSelectedItems.length == 0)
            tableColumns.push({ key: "overflow", empty: true })
    }
    const defineAsStartupItems = () => {
        MANAGER.setListAsStartup(idSelectedItems)
        listMessages.push({
            kind: 'success', title: 'Mise à jour réussie',
            subtitle: "La sélection a été définie comme moteurs de recherche de démarrage"
        })
        listMessages = listMessages
    }
    const selectItem = (id) => {
        if (isItemSelected(id))
            idSelectedItems = idSelectedItems.filter(item => parseInt(item) !== parseInt(id))
        else
            idSelectedItems = [...idSelectedItems, parseInt(id)]
    }
    const clearSelection = () => idSelectedItems = []
    const selectAll = () => {
        let listIds = []
        $listSearchEngines.forEach(item => listIds.push(parseInt(item.id)))
        idSelectedItems = listIds
    }
    const invertSelection = () => {
        let listIds = []
        $listSearchEngines.forEach(item => {
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

<main class="wsManager">
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
                title="Ajouter un moteur de recherche"
                on:click={() => modalAddItem = true}
            >
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
                    <OverflowMenuItem
                        title="Définir comme moteurs de recherche par défaut"
                        on:click={defineAsStartupItems}
                    >
                        <div class="label">
                            <Icofont icon="upload" size="18" />
                            <span class="text">Définir comme sélection au démarrage</span>
                        </div>
                    </OverflowMenuItem>

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

                {#if searchValue.length > 0 && $listSearchEngines.length != tableData.length}
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

        <DataTable {zebra} sortable
            selectable={true}
            headers={tableColumns} rows={tableData}
            bind:selectedRowIds={idSelectedItems} >

            <svelte:fragment slot="cell-header" let:header>
                {header.value}
            </svelte:fragment>
    
            <svelte:fragment slot="cell" let:row let:cell>
                {#if cell.key === "name"}
                    <div class="name" on:click={() => selectItem(row.id)}>
                        <img src="{row.icon}" alt="Logo de {row.name}"/>
                        <span class="text">{row.name}</span>
                    </div>
                {:else if cell.key === "type"}
                    <div class="type">
                        <Icofont icon={ parseType(row.type).icon } size="20" />
                        <span class="text">{ parseType(row.type).text }</span>
                    </div>
                {:else if cell.key === "query"}
                    <p class="query">{cell.value}</p>
                {:else if cell.key === "alias"}
                    {#if cell.value.length > 0}
                        <Tag>{cell.value}</Tag>
                    {:else}
                        <Tag disabled>(Non défini)</Tag>
                    {/if}
                {:else if cell.key === "overflow"}
                    {#if size == "sm"}
                        <!-- Ne pas afficher de boutons supplémentaire -->
                    {:else if size == "md"}
                        <Button kind="ghost"
                            title="Détails '{row.name}'"
                            on:click={() => displayDetails(row.id)}>
                            <Icofont icon="info" size="18" />
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
                            on:click={() => displayDetails(row.id)}>
                            <Icofont icon="info" size="18" />
                            <span class="text">Détails</span>
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
                            <OverflowMenuItem on:click={() => displayDetails(row.id)} >
                                <div class="label">
                                    <Icofont icon="info" size="16" />
                                    <span class="text">Détails</span>
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
            modalHeading="Créer un moteur de recherche"
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
                <SearchEngineEditor
                    bind:id={se_id} bind:name={se_name}
                    bind:icon={se_icon} bind:query={se_query}
                    bind:alias={se_alias} bind:type={se_type}
                />
            {:else}
                <SearchEnginePreview
                    bind:id={se_id} bind:name={se_name}
                    bind:icon={se_icon} bind:query={se_query}
                    bind:alias={se_alias} bind:type={se_type}
                />
                <br /><br />
            {/if}
        </Modal>

        <Modal
            bind:open={modalPreviewItem}
            modalHeading="Aperçu du moteur de recherche"
            primaryButtonText="Retour"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={closeModals}
        >
            {#if modalPreviewItem}
                <SearchEnginePreview
                    bind:id={se_id} bind:name={se_name}
                    bind:icon={se_icon} bind:query={se_query}
                    bind:alias={se_alias} bind:type={se_type}
                />
            {/if}
            <br /><br />
        </Modal>

        <Modal
            bind:open={modalEditItem}
            bind:primaryButtonDisabled={contentSwitcherDisabled}
            modalHeading="Modifier le moteur de recherche"
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
                <SearchEngineEditor
                    bind:id={se_id} bind:name={se_name}
                    bind:icon={se_icon} bind:query={se_query}
                    bind:alias={se_alias} bind:type={se_type}
                />
            {:else}
                <SearchEnginePreview
                    bind:id={se_id} bind:name={se_name}
                    bind:icon={se_icon} bind:query={se_query}
                    bind:alias={se_alias} bind:type={se_type}
                />
                <br /><br />
            {/if}
        </Modal>

        <Modal
            bind:open={modalDeleteItem} danger
            modalHeading="Supprimer {(se_id > 0 ? [se_id] : idSelectedItems).length == 1 ? "un moteur" : "des moteurs" } de recherche"
            primaryButtonText="Supprimer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={deleteSelectedItems}
        >
            {#if idSelectedItems.length == 1 || se_id > 0}
                <p>Voulez-vous vraiment supprimer le moteur de recherche suivant ?</p>
            {:else if idSelectedItems.length > 1}
                <p>Voulez-vous vraiment supprimer les moteurs de recherche suivants ?</p>
            {/if}
            <br/>

            <div class="list-se">
                {#each (se_id > 0 ? [se_id] : idSelectedItems) as idItem }
                    <div class="se-item">
                        <img src="{MANAGER.findById(idItem).icon}"
                            alt="Logo de {MANAGER.findById(idItem).name}"/>

                        <div class="text">
                            <p class="name">{MANAGER.findById(idItem).name}</p>
                            <p class="query">{MANAGER.findById(idItem).queryUrl}</p>
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
    main.wsManager {
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
        // Requête URL
        .query {
            font-size: 100%;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        // Popups
        // - Liste des moteurs sélectionnés (popup de suppression)
        .list-se {
            --icon-size: 35px;

            display: flex;
            flex-flow: column;
            padding: 0 2rem;

            .se-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: .5rem 0;
                gap: 1rem;

                img {
                    width: var(--icon-size);
                    height: var(--icon-size);
                    border-radius: var(--icon-size);
                    box-shadow: 0 0 0 1px rgba(127,127,127,.5);
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