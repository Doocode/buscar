<script>
    // Imports
    import { contrastMode, ambiances }
        from "../../../Stores/settings"
    import ControlsPage
        from "../ControlsPage.svelte"
    import { TileGroup, RadioTile }
        from "carbon-components-svelte"
    import Icofont
        from "../../Icofont.svelte"



    // Fonctions
    const onSelect = (e) => {
        contrastMode.set(e.detail)
    }
</script>

<main>
    <ControlsPage
        title="Ambiances"
        icon="palette"
        on:backRequest
        on:close
    >
        <div class="page-content">
            <TileGroup
                legend="Liste des ambiances"
                on:select={onSelect}
            >
                <div class="tiles">
                    {#each $ambiances.filter(a => a.public) as item}
                        <RadioTile
                            value={ item.value }
                            checked={ item.value == $contrastMode }
                        >
                            <div class="tile-content">
                                <Icofont icon={ item.icon } size="24" />
                                <p class="label">{ item.name }</p>
                            </div>
                        </RadioTile>
                    {/each}
                </div>
            </TileGroup>
        </div>
    </ControlsPage>
</main>

<style lang="scss">
    .page-content {
        padding: var(--cds-spacing-05);

        // Grille des tuiles
        .tiles {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--cds-spacing-03);
        }

        // Tuiles
        :global(.bx--tile) {
            border-radius: 10px;
            min-width: 5rem;
            padding-right: 1rem;
        }

        // Texte
        .tile-content .label {
            margin: 0;
            margin-top: var(--cds-spacing-03);
            font-size: 100%;
        }
    }
</style>