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



    // Imports
    import { ClickableTile }
        from "carbon-components-svelte"
    import { createEventDispatcher }
        from 'svelte'
    import Icofont
        from "../Icofont.svelte"



    // Propriétés
    const dispatch = createEventDispatcher()



    // Fonctions
    const onClick = (e) => {
		dispatch('click', e)
    }
</script>

<main class="quick-tile">
    <ClickableTile on:click={onClick}>
        <div class="ident">
            <Icofont {icon} size="26" />
            <p class="name">{name}</p>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </ClickableTile>
</main>

<style lang="scss">
    :global(main.quick-tile .bx--tile) {
        border-radius: 10px;
        padding: var(--cds-spacing-05) var(--cds-spacing-03);
        min-width: initial;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        min-height: 6.5rem;

        .ident {
            display: flex;
            flex-flow: column;
            align-items: center;
            gap: var(--cds-spacing-01);

            .name {
                font-size: 90%;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 130px;
                letter-spacing: .03em;
                text-align: center;
            }
        }

        .content {
            display: flex;
            justify-content: center;
            color: var(--cds-link-01);
        }
    }
</style>