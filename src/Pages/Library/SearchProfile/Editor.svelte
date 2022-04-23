<script>
    // Exports
    /**
     * L'identifiant du moteur de recherche
     * @type {number}
     */
    export let id = 0
    
    /**
     * Le nom du moteur de recherche
     * @type {string}
     */
    export let name = "(Sans nom)"
    
    /**
     * L'adresse URL de l'icône du moteur de recherche
     * @type {string}
     */
    export let icon = ""
    
    /**
     * Les moteurs de recherche
     * @type {[]}
     */
    export let searchEnginesIds = []
    
    /**
     * L'ordre d'affichage
     * @type {number}
     */
    export let orderPresentation = 0



    // Imports
    import { TextInput, Breakpoint, Button, Tag, NumberInput }
        from 'carbon-components-svelte'
    import { listSearchEngines } 
        from '../../../Stores/search'
    import { createEventDispatcher }
        from 'svelte'
    import SearchEnginesBubbles
        from '../../../UI/SearchEnginesBubbles.svelte'
    import Icofont
        from '../../../UI/Icofont.svelte'
    import { listIcons }
        from '../../../Stores/icofont'



    // Initialisation
    let size
    let errorNameMessage = ""
    let errorIconMessage = ""
    let errorOrderPresentationMessage = ""
    let errorSearchEnginesMessage = ""
    const dispatch = createEventDispatcher() // Pour créer des events



    // Réactivité
    $: checkErrors(name, searchEnginesIds, orderPresentation, icon)
    $: selectedIconName = findSelectedIconName(icon)
    $: dataForBubbles = $listSearchEngines
        .filter(item => searchEnginesIds.indexOf(parseInt(item.id)) > -1)



    // Fonctions
    const checkErrors = () => {
        // Effacer tous les messages
        errorNameMessage = ""
        errorIconMessage = ""
        errorOrderPresentationMessage = ""
        errorSearchEnginesMessage = ""

        // Vérifier le nom
        if (name.length < 1)
            errorNameMessage = "Vous devez donner un nom au profil de recherche"

        // Vérification de l'icône
        if (icon.length < 1)
            errorIconMessage = "Vous devez associer une icône au profil de recherche"

        // Vérification de la position
        // TODO: Vérifier que la position n'est pas déjà utilisée ailleurs
    }
    const sendRequestIcon = () => dispatch('requestIcon')
    const sendRequestSearchEngines = () => dispatch('requestSearchEngines')
    const findSelectedIconName = () => {
        const results = $listIcons.filter(item => item.value == icon)
        if (icon == "" || results.length < 1)
            return "(Non définie)"
        return results[0].name
    }
</script>

<Breakpoint bind:size />

<main class="sp-editor">

    <TextInput
        labelText="Nom du profil de recherche"
        placeholder="Google"
        invalidText={errorNameMessage}
        invalid={errorNameMessage.length > 0}
        bind:value={name} />

    <NumberInput required
        label="Ordre d'affichage"
        bind:value={orderPresentation} />

    <div class="form-item">
        <legend class="bx--label">Icône du profil de recherche</legend>
        <div class="row space-between">
            <div class="align-row" style="flex: 1;">
                {#if icon.length > 0}
                    <Icofont icon="{icon}" size="44" />
                {/if}
                <div class="align-column">
                    <p class="name">{selectedIconName}</p>
                    {#if icon.length > 0}
                        <Tag>{icon}</Tag>
                    {/if}
                </div>
            </div>

            <div class="align-row" style="align-items: flex-end">
                <Button kind="tertiary"
                    title="Associer une icône"
                    on:click={sendRequestIcon}>
                    <div class="label">
                        {#if ['sm'].indexOf(size) < 0}
                            <span class="text">Associer une icône</span>
                        {/if}
                        <Icofont icon="pencil" size="18" />
                    </div>
                </Button>
            </div>
        </div>
        {#if errorIconMessage.length > 0}
            <div class="row">
                <div class="bx--form-requirement">
                    {errorIconMessage}
                </div>
            </div>
        {/if}
    </div>

    <div class="form-item">
        <legend class="bx--label">Moteurs de recherche</legend>
        <div class="row space-between">
            <div class="align-row" style="flex: 1; margin: 6px 0;">
                {#if searchEnginesIds.length > 0}
                    <SearchEnginesBubbles searchEngines={dataForBubbles} />
                {:else}
                    <p class="name">(Non défini)</p>
                {/if}
            </div>

            <div class="align-row" style="align-items: flex-end">
                <Button kind="tertiary"
                    title="Définir les moteurs de recherche"
                    on:click={sendRequestSearchEngines}>
                    <div class="label">
                        {#if ['sm'].indexOf(size) < 0}
                            <span class="text">Définir les moteurs de recherche</span>
                        {/if}
                        <Icofont icon="pencil" size="18" />
                    </div>
                </Button>
            </div>
        </div>
    </div>

</main>

<style lang="scss">
    .sp-editor {
        display: grid;
        gap: var(--cds-spacing-08);
        padding-bottom: var(--cds-spacing-08);
        grid-template-columns: 1fr;

        @media (min-width: 672px) { // width > md
            grid-template-columns: 1fr 1fr;
        }

        // Modifier l'icône
        .form-item {
            display: flex;
            flex-flow: column;

            .row {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-flow: wrap;
                gap: 1rem;
            }
            .align-column {
                display: flex;
                flex-flow: column;
                align-items: flex-start;
            }
            .align-row {
                display: flex;
                flex-flow: row;
                align-items: center;
                gap: var(--cds-spacing-03)
            }
            .space-between {
                display: flex;
                justify-content: space-between;
                gap: 1rem;
            }

            :global(.bx--btn) {
                padding: .7rem 1rem;
                min-height: initial;
                border-radius: 8px;
            }

            p.name {
                margin: 0;
                padding: 0;
            }

            .label {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: var(--cds-spacing-03);
            }
        }
    }
</style>