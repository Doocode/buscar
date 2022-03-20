<script>
    // Imports
    import { compactSearchBox, openSearchInCurrentPage } 
        from '../../Stores/settings'
    import { Breadcrumb, BreadcrumbItem, Toggle, Link, DataTable, Modal,
        Grid, Row, Column, TextInput, OverflowMenu, OverflowMenuItem, Breakpoint }
        from "carbon-components-svelte"
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")
    const TITLE_PAGE = "Recherche"



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Préférences", url: "/#/preferences"},
        {title: TITLE_PAGE, url: "/#/preferences/search", current: true},
    ]
    let size // Taille de l'écran
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



    <h3 class="format">Général</h3>
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
</main>

<style lang="scss">
    @import './Preferences.scss';

    #prefs-search {
        // Liens "Voir aussi"
        :global(.bx--link) {
            display: inline-flex;
            gap: var(--cds-spacing-03);
            align-items: center;
        }
    }
</style>