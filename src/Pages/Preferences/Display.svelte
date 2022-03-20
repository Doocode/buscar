<script>
    // Imports
    import { contrastMode, ambiances, allowHeaderBackButton, compactSearchBox,
        filterPublicAmbiances } 
        from '../../Stores/settings'
    import { Breadcrumb, BreadcrumbItem, Toggle, Grid, Row, Column,
        TileGroup, RadioTile }
        from "carbon-components-svelte";
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")
    const TITLE_PAGE = "Apparence"



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Préférences", url: "/#/preferences"},
        {title: TITLE_PAGE, url: "/#/preferences/interface", current: true},
    ]



    // Méthodes
    const onAmbianceSelected = (e) => {
        contrastMode.set(e.detail)
    }
</script>

<main id="prefs-display" class="prefs-section">
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



    <h3 class="format">Ambiance</h3>
    <TileGroup
        legend="Ambiance de l'interface"
        on:select={onAmbianceSelected} >

        {#each $ambiances.filter(filterPublicAmbiances) as ambiance}
            <RadioTile value={ambiance.value} checked={$contrastMode == ambiance.value} >
                <Icofont icon={ambiance.icon} size="22" />
                <span class="text">{ambiance.name}</span>
            </RadioTile>
        {/each}
    </TileGroup>



    <h3 class="format">Options</h3>
    <Grid style="max-width: 510px; margin: 0; padding: 0;">
        <Row>
            <Column>
                <Toggle labelText="Afficher le bouton 'Retour' en haut"
                    bind:toggled={$allowHeaderBackButton}
                    labelA="Non" labelB="Oui" />
            </Column>
            <Column>
                <Toggle labelText="Barre de recherche compacte"
                    bind:toggled={$compactSearchBox}
                    labelA="Non" labelB="Oui" />
            </Column>
        </Row>
    </Grid>
</main>

<style lang="scss">
    @import './Preferences.scss';

    #prefs-display {
        // Sélecteur d'ambiance
        // - Grille
        :global(.bx--tile-group div) {
            max-width: 1100px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: var(--cds-spacing-03);
        }
        // - Cellule
        :global(.bx--tile) {
            border-radius: 10px;
            min-width: 5rem;
            padding-right: 1rem;
        }
        // - Texte
        :global(.bx--tile--selectable .text) {
            display: block;
            margin-top: var(--cds-spacing-03);
        }
    }

    @media (min-width: 672px) {
        // Sélecteur d'ambiance
        #prefs-display :global(.bx--tile-group div) {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    }

    @media (min-width: 1056px) {
        // Sélecteur d'ambiance
        #prefs-display :global(.bx--tile-group div) {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }
</style>