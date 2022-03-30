<script>
    // Exports
    /**
     * Le label du formulaire
     * @type {string}
     */
    export let label = "Rechercher"

    /**
     * La liste des moteurs de recherche sélectionnés
     * @type {array}
     */
    export let searchEngines = []
    
    /**
     * Le texte saisie dans le formulaire
     * @type {string}
     */
    export let value = ""
    
    /**
     * Le texte de suggestion
     * @type {string}
     */
    export let placeholder = "Tapez votre requête ici"
    
    /**
     * Possible de cliquer sur les bulles des moteurs de recherche
     * @type {boolean}
     */
    export let clickableBubbles = false
    
    /**
     * Afficher le bouton "Lancer la recherche"
     * @type {boolean}
     */
    export let submitVisible = true



    // Imports
    import { Button, TextInput, FluidForm }
        from "carbon-components-svelte"
    import { compactSearchBox }
        from '../Stores/settings'
    import SearchEnginesBubbles
        from "./SearchEnginesBubbles.svelte"
    import Icofont
        from "../UI/Icofont.svelte"
    import { createEventDispatcher }
        from 'svelte'
    import async
        from "async"



    // Propriétés internes
    const dispatch = createEventDispatcher() // Pour créer des events



    // Méthodes
    // - askSearchEngines : Proposer de choisir un ou des moteurs de recherche
    const askSearchEngines = () => {
		dispatch('askSearchEngines')
    }
    // - submit : Lancer la requête
    const submit = () => {
        // Initialisation de la liste des urls
        let urls = []

        // Parcours des moteurs de recherche sélectionnés
        async.eachSeries(searchEngines, function generateUrls(seItem, done) {
            // Echapper les caractères spéciaux (%, =, ?) dans la saisie
            let encoded = encodeURI(value)

            // Ajout de l'url avec la requête
            urls.push(seItem.queryUrl.replace("%query%", encoded))

            // Terminé
            return done()
        }, function finished() {
            // Fin de la tache => lancer l'event
            dispatch('submit', {
                value: value,
                urls: urls
            })
        })
    }
    // - onKeyUp : Lorsqu'une touche pressée est relachée
    const onKeyUp = (e) => {
        if (e.keyCode == 13) // Touche Entrée
            submit()
        return true
    }
    // - bubblesClicked : Lors du clic sur les bulles
    const bubblesClicked = () => {
        if (clickableBubbles)
            return askSearchEngines()
    }
    export const changeValue = (v) => {
        value = v
    }
</script>

<div class="searchBox"
    class:without-bubbles={ searchEngines.length == 0 }
    class:compact={ $compactSearchBox }
    class:without-submit={ !submitVisible }
>
    {#if $compactSearchBox}
        {#if searchEngines.length > 0}
            <div class="bubble-box" title="Les moteurs de recherche sélectionnés">
                <SearchEnginesBubbles
                    clickable={ clickableBubbles }
                    searchEngines={ searchEngines }
                    bubbleSize="32px"
                    collapse="true"
                    on:click={ bubblesClicked } />
            </div>
        {/if}

        <TextInput size="xl" placeholder={ placeholder }
            on:keyup={ onKeyUp } bind:value={ value } />

        {#if submitVisible}
            <Button on:click={ submit } title="Lancer la recherche">
                <Icofont icon="search" size="20" />
            </Button>
        {/if}
    {:else}
        <FluidForm class="query-form">
            {#if searchEngines.length > 0}
                <div class="bubble-box" title="Les moteurs de recherche sélectionnés">
                    <SearchEnginesBubbles
                        clickable={ clickableBubbles }
                        searchEngines={ searchEngines }
                        bubbleSize="40px"
                        collapse="true"
                        on:click={ bubblesClicked } />
                </div>
            {/if}

            <TextInput
                labelText={ label } placeholder={ placeholder }
                on:keyup={ onKeyUp } bind:value={ value } />

            {#if submitVisible}
                <Button on:click={ submit } title="Lancer la recherche">
                    <Icofont icon="search" size="20" />
                </Button>
            {/if}
        </FluidForm>
    {/if}
</div>

<style lang="scss">
    // Variables
    :root {
        --border-radius: 10px;
        --button-size: 64px;
        --input-padding_left: .5rem; // L'espace entre les bulles et l'input/label
    }

    .searchBox {
        max-width: 670px;
        margin: 0;

        // Les bulles : les icones des moteurs de recherche
        .bubble-box {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-left: 12px;
            padding-right: 5px;
            background: var(--cds-field-01);
            border-radius: var(--border-radius) 0 0 var(--border-radius);
            border-bottom: 1px solid var(--cds-ui-04);
        }

        // Le bouton de confirmation
        :global(.bx--btn) {
            display: flex;
            gap: 5px;
            padding: 0;
            width: var(--button-size);
            min-height: initial;
            max-width: initial;
            justify-content: center;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }

        // Affichage compacte
        &.compact {
            display: flex;

            // Le bouton de confirmation
            --button-size: 48px; // Taille du bouton de confirmation
            
            // Les bulles : les icones des moteurs de recherche
            .bubble-box {padding-left: 8px;}

            // Zone de saisie
            :global(.bx--text-input) {
                margin: 0;
                padding-left: var(--input-padding_left);
            }
        }
    }

    // Forme globale
    :global(.bx--form--fluid .bx--text-input-wrapper) {
        border-radius: var(--border-radius);
        background: transparent;
    }

    // Contenu du formulaire
    :global(.query-form) {
        display: flex;
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

        // L'input de la requête
        :global(.bx--text-input) {
            margin: 0;
            padding-left: var(--input-padding_left);
        }
    }

    // Affichage sans moteurs de recherche
    .searchBox.without-bubbles {
        // S'il n'y a aucun moteur de recherche sélectionné
        --input-padding_left: 1rem;

        :global(.bx--text-input) {
            border-radius: 10px 0 0 10px;
        }
    }

    :global(.bx--modal) .searchBox .bubble-box {
        background: var(--cds-field-02);
    }

    // Affichage sans bouton valider
    .searchBox.without-submit {
        :global(.query-form .bx--text-input),
        :global(.bx--text-input) {
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }
    }
</style>
