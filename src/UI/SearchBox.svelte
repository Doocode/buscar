<script>
    // Imports
    import { Button, TextInput, FluidForm } from "carbon-components-svelte";
    import { maxDisplayBubble } from '../Stores/settings'
    import Icofont from "../UI/Icofont.svelte";
    import { createEventDispatcher, onDestroy } from 'svelte';
    import async from "async";

    // Propriétés externes
    export let label = "Rechercher" // Libellé du formulaire
    export let searchEngines = []; // Moteurs de recherche sélectionnés
    export let value = ""; // Texte saisie dans le formulaire
    export let placeholder = "météo du jour"; // Texte de suggestion

    // Propriétés internes
    const dispatch = createEventDispatcher(); // Pour créer des events
    let limitMaxBubble; // Nombre de moteurs de recherche à afficher

    // Observations
    const unsub_maxDisplayBubble = maxDisplayBubble.subscribe(value => {
        limitMaxBubble = value;
    });

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_maxDisplayBubble();
    });

    // Méthodes
    // - askSearchEngines : Proposer de choisir un ou des moteurs de recherche
    function askSearchEngines() {
		dispatch('askSearchEngines');
    }
    // - submit : Lancer la requête
    function submit() {
        // Initialisation de la liste des urls
        let urls = [];

        // Parcours des moteurs de recherche sélectionnés
        async.eachSeries(searchEngines, function generateUrls(seItem, done) {
            // Echapper les caractères spéciaux (%, =, ?) dans la saisie
            let encoded = encodeURI(value);

            // Ajout de l'url avec la requête
            urls.push(seItem.query.replace("%query%", encoded));

            // Terminé
            return done();
        }, function finished() {
            // Fin de la tache => lancer l'event
            dispatch('submit', {
                value: value,
                urls: urls
            });
        });
    }
    // - onKeyUp : Lorsqu'une touche pressée est relachée
    function onKeyUp(e) {
        if (e.keyCode == 13) // Touche Entrée
            submit();
        return true;
    }

</script>

<div class:without-bubbles={ searchEngines.length == 0 }>
    <FluidForm class="query-form">
        {#if searchEngines.length > 0}
            <div class="bubbles" on:click={askSearchEngines}>
                {#each searchEngines.slice(0, limitMaxBubble) as wsearch}
                    <img class="bubble icon" src="{ wsearch.icon }"
                        title="La recherche se fera sur { wsearch.name }"
                        alt="Logo de { wsearch.name }" />
                {/each}

                {#if searchEngines.length > limitMaxBubble}
                    <span class="bubble count" title="Il y a { searchEngines.length - limitMaxBubble } sites web en plus">
                        +{ searchEngines.length - limitMaxBubble }
                    </span>
                {/if}
            </div>
        {/if}

        <TextInput size="xl"
            labelText={ label } placeholder={ placeholder }
            on:keyup={ onKeyUp } bind:value={ value } />

        <Button on:click={ submit }>
            <Icofont icon="search" size="20" />
        </Button>
    </FluidForm>
</div>

<style lang="scss">
    // Variables
    :root {
        --border-radius: 10px;
        --bubble-size: 40px;
    }

    // Forme globale
    :global(.bx--form--fluid .bx--text-input-wrapper) {
        border-radius: var(--border-radius);
        background: transparent;
    }

    // Contenu du formulaire
    :global(.query-form) {
        --input-padding_left: .5rem; // L'espace entre les bulles et l'input/label

        max-width: 670px;
        display: flex;
        margin: 25px auto;
        border-radius: var(--border-radius);
        box-shadow: 0 0 0 1px rgba(127,127,127,.3);
        transition: all .5s;

        // Le texte avant l'input
        :global(.bx--label) {
            width: calc(100% - 2rem);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            left: var(--input-padding_left);
        }

        // Les bulles : les icones des moteurs de recherche
        .bubbles {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-left: 12px;
            padding-right: 5px;
            cursor: pointer;
            background: var(--cds-field-01);
            border-radius: var(--border-radius) 0 0 var(--border-radius);
            border-bottom: 1px solid var(--cds-ui-04);

            .bubble {
                width: var(--bubble-size);
                height: var(--bubble-size);
                border-radius: var(--bubble-size);
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 0 0 2px transparent, 0 0 0 1px rgba(127,127,127,.5);
                transition: all .2s;

                + .bubble {margin-left: -7px;}

                // Affichage du nombre d'items restants
                &.count {
                    background: var(--cds-ui-background);
                }
            }

            &:hover .bubble {
                box-shadow: 0 0 0 2px var(--cds-interactive-01), 0 0 0 1px rgba(127,127,127,.5);
            }
        }

        // L'input de la requête
        :global(.bx--text-input) {
            margin: 0;
            border-radius: 0;
            padding-left: var(--input-padding_left);
        }

        // Le bouton de confirmation
        :global(.bx--btn) {
            display: flex;
            gap: 5px;
            padding: 0;
            width: 64px;
            min-height: initial;
            max-width: initial;
            justify-content: center;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }
    }

    // Affichage sans moteurs de recherche
    .without-bubbles {
        // S'il n'y a aucun moteur de recherche sélectionné

        :global(.query-form) {
            --input-padding_left: 1rem;
        }

        :global(.query-form .bx--text-input) {
            border-radius: 10px 0 0 10px;
        }
    }

    
    // Affichage standard
    @media (min-width: 672px) {
        :global(.query-form) {
            margin: 100px auto;
        }
    }
</style>
