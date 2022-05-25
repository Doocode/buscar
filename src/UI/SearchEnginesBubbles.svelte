<script>
    // Exports
    export let searchEngines = [] // Liste des moteurs de recherche
    export let bubbleSize = "40px" // Taille des bulles
    export let fontSize = "12px" // Taille de la police
    export let clickable = false // Modifie le curseur et ajoute un effet au survol
    export let collapse = false // Affichage compact



    // Imports
    import { maxDisplayBubble }
        from '../Stores/settings'
    import { createEventDispatcher }
        from 'svelte'



    // Propriétés
    const dispatch = createEventDispatcher()




    // Méthodes
    function onClick() {
		dispatch('click');
    }
</script>

<main>
    {#if searchEngines.length > 0}
        <div class="bubbles"
            title="Liste des moteurs de recherche"
            style="--bubble-size: {bubbleSize}; --font-size: {fontSize};"
            class:clickable
            class:collapse
            on:click={onClick}
        >
            {#each searchEngines.slice(0, $maxDisplayBubble) as seItem}
                <img class="bubble icon" src="{ seItem.icon }"
                    title="{ seItem.name }"
                    alt="Logo de { seItem.name }" />
            {/each}

            {#if searchEngines.length > $maxDisplayBubble}
                <span class="bubble count" title="Il y a { searchEngines.length - $maxDisplayBubble } moteurs de recherche en plus">
                    +{ searchEngines.length - $maxDisplayBubble }
                </span>
            {/if}
        </div>
    {/if}
</main>

<style lang="scss">
    // Variables
    :root {
        --bubble-size: 40px;
        --bubble-spacing: calc(var(--bubble-size) * .2);
        --font-size: 12px;
    }

    .bubbles {
        display: flex;
        justify-content: center;
        align-items: center;

        .bubble {
            width: var(--bubble-size);
            height: var(--bubble-size);
            border-radius: var(--bubble-size);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--font-size);
            text-align: center;
            box-shadow: 0 0 0 2px transparent, 0 0 0 1px rgba(127,127,127,.5);
            transition: all .2s;

            // Espace entre les bulles
            + .bubble {margin-left: var(--bubble-spacing);}

            // Affichage du nombre d'items restants
            &.count {
                background: var(--cds-ui-background);
            }
        }

        // Effets
        &.clickable {
            cursor: pointer;

            &:hover .bubble {
                box-shadow: 0 0 0 2px var(--cds-interactive-01), 0 0 0 1px rgba(127,127,127,.5);
            }
        }
        &.collapse {
            --bubble-spacing: calc(var(--bubble-size) * -.2);
        }
    }
</style>