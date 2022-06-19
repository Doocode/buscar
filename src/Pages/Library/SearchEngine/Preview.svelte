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
    
    /**
     * La requête saisie dans la barre de recherche
     * @type {string}
     */
    export let searchBoxValue = "test"



    // Imports
    import { Tag, OutboundLink }
        from 'carbon-components-svelte'
    import SearchEngine
        from '../../../Classes/SearchEngine/SearchEngine'
    import Icofont
        from '../../../UI/Icofont.svelte'
    import SearchBox
        from '../../../UI/SearchBox.svelte'
    import { slide }
        from 'svelte/transition'



    // Réactivité
    $: searchEngineList = formatSearchEngine(name, icon, alias, query)
    $: parsedQuery = parseQuery(query, searchBoxValue)



    // Fonctions
    const parseType = (type) => {
        // Affichage du type dans le tableau
        let template = {
            icon: "warning",
            text: "(inconnu)"
        }

        if (type != null) {
            template.icon = type.icon
            template.text = type.name
        }

        return template
    }
    const formatSearchEngine = () => {
        return [
            new SearchEngine(id, name, alias, type, icon, query)
        ]
    }
    const parseQuery = () => {
        let item = new SearchEngine(id, name, alias, type, icon, query)
        return item.parseQuery(searchBoxValue)
    }
    // TODO: Ajouter le support des alias depuis la popup modifier (tester la nouvelle valeur de l'alias)
</script>

<main class="se-preview" transition:slide|local>
    <img src="{icon}" alt="Icône de {name}" />
    <div class="details">
        <p class="name">{name}</p>
        {#if alias.length > 0}
            <p class="alias"><strong>Alias</strong> : <Tag>{alias}</Tag></p>
        {:else}
            <p class="alias"><strong>Alias</strong> : <span>(Non défini)</span></p>
        {/if}
        <div class="type">
            <p><strong>Type</strong> : </p>
            <div class="type">
                <Icofont icon={parseType(type).icon} size="20" />
                <span class="text">{parseType(type).text}</span>
            </div>
        </div>
        <div class="search">
            <SearchBox
                label="Tester le moteur de recherche"
                searchEngines={searchEngineList}
                submitVisible={false}
                bind:value={searchBoxValue}
            />
        </div>
        {#if searchBoxValue.length > 0}
            <div class="query">
                <p><strong>Test de la requête</strong> :</p>
                <div class="value">
                    <OutboundLink href={parsedQuery}>
                        {parsedQuery}
                    </OutboundLink>
                </div>
            </div>
        {/if}
    </div>
</main>

<style lang="scss">
    .se-preview {
        --icon-size: 150px;

        display: flex;
        flex-flow: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--cds-spacing-06);

        .details {
            display: flex;
            flex-flow: column;
            justify-content: flex-start;
            flex: 1;
        }

        // Logo
        img {
            width: var(--icon-size);
            height: var(--icon-size);
            border-radius: var(--icon-size);
            box-shadow: 0 0 0 1px rgba(127,127,127,.5);
        }

        p {
            padding: 0;
        }

        // Nom et type
        .name, .type, .query {
            --icon-size: 25px;

            display: flex;
            align-items: center;
            gap: 10px;

            img {
                width: var(--icon-size);
                height: var(--icon-size);
                border-radius: var(--icon-size);
                box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            }
        }

        // Nom
        .name {
            font-size: 2em;
            margin-bottom: var(--cds-spacing-03);
        }

        // Type
        .type {
            gap: var(--cds-spacing-02);
            .text {font-size: .9em;}
        }

        // Barre de recherche
        .search {
            margin: var(--cds-spacing-05) 0;
            flex: 1;
        }

        // Requête
        .query {
            gap: 5px;
        }
    }

    @media (min-width: 672px) { // width > lg
        .se-preview {
            flex-flow: row;
            align-items: stretch;
        }
    }

    @media (max-width: 672px) { // width < lg
        .se-preview {
            align-items: initial;

            .details .query {
                flex-flow: column;
                align-items: flex-start;
            }
        }
    }
</style>