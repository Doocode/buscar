<script>
    // Exports
    /**
     * Le mot clé pour la position sur l'axe X
     * @type {'left' | 'center' | 'right'}
     */
    export let positionKeywordX = 'center'

    /**
     * Le mot clé pour la position sur l'axe Y
     * @type {'top' | 'center' | 'bottom'}
     */
    export let positionKeywordY = 'center'

    /**
     * Activer le décalage la position sur l'axe X
     * @type {boolean}
     */
    export let shiftFlagX = false
    
    /**
     * Activer le décalage la position sur l'axe Y
     * @type {boolean}
     */
    export let shiftFlagY = false

    /**
     * La valeur du décalage la position sur l'axe X
     * @type {number}
     */
    export let shiftValueX = 0

    /**
     * La valeur du décalage la position sur l'axe Y
     * @type {number}
     */
    export let shiftValueY = 0

    /**
     * L'unité du décalage la position sur l'axe X
     * @type {'px' | '%'} // ? em / cm / mm / in / pt / pc 
     */
    export let shiftUnitX = 'px'

    /**
     * L'unité du décalage la position sur l'axe Y
     * @type {'px' | '%'}
     */
    export let shiftUnitY = 'px'



    // Imports
    import { FormGroup, Checkbox, RadioButtonGroup, RadioButton,
        Select, SelectItem, NumberInput, Breakpoint, TileGroup, RadioTile }
        from 'carbon-components-svelte'
	import { slide }
        from 'svelte/transition'
    import Icofont
        from '../UI/Icofont.svelte'



    // Propriétés
    const enableCustomShift = false // Activer le décalage (désactivé actuelle car bugs)
    let size
    const positions = [
        {text: "En haut à gauche", icon: 'arrow_diagonal_4', value: 'left top'},
        {text: "En haut et centré", icon: 'arrow_up', value: 'center top'},
        {text: "En haut à droite", icon: 'arrow_diagonal_1', value: 'right top'},

        {text: "Au centre à gauche", icon: 'arrow_left', value: 'left center'},
        {text: "Au centre", icon: 'cross', value: 'center center'},
        {text: "Au centre à droite", icon: 'arrow_right', value: 'right center'},

        {text: "En bas à gauche", icon: 'arrow_diagonal_3', value: 'left bottom'},
        {text: "En bas et centré", icon: 'arrow_down', value: 'center bottom'},
        {text: "En bas à droite", icon: 'arrow_diagonal_2', value: 'right bottom'},
    ]



    // Réactivité
    $: radioOrientation = ['sm'].includes(size) ? 'horizontal' : 'vertical'
    $: positionKeyword = positionKeywordX +' '+ positionKeywordY



    // Fonctions
    const onSelectPosition = e => {
        const pos = e.detail.split(' ')
        positionKeywordX = pos[0]
        positionKeywordY = pos[1]
    }
</script>

<Breakpoint bind:size />

<main class="form-bgpos">
    <TileGroup
        legend="Positionnement de l'image"
        style="padding-bottom: 2rem"
        selected={positionKeyword}
        on:select={onSelectPosition}
    >
        <div class="grid-position">
            {#each positions as pos}
                <RadioTile value={pos.value} title={pos.text}>
                    <div class="label">
                        <Icofont icon={pos.icon} size="32" />
                        <span class="text">{pos.text}</span>
                    </div>
                </RadioTile>
            {/each}
        </div>
    </TileGroup>

    <div>
        <div class="part">
            <!--FormGroup legendText="Positionnement horizontal">
                <RadioButtonGroup name="positionKeywordX"
                    orientation={radioOrientation}
                    bind:selected={positionKeywordX}>
                    <RadioButton
                        value="left"
                        labelText="Gauche"
                    />
                    <RadioButton
                        value="center"
                        labelText="Centré"
                    />
                    <RadioButton
                        value="right"
                        labelText="Droite"
                    />
                </RadioButtonGroup>
            </FormGroup-->

            {#if positionKeywordX != 'center' && enableCustomShift}
                <div transition:slide|local>
                    <FormGroup legendText="Décalage horizontal">
                        <Checkbox labelText="Activé"
                            disabled={positionKeywordX == 'center'}
                            bind:checked={shiftFlagX} />
        
                        {#if shiftFlagX && positionKeywordX != 'center'}
                            <div class="number-unit" transition:slide|local>
                                <NumberInput bind:value={shiftValueX}
                                    label="Valeur du décalage"
                                    disabled={!shiftFlagX && positionKeywordX != 'center'} />
            
                                <Select labelText="Unité de mesure"
                                    disabled={!shiftFlagX && positionKeywordX != 'center'}
                                    on:change={e => shiftUnitX = e.detail}
                                    selected={shiftUnitX}>
                                    <SelectItem value="px" text="Pixels (px)" />
                                    <SelectItem value="%" text="Pourcentages (%)" />
                                </Select>
                            </div>
                        {/if}
                    </FormGroup>
                </div>
            {/if}
        </div>

        <div class="part">
            <!--FormGroup legendText="Positionnement vertical">
                <RadioButtonGroup name="positionKeywordY"
                    orientation={radioOrientation}
                    bind:selected={positionKeywordY}>
                    <RadioButton
                        value="top"
                        labelText="Haut"
                    />
                    <RadioButton
                        value="center"
                        labelText="Centré"
                    />
                    <RadioButton
                        value="bottom"
                        labelText="Bas"
                    />
                </RadioButtonGroup>
            </FormGroup-->

            {#if positionKeywordY != 'center' && enableCustomShift}
                <div transition:slide|local>
                    <FormGroup legendText="Décalage vertical">
                        <Checkbox labelText="Activé"
                            disabled={positionKeywordY == 'center'}
                            bind:checked={shiftFlagY} />

                        {#if shiftFlagY && positionKeywordY != 'center'}
                            <div class="number-unit" transition:slide|local>
                                <NumberInput bind:value={shiftValueY}
                                    label="Valeur du décalage"
                                    disabled={!shiftFlagY && positionKeywordY != 'center'} />
            
                                <Select labelText="Unité de mesure"
                                    disabled={!shiftFlagY && positionKeywordY != 'center'}
                                    on:change={e => shiftUnitY = e.detail}
                                    selected={shiftUnitY}>
                                    <SelectItem value="px" text="Pixels (px)" />
                                    <SelectItem value="%" text="Pourcentages (%)" />
                                </Select>
                            </div>
                        {/if}
                    </FormGroup>
                </div>
            {/if}
        </div>
    </div>
</main>

<style lang="scss">
    .form-bgpos {
        :global(.bx--fieldset) {
            margin-bottom: 0;
            padding-bottom: 2rem;
        }

        // Label
        div.label {
            display: inline-flex;
            flex-flow: column;
            align-items: flex-start;
            gap: var(--cds-spacing-03);

            .text {display: none;}
        }

        // Grille des positions
        .grid-position {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: var(--cds-spacing-03);
        }
        :global(.bx--tile--selectable) {
            padding: 1rem;
            min-width: inherit;
            min-height: inherit;
            border-radius: 10px;
            //aspect-ratio: 1/1;
        }

        // Nombres et unités de mesure
        .number-unit {
            display: flex;
            gap: var(--cds-spacing-06);

            &:not(.inline) {flex-flow: column;}
        }
    }
</style>