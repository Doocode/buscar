<script>
    // Imports
    import { contrastMode, ambiances, customAmbiance,
        defaultLightMode, defaultDarkMode }
        from '../../../Stores/settings'
    import ControlsPage
        from '../ControlsPage.svelte'
    import { TileGroup, RadioTile, RadioButtonGroup, RadioButton, Link }
        from 'carbon-components-svelte'
    import Icofont
        from '../../Icofont.svelte'
	import { slide }
        from 'svelte/transition'



    // Réactivité
    $: publicAmbiances = $ambiances.filter(a => a.public)



    // Fonctions
    const onSelectCustomAmbiance = e => customAmbiance.set(e.detail)
    const onSelectBrowserAmbiance = (isDarkMode, e) => {
        if (isDarkMode == true)
            defaultDarkMode.set(e.detail)
        else if (isDarkMode == false)
            defaultLightMode.set(e.detail)
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
            <!-- Le mode de contraste actuel -->
            <RadioButtonGroup
                orientation="vertical"
                legendText="Mode de contraste de l'interface"
                bind:selected={$contrastMode}
            >
                <RadioButton labelText="Système" value="browser" />
                <RadioButton labelText="Planifié" value="planning" />
                <RadioButton labelText="Personnalisé" value="custom" />
            </RadioButtonGroup>
            <br/><br/>

            <!-- Les réglages du mode de contraste -->
            {#if $contrastMode == "browser"}
                <div transition:slide|local>
                    <TileGroup
                        legend="Ambiance claire"
                        on:select={e => onSelectBrowserAmbiance(false, e)}
                    >
                        <div class="tiles">
                            {#each publicAmbiances.filter(a => !a.dark) as item}
                                <RadioTile
                                    value={ item.value }
                                    checked={ item.value == $defaultLightMode }
                                >
                                    <div class="tile-content">
                                        <Icofont icon={ item.icon } size="24" />
                                        <p class="label">{ item.name }</p>
                                    </div>
                                </RadioTile>
                            {/each}
                        </div>
                    </TileGroup>
    
                    <br/>
                    <TileGroup
                        legend="Ambiance sombre"
                        on:select={e => onSelectBrowserAmbiance(true, e)}
                    >
                        <div class="tiles">
                            {#each publicAmbiances.filter(a => a.dark) as item}
                                <RadioTile
                                    value={ item.value }
                                    checked={ item.value == $defaultDarkMode }
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
            {:else if $contrastMode == "custom"}
                <div transition:slide|local>
                    <TileGroup
                        legend="Liste des ambiances"
                        on:select={onSelectCustomAmbiance}
                    >
                        <div class="tiles">
                            {#each publicAmbiances as item}
                                <RadioTile
                                    value={ item.value }
                                    checked={ item.value == $customAmbiance }
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
            {:else if $contrastMode == "planning"}
                <div transition:slide|local>
                    <!--p>Progress ambiances</p>
                    <p>Ambiance actuel</p>
                    <br/><br/-->
    
                    <Link href="/#/preferences/interface">
                        <Icofont icon="settings" size="16" />
                        <span class="label">Planifier les ambiances</span>
                    </Link>
                </div>
            {/if}
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

        // Liens
        :global(.bx--link) {
            display: inline-flex;
            gap: var(--cds-spacing-03);
            align-items: center;
        }
    }
</style>