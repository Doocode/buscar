<script>
    // Exports
    /**
     * Le nom de la tuile
     * @type {string}
     */
    export let name = ""

    /**
     * L'icône de la tuile
     * @type {string}
     */
    export let icon = ""

    /**
     * Flag d'activation
     * @type {boolean}
     */
    export let checked = false
    
    /**
     * Texte positif
     * @type {string}
     */
    export let positiveText = "Oui"
    
    /**
     * Texte négatif
     * @type {string}
     */
    export let negativeText = "Non"



    // Imports
    import QuickTile
        from "./QuickTile.svelte"
    import Icofont
        from "../Icofont.svelte"



    // Fonctions
    const toggleFlag = () => {
        checked = !checked
    }
</script>

<main class="quick-toggle">
    <QuickTile {icon} {name}
        on:click={ toggleFlag } >
        {#if checked}
            <div class="label positive">
                <Icofont icon="check" size="14" />
                <p>{ positiveText }</p>
            </div>
        {:else}
            <div class="label negative">
                <Icofont icon="disable" size="14" />
                <p>{ negativeText }</p>
            </div>
        {/if}
    </QuickTile>
</main>

<style lang="scss">
    .quick-toggle {
        .label {
            display: inline-flex;
            align-items: center;
            gap: var(--cds-spacing-02);

            p {
                font-size: 100%;
            }

            &.positive {
                color: var(--cds-support-02);
            }
            /*&.negative {
                color: var(--cds-support-03);
            }*/
        }
    }
</style>