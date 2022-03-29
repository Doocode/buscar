<script>
    // Exports
    /**
     * Le titre de la page
     * @type {string}
     */
    export let title = ""

    /**
     * L'icône de la page
     * @type {string}
     */
    export let icon = ""

    /**
     * Bouton retour visible
     * @type {boolean}
     */
    export let backButtonVisible = true

    /**
     * Bouton fermer visible
     * @type {boolean}
     */
    export let closeButtonVisible = true



    // Imports
    import { Button }
        from "carbon-components-svelte"
    import { createEventDispatcher }
        from 'svelte'
    import Icofont
        from '../Icofont.svelte'



    // Propriétés
    const dispatch = createEventDispatcher()



    // Fonctions
    const onClose = () => {
        dispatch("close")
    }
    const goBack = () => {
        dispatch("backRequest")
    }
</script>

<main>
    <div class="head">
        <div class="left">
            {#if backButtonVisible == true}
                <Button kind="ghost"
                    title="Retour vers les réglages rapides"
                    on:click={goBack} >
                    <Icofont icon="arrow_left" />
                </Button>
            {/if}
        </div>
        <div class="center">
            <Icofont {icon} size="20" />
            <p class="title">{title}</p>
        </div>
        <div class="right">
            {#if closeButtonVisible == true}
                <Button kind="ghost"
                    title="Fermer le panneau"
                    on:click={onClose} >
                    <Icofont icon="cross" />
                </Button>
            {/if}
        </div>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</main>

<style lang="scss">
    // Entête
    .head {
        background: var(--cds-ui-01);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;

        // Espaces droite et gauche
        > .left, > .right {
            flex: 1;
            display: flex;
        }
        > .left {justify-content: flex-start;}
        > .right {justify-content: flex-end;}

        // Espace centré (titre)
        > .center {
            flex: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: var(--cds-spacing-03);
        }

        // Boutons
        :global(.bx--btn) {
            min-width: initial;
            font-size: 16px;
            padding: var(--cds-spacing-05);
        }
    }
</style>