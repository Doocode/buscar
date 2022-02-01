<script>
    // Imports
    import { Toggle, TileGroup, RadioTile, Link, Grid, Row, Column }
        from "carbon-components-svelte"
    import { contrastMode, ambiances, allowHeaderBackButton, compactSearchBox,
        openSearchInCurrentPage, filterPublicAmbiances } from '../Stores/settings'
    import { pageName, pageIcon } from '../Stores/header'
    import { onDestroy } from 'svelte'
    import Icofont from '../UI/Icofont.svelte'

    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")

    // Attributs internes
    let currentContrastMode // Contraste de l'interface
    let listAmbiances // Liste des ambiances possibles

    // Observations
    const unsub_contrastMode = contrastMode.subscribe(value => {
        currentContrastMode = value
    });
    const unsub_ambiances = ambiances.subscribe(value => {
        listAmbiances = value
    });

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_contrastMode()
        unsub_ambiances()
    });
</script>

<main class="preferences">
    <h2>Affichage</h2>
    <Toggle labelText="Afficher le bouton 'Retour' en haut"
        bind:toggled={$allowHeaderBackButton}
        labelA="Non" labelB="Oui" />
    <br/><br/>
    
    <TileGroup legend="Ambiance de l'interface"
        on:select={(e) => { contrastMode.set(e.detail) }}>
        {#each listAmbiances.filter(filterPublicAmbiances) as ambiance}
            <RadioTile value={ambiance.value} checked={currentContrastMode == ambiance.value} >
                <Icofont icon={ambiance.icon} size="22" />
                <span class="text">{ambiance.name}</span>
            </RadioTile>
        {/each}
    </TileGroup>



    <br /><br /><br /><br />
    <h2>Rercherche</h2>
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

    <h5>Voir aussi</h5>
    <Link href="/#/library">
        <Icofont icon="arrow_right" />
        <span class="label">Gérer les moteurs de recherche</span>
    </Link>
</main>

<style lang="scss">
    main.preferences {
        transition: all .3s;

        h2, h3, h4, h5, h6 {margin-bottom: var(--cds-spacing-04);}

        :global(.bx--link) {
            display: inline-flex;
            gap: .5rem;
            align-items: center;
        }

        // Sélecteur d'ambiance
        :global(.bx--tile-group div) {
            max-width: 1100px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        :global(.bx--tile--selectable .text) {
            display: block;
            margin-top: var(--cds-spacing-03);
        }
    }

    @media (max-width: 672px) {
        main.preferences {margin: var(--cds-spacing-05);}
    }

    @media (min-width: 672px) {
        main.preferences {
            margin: var(--cds-spacing-09) auto;
            max-width: 1100px;
            padding: 0 var(--cds-spacing-05);
            
            // Sélecteur d'ambiance
            :global(.bx--tile-group div) {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
            }
        }
    }

    @media (min-width: 1056px) {
        // Sélecteur d'ambiance
        main.preferences :global(.bx--tile-group div) {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    }
</style>