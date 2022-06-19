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
    export let name = "Lorem ipsum"
    
    /**
     * L'adresse URL pour la requête
     * @type {string}
     */
    export let query = ""
    
    /**
     * L'adresse URL de l'icône du moteur de recherche
     * @type {string}
     */
    export let icon = ""
    
    /**
     * L'alias du moteur de recherche
     * @type {string}
     */
    export let alias = ""
    
    /**
     * Le type du moteur de recherche
     * @type {object}
     */
    export let type = ""



    // Imports
    import { TextInput, Breakpoint, Dropdown }
        from "carbon-components-svelte"
    import { listSearchEngines } 
        from '../../../Stores/search'
    import { SearchEngineTypes }
        from '../../../Classes/SearchEngine/SearchEngineType'
    import { onMount }
        from 'svelte'
    import { slide }
        from 'svelte/transition'



    // Initialisation
    let size;
    let listSearchEngineTypes = []
    let dropdownSearchEngineTypes = []
    let selectedTypeIndex = 0
    let errorNameMessage = ""
    let errorQueryMessage = ""
    let errorAliasMessage = ""
    let errorIconMessage = ""



    // Réactivité
    $: checkErrors(name, query, alias, icon)



    // Fonctions
    const initData = () => {
        // Génération d'une liste de types de moteurs de recherche
        listSearchEngineTypes = [] // Liste des instances (pour le Store)
        dropdownSearchEngineTypes = [] // Liste des objets (pour le Dropdown)
        for (let key in SearchEngineTypes) {
            let item = SearchEngineTypes[key] // Instance du type de moteur de recherche
            listSearchEngineTypes.push(item)

            dropdownSearchEngineTypes.push({
                id: item.id,
                text: item.name,
                icon: item.icon
            })
        }
    }
    const onTypeSelect = (e) => {
        // Mettre à jour le type
        type = listSearchEngineTypes.filter((typeItem) => typeItem.id == e.detail.selectedId)[0]
    }
    const checkErrors = () => {
        // Effacer tous les messages
        errorNameMessage = ""
        errorQueryMessage = ""
        errorAliasMessage = ""
        errorIconMessage = ""

        // Vérifier le nom
        if (name.length < 1)
            errorNameMessage = "Vous devez donner un nom au moteur de recherche"

        // Vérification de l'icône
        if (icon.length < 1)
            errorIconMessage = "Vous devez saisir l'adresse URL de l'icône du moteur de recherche"

        // Vérification de l'adresse URL de la requête
        if (query.length < 1)
            errorQueryMessage =  "Vous devez saisir l'adresse URL de la requête du moteur de recherche"
        else if (query.indexOf("%query%") < 0)
            errorQueryMessage =  "Vous devez inclure \"%query%\" dans l'adresse URL de la requête du moteur de recherche"

        // Vérification de l'alias
        for (let ii=0; ii<$listSearchEngines.length; ii++) { // Vérifier dans chaque moteur de recherche
            // Conditions
            let item = $listSearchEngines[ii]
            let sameAlias = alias.toLowerCase() === item.alias.toLowerCase()
            let sameItem = parseInt(id) === parseInt(item.id)

            // Vérification
            if (sameAlias && !sameItem) {
                // L'alias n'est pas valide
                errorAliasMessage = "Cet alias est déjà utilisé par le moteur \"" + $listSearchEngines[ii].name + "\"."
                break
            }
        }
    }



    // Lifecycle
    onMount(initData)
</script>

<main class="se-editor" transition:slide|local>
    <Breakpoint bind:size />

    {#if size == "sm"}
        <TextInput
            labelText="Nom du moteur de recherche"
            placeholder="Google"
            invalidText={errorNameMessage}
            invalid={errorNameMessage.length > 0}
            bind:value={name} />
        <br/><br/>
        <Dropdown
            titleText="Type du moteur de recherche"
            items={dropdownSearchEngineTypes}
            bind:selectedIndex={selectedTypeIndex}
            on:select={onTypeSelect} />
        <br /><br />
        <TextInput
            labelText="Alias du moteur de recherche"
            helperText="Raccourci pour utiliser le moteur de recherche"
            invalidText={errorAliasMessage}
            invalid={errorAliasMessage.length > 0}
            bind:value={alias} />
        <br /><br />
    {:else}
        <div class="row-form">
            <div>
                <TextInput
                    labelText="Nom du moteur de recherche"
                    placeholder="Hello world"
                    invalidText={errorNameMessage}
                    invalid={errorNameMessage.length > 0}
                    bind:value={name} />
            </div>
            <div>
                <TextInput
                    labelText="Alias du moteur de recherche"
                    helperText="Raccourci pour utiliser le moteur de recherche"
                    placeholder="hw"
                    invalidText={errorAliasMessage}
                    invalid={errorAliasMessage.length > 0}
                    bind:value={alias} />
            </div>
            <div>
                <Dropdown
                    titleText="Type du moteur de recherche"
                    items={dropdownSearchEngineTypes}
                    bind:selectedIndex={selectedTypeIndex}
                    on:select={onTypeSelect} />
            </div>
        </div>
        <br/>
    {/if}
    <TextInput
        labelText="Adresse url de la requête"
        placeholder="https://www.domain.com/search?value=%query%"
        helperText="Les occurences du mot clé %query% seront remplacés par la recherche saisie"
        invalidText={errorQueryMessage}
        invalid={errorQueryMessage.length > 0}
        bind:value={query} />
    <br/><br/>
    <TextInput
        labelText="L'icône du moteur de recherche"
        placeholder="https://www.domain.com/logo.png"
        helperText="L'icône sera placé dans un cadre circulaire"
        invalidText={errorIconMessage}
        invalid={errorIconMessage.length > 0}
        bind:value={icon} />
    <br /><br />
</main>

<style lang="scss">
    .se-editor {
        .row-form {
            width: 100%;
            display: flex;
            gap: var(--cds-spacing-08);

            div {flex: 1;}
        }
    }
</style>