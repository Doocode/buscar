<script>
    // Imports
    import { listQuickControls } 
        from '../../Stores/settings'
    import { Breadcrumb, BreadcrumbItem, DataTable, Button, Breakpoint,
        OverflowMenu, OverflowMenuItem, Row }
        from 'carbon-components-svelte'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { fade }
        from 'svelte/transition'



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")
    const TITLE_PAGE = "Réglages rapides"



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Préférences", url: "/#/preferences"},
        {title: TITLE_PAGE, url: "/#/preferences/quick-settings", current: true},
    ]
    const TABLE_HEAD = [
        { key: "setting", value: "Réglage" },
        //{ key: "position", value: "Position" },
        { key: "visible", value: "Etat" },
        { key: "overflow", empty: true },
    ]
    let size



    // Réactivité
    $: sortedList = $listQuickControls.sort((a, b) => {
        if (a.position < b.position)
            return -1
        if (a.position > b.position)
            return 1
        return 0
    })



    // Fonctions
    const toggleTile = value => {
        listQuickControls.toggleVisibility(value)
    }
    const raiseTile = value => {
        // Vérifier s'il n'est pas déjà en haut de la liste
        if (sortedList[0].value == value)
            return

        // Retrouver tuile précédante
        let neighbour = ""
        sortedList.forEach((item, index) => {
            if (item.value == value)
                neighbour = sortedList[index-1].value
        })

        // Monter la tuile
        listQuickControls.switchPosition(value, neighbour)
    }
    const lowerTile = value => {
        // Vérifier s'il n'est pas déjà en bas de la liste
        if (sortedList[sortedList.length-1].value == value)
            return

        // Retrouver tuile suivante
        let neighbour = ""
        sortedList.forEach((item, index) => {
            if (item.value == value)
                neighbour = sortedList[index+1].value
        })

        // Monter la tuile
        listQuickControls.switchPosition(value, neighbour)
    }
</script>

<Breakpoint bind:size />

<main id="prefs-quick_settings" class="prefs-section"
    in:fade={{duration: 200}}>
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



    <h3 class="format">Organisation</h3>
    <DataTable headers={TABLE_HEAD} rows={sortedList}>
        <svelte:fragment slot="cell" let:cell let:row >
            {#if cell.key === "setting"}
                <div class="cell-setting">
                    <Icofont size="16" icon={row.icon} />
                    <span>{row.longName}</span>
                </div>
            {:else if cell.key === "visible"}
                <div class="cell-status"
                    class:positive={cell.value}
                    class:negative={!cell.value}
                >
                    {#if cell.value == true}
                        <Icofont size="16" icon="check" />
                        <span>Visible</span>
                    {:else}
                        <Icofont size="16" icon="disable" />
                        <span>Masqué</span>
                    {/if}
                </div>
            {:else if cell.key === "overflow"}
                {#if ["md", "lg", "xlg", "max"].indexOf(size) > -1}
                    {#if row.visible}
                        <Button title="Masquer la tuile {row.longName}" kind="ghost"
                            on:click={() => toggleTile(row.value)}>
                            <Icofont icon="hide" size="18" />
                        </Button>
                    {:else}
                        <Button title="Afficher la tuile {row.longName}" kind="ghost"
                            on:click={() => toggleTile(row.value)}>
                            <Icofont icon="eye" size="18" />
                        </Button>
                    {/if}
                    {#if row.position != sortedList[0].position}
                        <Button title="Monter la tuile {row.longName}" kind="ghost"
                            on:click={() => raiseTile(row.value)}>
                            <Icofont icon="arrow_up" size="18" />
                        </Button>
                    {/if}
                    {#if row.position != sortedList[sortedList.length-1].position}
                        <Button title="Déscendre la tuile {row.longName}" kind="ghost"
                            on:click={() => lowerTile(row.value)}>
                            <Icofont icon="arrow_down" size="18" />
                        </Button>
                    {/if}
                {:else}
                    <OverflowMenu flipped style="width: auto;">
                        <div slot="menu" class="menu-button">
                            <Icofont icon="settings" size="16" />
                            <!--span class="label">Options</span-->
                        </div>
                        {#if row.visible}
                            <OverflowMenuItem danger text="Masquer" on:click={() => toggleTile(row.value)} />
                        {:else}
                            <OverflowMenuItem text="Afficher" on:click={() => toggleTile(row.value)} />
                        {/if}
                        {#if row.position != sortedList[0].position}
                            <OverflowMenuItem text="Monter" on:click={() => raiseTile(row.value)} />
                        {/if}
                        {#if row.position != sortedList[sortedList.length-1].position}
                            <OverflowMenuItem text="Déscendre" on:click={() => lowerTile(row.value)} />
                        {/if}
                    </OverflowMenu>
                {/if}
            {:else}
                {cell.value}
            {/if}
        </svelte:fragment>
    </DataTable>

</main>

<style lang="scss">
    @import './Preferences.scss';

    #prefs-quick_settings {
        

        // Vue "Etat" (activé/désactivé)
        .cell-setting,
        .cell-status {
            display: flex;
            align-items: center;
            gap: var(--cds-spacing-03);

            &.positive {color: var(--cds-support-02);}
            &.negative {color: var(--cds-support-01);}
        }

        // Bouton menu
        .menu-button {
            padding: 1rem .9rem;
            color: var(--cds-text-02);
            display: inline-flex;
            align-items: center;
            gap: var(--cds-spacing-03);
        }
    }
</style>