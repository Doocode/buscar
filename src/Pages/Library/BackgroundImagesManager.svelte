<script>
    // Imports
    import { Modal, DataTable, Button, Tooltip, Search,
        OverflowMenu, OverflowMenuItem, InlineNotification,
        Breakpoint, ContentSwitcher, Switch }
        from 'carbon-components-svelte'
    import { listBgImgs } 
        from '../../Stores/bgImages'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'
    import BackgroundImageEditor
        from './BackgroundImage/Editor.svelte'
    import BackgroundImagePreview
        from './BackgroundImage/Preview.svelte'
    import BgImagesManager
        from '../../Classes/BgImagesManager'
    import { onDestroy }
        from 'svelte'



    // MAJ du header
    pageName.set("Fonds d'écran")
    pageIcon.set("image")



    // Propriétés
    const MANAGER = new BgImagesManager
    let size // La largeur de l'écran
    let tableColumns = [] // Les colonnes de la vue DataTable
    let idSelectedItems = [] // Les items sélectionnés (id)
    let listMessages = [] // Liste des notifications
    let contentIndex = 0 // Index pour le ContentSwitcher (Editeur/Aperçu)
    let zebra = false
    let extendedView = true
    let searchEnabled = true
    let searchValue = ""
    let bg_id = -1
    let bg_name = ""
    let bg_url = ""
    let bg_type = []



    // Flags
    let modalAddItem = false
    let modalPreviewItem = false
    let modalEditItem = false
    let modalDeleteItem = false
    let modalErrorValues = false



    // Réactivité
    $: doResponsive(size, idSelectedItems)
    $: tableData = formatTableData($listBgImgs, searchValue, searchEnabled)
    $: contentSwitcherDisabled = isFormValid(bg_name, bg_url) != true



    // Lifecycle
    onDestroy(() => MANAGER.destroy())



    // Méthodes
    const formatTableData = () => {
        // Formatage des données
        let data = $listBgImgs.map(item => {
            return {
                id: item.id,
                name: item.name,
                url: item.url,
                type: item.type,
            }
        })

        // Filtrer la recherche
        const searchBarVisible = searchEnabled || ['md', 'lg', 'xlg', 'max'].indexOf(size) > -1
        if (searchValue.length > 0 && searchBarVisible) {
            // Vérifie si un string contient les termes recherché
            const containSearch = str => str.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            // TODO: Appliquer le filtre sur les types

            // Filtres
            data = data.filter(item => {
                const searchName = containSearch(item.name)
                const searchUrl = containSearch(item.url)
                return searchName || searchUrl
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
        bg_id = -1
        bg_name = ""
        bg_url = ""
        bg_type = []
        contentIndex = 0
    }
    const isFormValid = () => {
        // Retourner false si une de ces condition est valide
        if (bg_name.length < 1)
            return false
        if (bg_url.length < 1)
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

        // Ajouter l'item dans le Store
        listBgImgs.add(bg_name, bg_url, bg_type)

        // Fermer la popup et vider le formulaire
        closeModals()
    }
    const displayDetails = id => {
        // Rechercher le fond d'écran
        const item = MANAGER.findById(id)

        // Avorter si l'item n'existe pas
        if (item == null)
            return alert("Le fond d'écran n'existe pas")

        // Récupération et attribution des champs
        bg_id = item.id
        bg_name = item.name
        bg_url = item.url
        bg_type = item.type

        // Afficher la popup de détails
        modalPreviewItem = true
    }
    const editItem = id => {
        // Retrouver le fond d'écran
        const item = MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("Le fond d'écran n'existe pas")

        // Remplir le formulaire
        bg_id = item.id
        bg_name = item.name
        bg_url = item.url
        bg_type = item.type

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
        MANAGER.updateById(bg_id, bg_name, bg_url, bg_type)

        // Fermer les popups
        closeModals()
    }
    const duplicateItem = id => {
        // Retrouver le fond d'écran
        const item = MANAGER.findById(id)

        // Si l'item n'a pas été retrouvé
        if (item == null)
            return alert("Le fond d'écran n'existe pas")

        // Remplir le formulaire
        bg_id = -1
        bg_name = item.name + " (2)"
        bg_url = item.url
        bg_type = item.type

        // Ouvrir la popup
        modalAddItem = true
    }
    const confirmDeleteItem = id => {
        if (typeof(id) !== "undefined" && !isNaN(id)) {
            // Retrouver le fond d'écran
            const item = MANAGER.findById(id)

            // Si l'item n'a pas été retrouvé
            if (item == null)
                return alert("Le fond d'écran n'existe pas")

            // Enregistrer l'id de l'item
            bg_id = id
        }

        // Ouvrir la popup
        modalDeleteItem = true
    }
    const deleteSelectedItems = () => {
        // Suppression des élements sélectionnés
        if (bg_id > 0)
            MANAGER.deleteById(bg_id)
        else {
            idSelectedItems.forEach(id => MANAGER.deleteById(id))

            // Vider la liste des items sélectionnés (car les items n'existent plus)
            idSelectedItems = []
        }

        // Ferme tous les popups
        closeModals()
    }
    const doResponsive = () => {
        // Liste des colonnes visibles
        tableColumns = [
            { key: "name", value: "Fond d'écran" },
            { key: "overflow", empty: true }
        ]
    }
    const setAsBackground = id => {
        MANAGER.setAsBackground(id)
        /*listMessages.push({
            kind: 'success', title: 'Mise à jour réussie',
            subtitle: "Le fond d'écran à été mis à jour"
        })
        listMessages = listMessages*/
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
        $listBgImgs.forEach(item => listIds.push(parseInt(item.id)))
        idSelectedItems = listIds
    }
    const invertSelection = () => {
        let listIds = []
        $listBgImgs.forEach(item => {
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
                title="Ajouter un fond d'écran"
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

                {#if searchValue.length > 0 && $listBgImgs.length != tableData.length}
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
                        <img src="{row.url}" alt="Fond '{row.name}'"/>
                        <span class="text">{row.name}</span>
                    </div>
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
                            title="Aperçu de '{row.name}'"
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
                                    <Icofont icon="eye" size="16" />
                                    <span class="text">Aperçu</span>
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
                        <OverflowMenuItem on:click={() => setAsBackground(row.id)} >
                            <div class="label">
                                <Icofont icon="check" size="16" />
                                <span class="text">Définir comme fond d'écran</span>
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
            modalHeading="Créer un fond d'écran"
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
                <BackgroundImageEditor
                    bind:id={bg_id} bind:name={bg_name}
                    bind:url={bg_url} bind:types={bg_type}
                />
            {:else}
                <BackgroundImagePreview
                    bind:id={bg_id} bind:name={bg_name}
                    bind:url={bg_url} bind:types={bg_type}
                />
            {/if}
        </Modal>

        <Modal
            bind:open={modalPreviewItem}
            modalHeading="Aperçu du fond d'écran"
            primaryButtonText="Retour"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={closeModals}
        >
            {#if modalPreviewItem}
                <BackgroundImagePreview
                    bind:id={bg_id} bind:name={bg_name}
                    bind:url={bg_url} bind:types={bg_type}
                />
            {/if}
        </Modal>

        <Modal
            bind:open={modalEditItem}
            bind:primaryButtonDisabled={contentSwitcherDisabled}
            modalHeading="Modifier le fond d'écran"
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
                <BackgroundImageEditor
                    bind:id={bg_id} bind:name={bg_name}
                    bind:url={bg_url} bind:types={bg_type}
                />
            {:else}
                <BackgroundImagePreview
                    bind:id={bg_id} bind:name={bg_name}
                    bind:url={bg_url} bind:types={bg_type}
                />
            {/if}
        </Modal>

        <Modal
            bind:open={modalDeleteItem} danger
            modalHeading="Supprimer {(bg_id > 0 ? [bg_id] : idSelectedItems).length == 1 ? "un fond" : "des fonds" } d'écran"
            primaryButtonText="Supprimer"
            secondaryButtonText="Annuler"
            on:click:button--secondary={closeModals}
            on:close={closeModals}
            on:submit={deleteSelectedItems}
        >
            {#if idSelectedItems.length == 1 || bg_id > 0}
                <p>Voulez-vous vraiment supprimer le fond d'écran suivant ?</p>
            {:else if idSelectedItems.length > 1}
                <p>Voulez-vous vraiment supprimer les fonds d'écran suivants ?</p>
            {/if}
            <br/>

            <div class="list-bg">
                {#each (bg_id > 0 ? [bg_id] : idSelectedItems) as idItem }
                    <div class="bg-item">
                        <img src="{MANAGER.findById(idItem).url}"
                            alt="Fond '{MANAGER.findById(idItem).name}'"/>

                        <div class="text">
                            <p class="name">{MANAGER.findById(idItem).name}</p>
                            <p class="url">{MANAGER.findById(idItem).url}</p>
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
        // - Nom
        .name {

            display: flex;
            align-items: center;
            gap: 10px;

            img {
                max-width: 150px;
                max-height: 150px;
                border-radius: 8px;
                box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            }
        }
        // - Nom
        .name {
            cursor: pointer;
            padding: 10px 0;
        }
        // URL
        .url {
            font-size: 100%;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        // Popups
        // - Liste des items sélectionnés (popup de suppression)
        .list-bg {
            display: flex;
            flex-flow: column;
            padding: 0 2rem;

            .bg-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: .5rem 0;
                gap: 1rem;

                img {
                max-width: 150px;
                max-height: 150px;
                    border-radius: 8px;
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