<script>
    // Exports
    /**
     * Le libellé
     * @type {string}
     */
    export let label
    
    /**
     * La valeur de la couleur en hexadécimal
     * @type {string}
     */
    export let value = "#123abc"
    
    /**
     * Afficher la valeur en texte
     * @type {boolean}
     */
    export let textValue = true
    
    /**
     * Afficher le bouton d'édition
     * @type {boolean}
     */
    export let editButton = false
    
    /**
     * Type de bouton d'édition
     * @type {string}
     */
    export let kindEditButton = "primary"



    // Imports
    import { Button }
        from 'carbon-components-svelte'
    import Icofont
        from './Icofont.svelte'



    // Propriétés
    let input
</script>

<main class="bx--color-input">
    {#if label.length > 0}
        <legend class="bx--label">{label}</legend>
    {/if}

    <div class="row">
        <div class="color-view"
            style="--value: {value}"
            on:click={() => input.click()}
        >
            <input type="color"
                bind:this={input}
                bind:value={value} />
        </div>

        {#if textValue}
            <span class="text-value">{value}</span>
        {/if}

        <div class="actions" style="flex: 1">
            {#if editButton}
                <Button kind={kindEditButton}
                    on:click={() => input.click()} >
                    <div class="label">
                        <Icofont icon="palette" size="18" />
                        <p class="text">Choisir une couleur</p>
                    </div>
                </Button>
            {/if}
        </div>
    </div>
</main>

<style lang="scss">
    .bx--color-input .row {
        display: flex;
        flex-flow: wrap;
        align-items: center;
        gap: .5rem;

        // Actions
        .actions {
            display: flex;
            flex-flow: wrap;
            gap: var(--cds-spacing-02);

            // Bouton
            :global(.bx--btn) {
                border-radius: 8px;
            }

            p {
                margin: 0;
                padding: 0;
            }

            .label {
                display: flex;
                align-items: center;
                gap: var(--cds-spacing-02);
            }
        }

        // Sélecteur de couleur
        .color-view {
            --value: #00aaff;

            width: 47px;
            height: 47px;
            border-radius: 50px;
            background-color: var(--value);
            border: 1px solid var(--cds-background-inverse);
            cursor: pointer;

            input {display: none;}
        }

        // Valeur en texte
        /*.text-value {
            font-family: 'IBM Plex Serif', 'Georgia', Times, serif;
        }*/
    }
</style>