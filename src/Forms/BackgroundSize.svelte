<script>
    // Exports
    /**
     * Le mot clé pour la position sur l'axe X
     * @type {'cover' | 'contain' | 'custom'}
     */
    export let sizeKeyword = 'cover'

    /**
     * Activer la définition de la hauteur du fond
     * @type {boolean}
     */
    export let heightValueEnabled = false

    /**
     * Largeur du fond
     * @type {number}
     */
    export let widthValue = 100

    /**
     * Hauteur du fond
     * @type {number}
     */
    export let heightValue = 100

    /**
     * Unité de mesure pour la largeur du fond
     * @type {'px' | '%'}
     */
    export let widthUnit = 'px'

    /**
     * Unité de mesure pour la hauteur du fond
     * @type {'px' | '%'}
     */
    export let heightUnit = 'px'



    // Imports
    import { Breakpoint, Checkbox, Select, SelectItem, NumberInput,
        TileGroup, RadioTile }
        from 'carbon-components-svelte'
    import { slide }
        from 'svelte/transition'
    import Icofont
        from '../UI/Icofont.svelte'



    // Propriétés
    let size
    const values = [
        {text: "Couvrir", icon: 'expand', value: 'cover'},
        {text: "Contenir", icon: 'download', value: 'contain'},
        {text: "Taille fixe", icon: 'settings', value: 'custom'},
    ]
</script>

<Breakpoint bind:size />

<main class="form-bgsize">
    <TileGroup
        legend="Taille du fond d'écran"
        style="padding-bottom: 2rem"
        on:select={e => sizeKeyword = e.detail}
        bind:selected={sizeKeyword}
    >
        {#each values as item}
            <RadioTile value={item.value}>
                <div class="label column">
                    <Icofont icon={item.icon} size="18" />
                    <span class="text">{item.text}</span>
                </div>
            </RadioTile>
        {/each}
    </TileGroup>

    {#if sizeKeyword=='custom'}
        <div transition:slide|local>
            <div class="number-unit">
                <NumberInput bind:value={widthValue}
                    label="Largeur de l'image"
                    disabled={sizeKeyword != 'custom'} />

                <Select labelText="Unité de mesure"
                    disabled={sizeKeyword != 'custom'}
                    on:change={e => widthUnit = e.detail}
                    selected={widthUnit}>
                    <SelectItem value="px" text="Pixels (px)" />
                    <SelectItem value="%" text="Pourcentages (%)" />
                </Select>
            </div>
            <br/><br/>



            <Checkbox labelText="Définir la hauteur"
                disabled={sizeKeyword != 'custom'}
                bind:checked={heightValueEnabled} />
            <br/>

            {#if heightValueEnabled}
                <div class="number-unit"
                    transition:slide|local>
                    <NumberInput bind:value={heightValue}
                        label="Hauteur de l'image"
                        disabled={sizeKeyword != 'custom'} />
    
                    <Select labelText="Unité de mesure"
                        disabled={sizeKeyword != 'custom'}
                        on:change={e => heightUnit = e.detail}
                        selected={heightUnit}>
                        <SelectItem value="px" text="Pixels (px)" />
                        <SelectItem value="%" text="Pourcentages (%)" />
                    </Select>
                </div>
            {/if}

            <br/>
        </div>
    {/if}
</main>

<style lang="scss">
    .form-bgsize {
        // Bloc de formulaires
        :global(.bx--fieldset) {
            margin-bottom: 0;
            padding-bottom: 2rem;
        }

        // Label
        div.label {
            display: inline-flex;
            flex-flow: row;
            align-items: center;
            gap: var(--cds-spacing-03);

            &.column {
                flex-flow: column;
                align-items: flex-start;
            }
        }

        // Tuiles
        :global(.bx--tile-group > div) {
            display: grid;
            grid-template-columns: 1fr 1fr /*1fr*/;
            gap: var(--cds-spacing-03);
        }
        :global(.bx--tile--selectable) {
            border-radius: 10px;
            padding-right: 2rem;
        }

        // Nombres et unités de mesure
        .number-unit {
            display: flex;
            gap: var(--cds-spacing-06);

            &:not(.inline) {flex-flow: column;}
        }
    }

    @media (max-width: 672px) {
        .form-bgsize {
            :global(.bx--tile-group > div) {
                grid-template-columns: 1fr 1fr;
            }
        }
    }
</style>