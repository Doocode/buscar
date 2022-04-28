<script>
    // Exports
    /**
     * L'identifiant du fond d'écran
     * @type {number}
     */
    export let id = 0

    /**
     * Le nom du fond d'écran
     * @type {string}
     */
    export let name = "Lorem ipsum"

    /**
     * L'adresse URL du fond d'écran
     * @type {string}
     */
    export let url = ""

    /**
     * Les types du fond d'écran
     * @type {array}
     */
    export let types = []



    // Imports
    import { TextInput, Breakpoint, RadioButton, RadioButtonGroup, FormGroup }
        from 'carbon-components-svelte'
    import { BackgroundImageTypes, listBgImgs } 
        from '../../../Stores/bgImages'
    import { onMount }
        from 'svelte'
    import Icofont
        from '../../../UI/Icofont.svelte'
    import { slide }
        from 'svelte/transition'



    // Initialisation
    let size
    let errorNameMessage = ""
    let errorUrlMessage = ""
    let radioType = "both"



    // Réactivité
    $: checkErrors(name, url, types, radioType)
    $: updateViewType(types)
    $: updateTypeData(radioType)



    // Fonctions
    const checkErrors = () => {
        // Effacer tous les messages
        errorNameMessage = ""
        errorUrlMessage = ""

        // Vérifier le nom
        if (name.length < 1)
            errorNameMessage = "Vous devez donner un nom au fond d'écran"

        // Vérification de l'url
        if (url.length < 1)
            errorUrlMessage = "Vous devez saisir l'adresse URL de l'icône du fond d'écran"
    }
    const updateViewType = () => {
        const typePC = types.includes(BackgroundImageTypes.pc)
        const typeSmartphone = types.includes(BackgroundImageTypes.smartphone)
        if (typePC && typeSmartphone)
            radioType = "both"
        else if (typePC && !typeSmartphone)
            radioType = "pc"
        else if (!typePC && typeSmartphone)
            radioType = "smartphone"
    }
    const updateTypeData = () => {
        let data = []
        switch (radioType) {
            case "pc":
                data.push(BackgroundImageTypes.pc)
                break
            case "both":
                data.push(BackgroundImageTypes.pc)
            case "smartphone":
                data.push(BackgroundImageTypes.smartphone)
                break
        }
        types = data
    }
</script>

<main class="bg-editor" transition:slide|local>
    <Breakpoint bind:size />

    <TextInput
        labelText="Nom du fond d'écran"
        placeholder="Google"
        invalidText={errorNameMessage}
        invalid={errorNameMessage.length > 0}
        bind:value={name} />
    <br/><br/>

    <TextInput
        labelText="L'adresse URL du fond d'écran"
        placeholder="https://www.domain.com/background.png"
        invalidText={errorUrlMessage}
        invalid={errorUrlMessage.length > 0}
        bind:value={url} />
    <br /><br />

    <RadioButtonGroup
        orientation="vertical"
        bind:selected={radioType}
        style="margin-bottom: 1rem">
        <RadioButton value="pc">
            <div slot="labelText" class="label">
                <Icofont icon="screen" size="16" />
                <span class="text">Fond pour PC</span>
            </div>
        </RadioButton>
        <RadioButton value="smartphone">
            <div slot="labelText" class="label">
                <Icofont icon="smartphone" size="16" />
                <span class="text">Fond pour smartphone</span>
            </div>
        </RadioButton>
        <RadioButton value="both">
            <div slot="labelText" class="label">
                <Icofont icon="image" size="16" />
                <span class="text">Fond pour PC et smartphone</span>
            </div>
        </RadioButton>
    </RadioButtonGroup>
</main>

<style lang="scss">
    main.bg-editor {
        .label {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: var(--cds-spacing-03);
        }
    }
</style>