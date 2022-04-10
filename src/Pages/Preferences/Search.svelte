<script>
    // Imports
    import { compactSearchBox, enableSearchEngineAlias, openSearchInCurrentPage,
        aliasAddSearchEngine, aliasRemoveSearchEngine, aliasReplaceSearchEngine,
        enableAliasAddSearchEngine, enableAliasRemoveSearchEngine,
        enableAliasReplaceSearchEngine, enableSelectSearchEnginesLimit,
        selectSearchEnginesLimitValue, actionWhenOpeningSearchPage,
        startupSearchProfileId, startupSearchEnginesIds } 
        from '../../Stores/settings'
    import { listSearchProfiles }
        from '../../Stores/search'
    import { Breadcrumb, BreadcrumbItem, Toggle, Link, DataTable, Modal, Checkbox,
        Grid, Row, Column, TextInput, OverflowMenu, OverflowMenuItem, Breakpoint,
        NumberInput, RadioButtonGroup, RadioButton, ClickableTile }
        from "carbon-components-svelte"
    import ModalSearchEnginesSelector
        from '../../Modals/ModalSearchEnginesSelector.svelte'
    import ModalSearchProfileSelector
        from '../../Modals/ModalSearchProfileSelector.svelte'
    import SearchEnginesBubbles
        from '../../UI/SearchEnginesBubbles.svelte'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import SearchEnginesManager
        from '../../Classes/SearchEnginesManager'
    import { onDestroy }
        from 'svelte'



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")
    const TITLE_PAGE = "Recherche"



    // Réactivité
    $: table_alias_rows = generateAliasRows($aliasAddSearchEngine, $aliasRemoveSearchEngine,
        $aliasReplaceSearchEngine, $enableAliasAddSearchEngine, $enableAliasRemoveSearchEngine,
        $enableAliasReplaceSearchEngine)
    $: isAliasValid = checkAlias(currentAliasValue, currentAliasId)
    $: tableAliasHead = filterTableAliasHead(size)
    $: selectedStartupSearchProfile = findSearchProfile($startupSearchProfileId)
    $: selectedStartupSearchEngines = SE_MANAGER.findByListIds($startupSearchEnginesIds)



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Préférences", url: "/#/preferences"},
        {title: TITLE_PAGE, url: "/#/preferences/search", current: true},
    ]
    const TABLE_ALIAS_HEAD = [
        { key: "prefix", value: "Préfixe" },
        { key: "description", value: "Action associée au préfixe" },
        { key: "enabled", value: "Etat" },
        { key: "overflow", empty: true },
    ]
    const FORBIDDEN_CHARACTERS = [' '] // Liste des caractères spéciaux interdits pour les préfixes (alias)
    const RADIO_STARTUP_ACTIONS = [
        {value: "searchProfile", text: "Sélectionner un profil de recherche spécifique"},
        {value: "searchEngines", text: "Sélectionner des moteurs de recherche spéciques"},
        {value: "nothing", text: "Ne rien faire"},
    ]
    const SE_MANAGER = new SearchEnginesManager()
    let modalSearchProfiles = false // Popup pour choisir un profil de recherche
    let modalSearchEngines = false // Popup pour choisir des moteurs de recherche
    let modalAliasEditor = false // Popup pour modifier le prefixe d'un alias
    let currentAliasId = -1
    let currentAliasText = ""
    let currentAliasValue = ""
    let invalidAliasMessage = "" // Message d'erreur pour corriger le prefixe des alias
    let size // Taille de l'écran



    // Lifecycle
    onDestroy(() => SE_MANAGER.destroy)



    // Méthodes
    const generateAliasRows = () => {
        return [
            {id: 0, prefix: $aliasAddSearchEngine, description: "Sélectionner un moteur de recherche", enabled: $enableAliasAddSearchEngine},
            {id: 1, prefix: $aliasRemoveSearchEngine, description: "Retirer un moteur de recherche de la sélection", enabled: $enableAliasRemoveSearchEngine},
            {id: 2, prefix: $aliasReplaceSearchEngine, description: "Remplacer les moteurs de recherche sélectionnés", enabled: $enableAliasReplaceSearchEngine},
        ]
    }
    const checkAlias = () => {
        /* Conditions à vérifier
            - Est-ce que le préfixe est déjà utilisé ailleurs
            - Ne pas autoriser à mettre aucun charactère, car il est impossible d'éxecuter un alias avec un préfixe vide
            - Ne pas autoriser aussi à utiliser plusieurs caractères car le regex utilisé dans 'AliasChecker' a du mal à échapper les caractères spéciaux
            - Exclure certains caractères spéciaux (espace, etc)
        */

        // 1. Vérifier si le préfixe est déjà utilisé ailleurs
        let alreadyUsed = false
        for (let ii=0; ii<table_alias_rows.length; ii++) {
            let isSameAlias = table_alias_rows[ii].id == currentAliasId
            let isSamePrefix = table_alias_rows[ii].prefix == currentAliasValue
            if (!isSameAlias && isSamePrefix) {
                alreadyUsed = true
                invalidAliasMessage = "Ce préfixe est déjà utilisé"
                break
            }
        }

        // 2. Vérifier s'il y a suffisament de caractères
        let enoughCharacters = currentAliasValue.length == 1
        if (!enoughCharacters)
            invalidAliasMessage = "Vous devez saisir un seul caractère"

        // 3. Exclure certains caractères spéciaux
        let containsForbiddenCharacters = FORBIDDEN_CHARACTERS.indexOf(currentAliasValue) > -1
        if (containsForbiddenCharacters)
            invalidAliasMessage = "Vous ne pouvez pas définir ce caractère comme préfixe"

        // Retourner les conditions
        return enoughCharacters && !alreadyUsed && !containsForbiddenCharacters
    }
    const openAliasEditor = (id) => { // id depuis generateAliasRows()
        // Ne pas ouvrir la popup si l'id est invalide
        if (id <= -1 && ii >= table_alias_rows.length)
            return

        // Récupérer les valeurs
        currentAliasId = id
        currentAliasText = table_alias_rows[id].description
        currentAliasValue = table_alias_rows[id].prefix
        modalAliasEditor = true
    }
    const updateAlias = () => {
        if (checkAlias()) {
            // Mise à jour du préfixe
            switch (currentAliasId) {
                case 0: aliasAddSearchEngine.set(currentAliasValue); break
                case 1: aliasRemoveSearchEngine.set(currentAliasValue); break
                case 2: aliasReplaceSearchEngine.set(currentAliasValue); break
            }

            // Fermer la popup
            modalAliasEditor = false
        }
    }
    const toggleAliasPrefix = (id) => {
        // Basculer les états des préfixes
        switch (id) {
            case 0: enableAliasAddSearchEngine.set(!$enableAliasAddSearchEngine); break
            case 1: enableAliasRemoveSearchEngine.set(!$enableAliasRemoveSearchEngine); break
            case 2: enableAliasReplaceSearchEngine.set(!$enableAliasReplaceSearchEngine); break
        }
    }
    const filterTableAliasHead = () => {
        return TABLE_ALIAS_HEAD.filter((column) => {
            if (column.key == "enabled" && size == "sm")
                return false
            return true
        })
    }
    const findSearchProfile = () => {
        // Rechercher le profil de recherche correspondant
        const results = $listSearchProfiles
            .filter(item => item.id == $startupSearchProfileId)

        // Rechercher les moteurs de recherche
        results[0].searchEngines = SE_MANAGER.findByListIds(results[0].searchEnginesIds)

        // Retourner le 1er item (= l'unique resultat)
        return results[0]
    }
</script>

<Breakpoint bind:size />

<main id="prefs-search" class="prefs-section">
    <h2>{TITLE_PAGE}</h2>
    {#if BREADCRUMBS.length > 0}
        <Breadcrumb noTrailingSlash>
            {#each BREADCRUMBS as page}
                <BreadcrumbItem
                    href={ page.url }
                    isCurrentPage={ page.current }>
                    { page.title }
                </BreadcrumbItem>
            {/each}
        </Breadcrumb>
    {/if}



    <h3 class="format">Au démarrage</h3>
    <RadioButtonGroup orientation="vertical"
        bind:selected={$actionWhenOpeningSearchPage}
        legendText="Lors de l'affichage de la page de recherche"
    >
        {#each RADIO_STARTUP_ACTIONS as radioItem}
            <RadioButton labelText={radioItem.text} value={radioItem.value} />
        {/each}
    </RadioButtonGroup>

    <br/><br/>
    {#if $actionWhenOpeningSearchPage == "searchProfile"}
        <div><legend class="bx--label">Le profil de recherche par défaut</legend></div>
        <ClickableTile
            class="btnStartup" id="btnSearchProfile"
            on:click={(e) => (modalSearchProfiles = true)}
            title="Définir le profil de recherche par défaut"
        >
            <div class="data">
                <div class="ident">
                    <Icofont icon="{selectedStartupSearchProfile.icon}" size="18" />
                    <p class="name">{selectedStartupSearchProfile.name}</p>
                </div>
                {#if selectedStartupSearchProfile.searchEngines.length > 0}
                    <SearchEnginesBubbles bubbleSize="30px"
                        searchEngines={selectedStartupSearchProfile.searchEngines} />
                {:else}
                    <p class="placeholder">(Aucun moteur de recherche)</p>
                {/if}
            </div>
            <div class="menu">
                <Icofont icon="settings" size="18" />
            </div>
        </ClickableTile>
    {:else if $actionWhenOpeningSearchPage == "searchEngines"}
        <div><legend class="bx--label">Les moteurs de recherche par défaut</legend></div>
        <ClickableTile
            class="btnStartup" id="btnSearchEngine"
            on:click={e => modalSearchEngines = true}
            title="Définir les moteurs de recherche par défaut"
        >
            <div class="data">
                <div class="ident">
                    <Icofont icon="search" size="18" />
                    <p class="name">{selectedStartupSearchEngines.length} item(s)</p>
                </div>
                {#if selectedStartupSearchEngines.length > 0}
                    <SearchEnginesBubbles bubbleSize="30px"
                        searchEngines={selectedStartupSearchEngines} />
                {:else}
                    <p class="placeholder">(Aucun moteur de recherche)</p>
                {/if}
            </div>
            <div class="menu">
                <Icofont icon="settings" size="18" />
            </div>
        </ClickableTile>
    {/if}



    <h3 class="format">Alias</h3>
    <Grid style="max-width: 510px; margin: 0; padding: 0;">
        <Row>
            <Column>
                <Toggle labelText="Alias de moteur de recherche"
                    bind:toggled={$enableSearchEngineAlias}
                    labelA="Désactivé" labelB="Activé" />
            </Column>
        </Row>
    </Grid>

    {#if $enableSearchEngineAlias}
        <br/><br/>
        <DataTable headers={tableAliasHead} rows={table_alias_rows} >
            <svelte:fragment slot="cell" let:cell let:row >
                {#if cell.key === "prefix"}
                    <div class="cell-prefix">
                        {cell.value}
                    </div>
                {:else if cell.key === "enabled"}
                    <div class="cell-status"
                        class:positive={cell.value}
                        class:negative={!cell.value}
                    >
                        {#if cell.value}
                            <Icofont size="16" icon="check" />
                            <span>Activé</span>
                        {:else}
                            <Icofont size="16" icon="disable" />
                            <span>Désactivé</span>
                        {/if}
                    </div>
                {:else if cell.key === "overflow"}
                    <OverflowMenu flipped style="width: auto;">
                        <div slot="menu" class="menu-button">
                            <Icofont icon="settings" size="16" />
                            <span class="label">Options</span>
                        </div>
                        <OverflowMenuItem text="Modifier" on:click={() => {openAliasEditor(row.id)}} />
                        {#if row.enabled}
                            <OverflowMenuItem danger text="Désactiver" on:click={() => {toggleAliasPrefix(row.id)}} />
                        {:else}
                            <OverflowMenuItem text="Activer" on:click={() => {toggleAliasPrefix(row.id)}} />
                        {/if}
                    </OverflowMenu>
                {:else}
                    {cell.value}
                {/if}
            </svelte:fragment>
        </DataTable>
    {/if}



    <h3 class="format">Options</h3>
    <Grid style="max-width: 510px; margin: 0; padding: 0;">
        <Row>
            <Column>
                <Toggle labelText="Lancer la recherche dans la page actuelle"
                    bind:toggled={$openSearchInCurrentPage}
                    labelA="Non" labelB="Oui" />
            </Column>
            <Column>
                <Toggle labelText="Barre de recherche compacte"
                    bind:toggled={$compactSearchBox}
                    labelA="Non" labelB="Oui" />
            </Column>
        </Row>
    </Grid>

    <br/><br/>
    <Checkbox
        bind:checked={$enableSelectSearchEnginesLimit}
        labelText="Limiter la sélection de plusieurs moteurs de recherche en simultané" />
    {#if $enableSelectSearchEnginesLimit}
        <br/>
        <div class="indent" style="max-width: 420px;">
            <NumberInput
                min={1} max={15} allowEmpty="false"
                bind:value={$selectSearchEnginesLimitValue}
                invalidText="Le nombre attendu doit être entre 1 et 15."
                label="Limite maximum de sélection de moteurs de recherche"
            />
        </div>
    {/if}



    <br/><br/><br/>
    <h5>Voir aussi</h5>
    <br/>
    <Link href="/#/library/search-engines">
        <Icofont icon="arrow_right" />
        <span class="label">Gérer les moteurs de recherche</span>
    </Link>
    <br/><br/>
    <Link href="/#/library/search-profiles">
        <Icofont icon="arrow_right" />
        <span class="label">Gérer les profils de recherche</span>
    </Link>

    <div class="modals">
        <Modal
            size="xs"
            bind:open={modalAliasEditor}
            modalHeading="Modifier un préfixe"
            primaryButtonText="Valider"
            secondaryButtonText="Annuler"
            primaryButtonDisabled={!isAliasValid}
            on:click:button--secondary={() => modalAliasEditor = false}
            on:open
            on:close
            on:submit={updateAlias}
        >
            <TextInput
                inline
                labelText="Préfixe"
                invalid={!isAliasValid}
                invalidText={invalidAliasMessage}
                bind:value={currentAliasValue} />
            <p class="format"><strong>Action associée au préfixe <div class="cell-prefix">{currentAliasValue}</div></strong> : <br/> {currentAliasText}</p>

            <p class="format"><strong>Conseil</strong> : <br/> Utilisez un caractère spécial comme préfixe pour les alias</p>
        </Modal>

        <ModalSearchEnginesSelector
            bind:open={modalSearchEngines}
            bind:idSelectedSearchEngines={$startupSearchEnginesIds}
            on:submit={() => modalSearchEngines = false} />

        <ModalSearchProfileSelector
            bind:open={modalSearchProfiles}
            bind:selectedID={$startupSearchProfileId}
            on:submit={() => modalSearchProfiles = false} />
    </div>
</main>

<style lang="scss">
    @import './Preferences.scss';

    #prefs-search {
        // Vue "Au démarrage"
        :global(.bx--tile--clickable.btnStartup) {
            border-radius: 10px;
            align-items: flex-end;
        }
        .btnStartup {
            // Données visibles
            .data {
                display: inline-flex;
                flex-flow: column;
                align-items: flex-start;
                gap: var(--cds-spacing-03);
                min-width: 200px;
            }


            .ident {
                display: inline-flex;
                align-items: center;
                gap: var(--cds-spacing-03);

                .name {font-size: 100%;}
            }
            .placeholder {
                color: var(--cds-text-02);
                font-size: 100%;
            }
        }

        // Vue "Préfixe"
        .cell-prefix {
            --size: 30px;
            width: var(--size);
            height: var(--size);
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: 7px;
            background: var(--cds-ui-03);
            border: 1px solid var(--cds-decorative-01);
            font-size: 1.2em;
            font-family: 'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono',
                'Bitstream Vera Sans Mono', Courier, monospace;
        }

        // Vue "Etat" (activé/désactivé)
        .cell-status {
            display: flex;
            align-items: center;
            gap: var(--cds-spacing-03);

            &.positive {color: var(--cds-support-02);}
            &.negative {color: var(--cds-support-01);}
        }

        // Bouton menu "Options"
        .menu-button {
            padding: 1rem .9rem;
            color: var(--cds-text-02);
            display: inline-flex;
            align-items: center;
            gap: var(--cds-spacing-03);
        }

        // Indentation
        .indent {
            --value: var(--cds-spacing-06);
            margin-left: var(--value);
        }

        // Liens "Voir aussi"
        :global(.bx--link) {
            display: inline-flex;
            gap: var(--cds-spacing-03);
            align-items: center;
        }
    }
</style>