<script>
    // Exports
    /**
     * L'identifiant du marque-page
     * @type {number}
     */
    export let id = 0
    
    /**
     * Le nom du marque-page
     * @type {string}
     */
    export let name = "(Sans nom)"
    
    /**
     * Le type du marque-page
     * @type {string}
     */
    export let type = ""
    
    /**
     * Le contenu du marque-page
     * @type {object}
     */
    export let data = ""
    
    /**
     * L'adresse URL du marque-page
     * @type {string}
     */
    export let url = ""
    
    /**
     * La valeur de l'icône du marque-page
     * @type {string}
     */
    export let icon = ""
    
    /**
     * Le type d'icône du marque-page
     * @type {string}
     */
    export let iconType = ""
    
    /**
     * La couleur de l'icône du marque-page
     * @type {string}
     */
    export let iconBgColor = ""
    
    /**
     * La taille de l'image dans l'icône du marque-page
     * @type {small|medium|cover|contain|strech}
     */
    export let iconImageFormat = "medium"
    
    /**
     * Indique si le formulaire contient une erreur
     * @type {boolean}
     */
    export let containsErrors = true



    // Imports
    import { TextInput, Breakpoint, Button, RadioButtonGroup, RadioButton }
        from 'carbon-components-svelte'
    import { createEventDispatcher }
        from 'svelte'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { slide }
        from 'svelte/transition'
    import { BookmarkTypes }
        from '../../Classes/Bookmarks/BookmarkType'
    import ColorInput
        from '../../UI/ColorInput.svelte'



    // Initialisation
    let size
    let errorNameMessage = ""
    let errorIconMessage = ""
    let errorUrlMessage = ""
    const dispatch = createEventDispatcher()



    // Réactivité
    $: checkErrors(name, type, data, url, icon, iconType, iconBgColor, iconImageFormat)



    // Fonctions
    const checkErrors = () => {
        // Effacer tous les messages
        errorNameMessage = ""
        errorIconMessage = ""
        errorUrlMessage = ""

        // Vérifier le nom
        if (name.length < 1)
            errorNameMessage = "Vous devez donner un nom au marque-page"

        // Pour les sites web uniquement
        if (type == BookmarkTypes.website) {
            // Vérification de l'icône
            if (icon.length < 1)
                errorIconMessage = "Vous devez associer une icône au marque-page"
            else {
                if (iconType == "text" && icon.length > 3)
                    errorIconMessage = "Vous devez définir un texte de moins de 4 caractères"
            }

            // Vérification de l'adresse URL
            if (url.length < 1)
                errorUrlMessage = "Vous devez associer une adresse URL au marque-page"
        }

        containsErrors = errorNameMessage.length != 0 || errorIconMessage.length != 0 || errorUrlMessage.length != 0
    }
    const sendRequestDuplicate = () => dispatch('requestDuplicate')
    const sendRequestDelete = () => dispatch('requestDelete')
    const sendRequestMove = () => dispatch('requestMove')
</script>

<Breakpoint bind:size />

<main class="sp-editor" transition:slide|local>

    <TextInput
        labelText="Nom du marque-page"
        placeholder="Hello World!"
        invalidText={errorNameMessage}
        invalid={errorNameMessage.length > 0}
        bind:value={name} />

    {#if type == BookmarkTypes.website}
        <TextInput
            labelText="Adresse URL"
            placeholder="http://hello.world/"
            invalidText={errorUrlMessage}
            invalid={errorUrlMessage.length > 0}
            bind:value={url} />

        <!-- Type de l'icône -->
        <RadioButtonGroup legendText="Type d'icône"
            bind:selected={iconType}>
            <RadioButton labelText="Image" value="image"/>
            <RadioButton labelText="Texte" value="text"/>
        </RadioButtonGroup>

        {#if iconType == "text"}
            <!-- Saisie du texte de l'icône -->
            <div>
                <TextInput
                    labelText="Texte de l'icône"
                    placeholder="ABC"
                    invalidText={errorIconMessage}
                    invalid={errorIconMessage.length > 0}
                    bind:value={icon} />
            </div>
        {:else if iconType == "image"}
            <div>
                <!-- Saisie de l'url de l'icône -->
                <TextInput
                    labelText="Adresse URL de l'icône"
                    placeholder="https://hello.world/favicon.png"
                    invalidText={errorIconMessage}
                    invalid={errorIconMessage.length > 0}
                    bind:value={icon} />
            </div>
            
            <div>
                <!-- Taille de l'image -->
                <RadioButtonGroup legendText="Taille de l'image dans l'icône"
                    bind:selected={iconImageFormat}>
                    <div style="display: flex; flex-flow: wrap; align-items: center; gap: var(--cds-spacing-03);">
                        <RadioButton labelText="Petite" value="small"/>
                        <RadioButton labelText="Moyenne" value="medium"/>
                        <RadioButton labelText="Remplir" value="cover"/>
                        <!--RadioButton labelText="Contenir" value="contain"/>
                        <RadioButton labelText="Étirer" value="strech"/-->
                    </div>
                </RadioButtonGroup>
            </div>
            
            <div>
                <!-- Couleur de fond -->
                <ColorInput bind:value={iconBgColor}
                    label="Couleur de fond"
                    editButton={true}
                    kindEditButton={'ghost'} />
            </div>
        {/if}

        <!--div class="form-item">
            <legend class="bx--label">Analyser le contenu de la page</legend>
            <div class="row">
                <div class="align-row" style="align-items: flex-start; flex-flow: wrap">
                    <Button kind="tertiary"
                        title="Rechercher le nom du site web">
                        <div class="label">
                            <Icofont icon="rename" size="20" />
                            {#if ['sm'].indexOf(size) < 0}
                                <span class="text">Rechercher le <strong>nom du site web</strong> à partir de l'adresse URL</span>
                            {/if}
                        </div>
                    </Button>

                    <Button kind="tertiary"
                        title="Rechercher l'icône du site web">
                        <div class="label">
                            <Icofont icon="image" size="20" />
                            {#if ['sm'].indexOf(size) < 0}
                                <span class="text">Rechercher l'<strong>icône du site web</strong> à partir de l'adresse URL</span>
                            {/if}
                        </div>
                    </Button>
                </div>
            </div>
        </div-->
    {/if}

    <!--div class="form-item">
        <legend class="bx--label">Actions supplémentaires</legend>

        <div class="row">
            <div class="align-row" style="align-items: flex-start; flex-flow: wrap">
                <Button kind="tertiary"
                    title="Dupliquer"
                    on:click={sendRequestDuplicate}>
                    <div class="label">
                        <Icofont icon="duplicate" size="18" />
                        {#if ['sm'].indexOf(size) < 0}
                            <span class="text">Dupliquer</span>
                        {/if}
                    </div>
                </Button>

                <Button kind="tertiary"
                    title="Déplacer"
                    on:click={sendRequestMove}>
                    <div class="label">
                        <Icofont icon="target" size="18" />
                        {#if ['sm'].indexOf(size) < 0}
                            <span class="text">Déplacer</span>
                        {/if}
                    </div>
                </Button>

                <Button kind="tertiary"
                    title="Supprimer"
                    on:click={sendRequestDelete}>
                    <div class="label">
                        <Icofont icon="bin" size="18" />
                        {#if ['sm'].indexOf(size) < 0}
                            <span class="text">Supprimer</span>
                        {/if}
                    </div>
                </Button>
            </div>
        </div>
    </div-->

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