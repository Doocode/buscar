<script>
    // Imports
    import { Breadcrumb, BreadcrumbItem, Breakpoint, Toggle, Checkbox,
    Grid, Row, Column }
        from 'carbon-components-svelte'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { fade, slide }
        from 'svelte/transition'
    import { displayTileName, displayTileNameMask, limitLabelTextOverflow,
        renderSearchEnginesAsLink, renderSearchProfilesAsLink }
        from '../../Stores/bookmarks'



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")
    const TITLE_PAGE = "Accès rapide"



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Préférences", url: "/#/preferences"},
        {title: TITLE_PAGE, url: "/#/preferences/speed-dial", current: true},
    ]
    let size



    // Fonctions
</script>

<Breakpoint bind:size />

<main id="prefs-speeddial" class="prefs-section"
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



    <h3 class="format">Affichage</h3>
    <Toggle bind:toggled={$displayTileName}
        labelText="Afficher le nom des marque-pages"
        labelA="Non" labelB="Oui" />
    {#if $displayTileName}
        <div transition:slide|local>
            <Grid style="max-width: 510px; margin: 0; padding: 0; margin-top: 2rem;">
                <Row>
                    <Column>
                        <Toggle bind:toggled={$displayTileNameMask}
                            labelText="Afficher un masque sur les libellés"
                            labelA="Non" labelB="Oui" />
                    </Column>
                    <Column>
                        <Toggle bind:toggled={$limitLabelTextOverflow}
                            labelText="Limiter le débordement du texte dans les libellés"
                            labelA="Non" labelB="Oui" />
                    </Column>
                </Row>
            </Grid>
        </div>
    {/if}

    <h3 class="format">Options</h3>
    <Checkbox bind:checked={$renderSearchEnginesAsLink}
        labelText="Afficher les moteurs de recherche sous la forme de lien" />
    <Checkbox bind:checked={$renderSearchProfilesAsLink}
        labelText="Afficher les profils de recherche sous la forme de lien" />
    <p class="format">L'affichage sous la forme de liens permet d'utiliser la fonctionnalité "Ouvrir dans un nouvel onglet" de votre navigateur.</p>
</main>

<style lang="scss">
    @import './Preferences.scss';

    /*#prefs-speeddial {
    }*/
</style>