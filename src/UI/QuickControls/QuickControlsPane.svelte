<script>
    // Imports
    import { allowHeaderBackButton, compactSearchBox, enableSearchEngineAlias,
        enableSelectSearchEnginesLimit, selectSearchEnginesLimitValue,
        contrastMode, listQuickControls, customAmbiance, ambiances }
        from "../../Stores/settings"
    import { Link }
        from "carbon-components-svelte"
    import QuickTile
        from "./QuickTile.svelte"
    import QuickToggle
        from "./QuickToggle.svelte"
    import { createEventDispatcher }
        from 'svelte'
    import Icofont
        from "../Icofont.svelte"
    import ContrastPage
        from "./Pages/ContrastPage.svelte"
    import ControlsPage
        from "./ControlsPage.svelte"
    import OutClick
        from 'svelte-outclick'
	import { slide }
        from 'svelte/transition'



    // Propriétés
    const ROUTES = {
        home: "",
        ambiances: "ambiances",
    }
    const dispatch = createEventDispatcher()
    let currentPage = ROUTES.home



    // Réactivité
    $: currentContrastPref = parseCurrentContrastMode($contrastMode)



    // Fonctions
    const getTiles = () => {
        // Trier et filtrer les tuiles
        return $listQuickControls
            .sort((a, b) => a.position - b.position) // Trié les tuiles selon leurs positions
            .filter(a => a.visible) // Filtrer les tuiles visibles
    }
    const close = () => {
        dispatch('close')
    }
    const goHome = () => {
        currentPage = ROUTES.home
    }
    const displayAmbiances = () => {
        currentPage = ROUTES.ambiances
    }
    const parseCurrentContrastMode = () => {
        switch($contrastMode) {
            case "browser":
                return {icon: "screen", name: "Système"}
            case "planning":
                return {icon: "clock", name: "Planifié"}
            case "custom":
                return $ambiances.filter(a => a.value == $customAmbiance)[0]
        }
    }
</script>

<main transition:slide>
    <OutClick on:outclick={close} >
        {#if currentPage == ROUTES.home}
            <div class="controls-pane" transition:slide|local>
                <ControlsPage
                    title="Réglages rapides" icon="settings"
                    backButtonVisible="false"
                    on:close={close}
                >
                    <div class="tiles">
                        {#each getTiles() as tile }
                            {#if tile.value == 'ambianceSelector'}
                                <QuickTile on:click={displayAmbiances}
                                    name="Ambiances" icon="palette">
                                    <div class="value">
                                        <Icofont icon={currentContrastPref.icon} size="14" />
                                        <p class="label">{currentContrastPref.name}</p>
                                    </div>
                                </QuickTile>
                            {:else if tile.value == 'compactSearchBar'}
                                <QuickToggle
                                    name="Barre de recherche" icon="search"
                                    positiveText="Compact"
                                    negativeText="Large"
                                    bind:checked={$compactSearchBox} />
                            {:else if tile.value == 'searchEnginesAlias'}
                                <QuickToggle
                                    name="Alias de recherche" icon="compass"
                                    positiveText="Activé"
                                    negativeText="Désactivé"
                                    bind:checked={$enableSearchEngineAlias} />
                            {:else if tile.value == 'limitSelectSearchEngines'}
                                <QuickToggle
                                    name="Sélection des moteurs de recherche" icon="circles"
                                    positiveText="Limité à {$selectSearchEnginesLimitValue}"
                                    negativeText="Sans limite"
                                    bind:checked={$enableSelectSearchEnginesLimit} />
                            {:else if tile.value == 'backButton'}
                                <QuickToggle
                                    name="Bouton retour" icon="arrow_left"
                                    positiveText="Visible"
                                    negativeText="Masqué"
                                    bind:checked={$allowHeaderBackButton} />
                            {:else}
                                <!--p>Tuile inconnue : {tile.value}</p-->
                            {/if}
                        {/each}
                    </div>

                    <div class="bottom-links">
                        <Link href="/#/preferences/quick-settings">
                            <Icofont icon="settings" size="16" />
                            <span class="label">Modifier ce panneau</span>
                        </Link>
                        <Link href="/#/preferences" title="Préférences" style="padding: var(--cds-spacing-04); margin: calc(-1 * var(--cds-spacing-04));">
                            <Icofont icon="config" size="16" />
                        </Link>
                    </div>
                </ControlsPage>
            </div>
        {:else}
            <div class="controls-pages" transition:slide|local>
                {#if currentPage == ROUTES.ambiances}
                    <ContrastPage on:close={close} on:backRequest={goHome} />
                {/if}
            </div>
        {/if}
    </OutClick>
</main>

<style lang="scss">
    :root {
        --quick-access-bg: var(--cds-ui-03);
    }
    // Vue général (les tuiles) et pages
    .controls-pane,
    .controls-pages {
        border: 1px solid var(--cds-ui-04);
        background: var(--quick-access-bg);
        backdrop-filter: blur(40px);
        width: 330px;
        border-radius: 20px;
        overflow: hidden;
    }

    // Panneau avec les tuiles
    .controls-pane {
        .tiles {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--cds-spacing-03);
            padding: var(--cds-spacing-05);

            .value {
                display: inline-flex;
                align-items: center;
                gap: var(--cds-spacing-02);

                p {font-size: 100%;}
            }
        }

        // Liens
        .bottom-links {
            padding: var(--cds-spacing-05);
            display: flex;
            justify-content: space-between;
        }
        :global(.bx--link) {
            display: inline-flex;
            gap: var(--cds-spacing-03);
            align-items: center;
        }
    }

    @supports (backdrop-filter: blur(40px)) {
        :root[theme=white]  {--quick-access-bg: #e0e0e0aa;}
        :root[theme=g10]    {--quick-access-bg: #e0e0e0aa;}
        :root[theme=g80]    {--quick-access-bg: #6f6f6faa;}
        :root[theme=g90]    {--quick-access-bg: #525252aa;}
        :root[theme=g100]   {--quick-access-bg: #393939aa;}
    }
</style>