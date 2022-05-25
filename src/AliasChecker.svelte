<script>
    /**
     * La requête à vérifier
     * @type {string}
     */
    export let query = ""

    /**
     * Liste des moteurs de recherche sélectionnés
     * @type {array}
     */
    export let selectedSearchEngines = []



    // Imports
    import { aliasAddSearchEngine, aliasRemoveSearchEngine, aliasReplaceSearchEngine, 
        multiSelectionSearchEngines, enableAliasAddSearchEngine, enableAliasRemoveSearchEngine,
        enableAliasReplaceSearchEngine }
        from './Stores/settings'
    import { listSearchEngines }
        from './Stores/search'
    import { createEventDispatcher, onDestroy }
        from 'svelte'
    import Utils
        from './Classes/Utils'



    // Propriétés internes
    const dispatch = createEventDispatcher();
    let searchEngines = []



    // Réactivité
    $: checkAlias(query) // Vérifie les alias lorsque la requête change


    
    // Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        searchEngines = value
    });



    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines();
    });



    // Méthodes
    const escapeRegex = (text) => {
        if (Utils.isRegexSpecialCharacter(text))
            return '\\' + text
        return '' + text
    }
    // checkAlias : Vérifier les alias saisis dans la requête
    const checkAlias = () => {
        /*
            Définition de la regex pour chercher l'alias
            - Regex pour capturer le raccourci de l'action et l'alias du moteur : ([\+\-!])([\w]+)?
                1. ([\+\-!]) : Récupérer l'action à réaliser (ajouter/retirer/remplacer) en échappant les caractères spéciaux
                2. ([\w]+)? : Récupérer le texte alpha-numérique; "?" = champ optionnel
            - Paramètre "i" : Ne pas prendre en considération la casse
        */

        // Echappement des caractères spéciaux pour les raccourcis des actions
        let regexAliasPrefixes = ''
        if ($enableAliasAddSearchEngine)
            regexAliasPrefixes += escapeRegex($aliasAddSearchEngine)
        if ($enableAliasRemoveSearchEngine)
            regexAliasPrefixes += escapeRegex($aliasRemoveSearchEngine)
        if ($enableAliasReplaceSearchEngine)
            regexAliasPrefixes += escapeRegex($aliasReplaceSearchEngine)

        // Concaténation de la regex avec les raccourcis des actions
        let regex = new RegExp(`([${regexAliasPrefixes}])([\\w]+)? `, "i") // https://stackabuse.com/guide-to-regular-expressions-and-matching-strings-in-javascript/

        // Execution de la regex sur la requête
        let result = regex.exec(query)

        // S'il y a un alias qui a été repéré
        if (result != null) {
            if (result.length == 3 && typeof(result[2]) !== "undefined") { // S'il y a l'action (+, - ou !) et l'alias du moteur
                // Vérifier si l'alias correspond à un moteur de recherche
                // Parcourir les moteurs de recherche
                for (let ii=0; ii<searchEngines.length; ii++) {

                    // Si l'alias correspond à un moteur existant
                    if (result[2].toLowerCase() == searchEngines[ii].alias.toLowerCase()) {

                        // Activer la multisélection s'il y a déjà un moteur de recherche sélectionné
                        if (selectedSearchEngines.length == 1) { // S'il y a déjà un moteur de recherche sélectionné
                            multiSelectionSearchEngines.set(true)
                        }

                        // Supprime l'alias de la requête
                        query = query.replace(result[0], "")
                        updateQuery(query)

                        // Envoyer un signal en fonction de l'action
                        switch (result[1]) {
                            case $aliasAddSearchEngine: // Ajouter à la sélection
                                selectSearchEngine(searchEngines[ii])
                                break;
                            case $aliasRemoveSearchEngine: // Supprimer de la sélection
                                deselectSearchEngine(searchEngines[ii])
                                break;
                            case $aliasReplaceSearchEngine: // Remplacer la sélection
                                replaceSearchEngine(searchEngines[ii])
                                break;
                        }
                    }
                }
            } else if (result.length >= 2) { // Sinon s'il y a juste l'action
                // TODO: Proposer la liste des alias des moteurs de recherche
            }
        }
    }

    // Emettre un signal pour sélectionner un moteur de recherche
    const selectSearchEngine = (searchEngine) => {
        dispatch('selectSearchEngine', {
            searchEngine: searchEngine
        })
    }

    // Emettre un signal pour désélectionner un moteur de recherche
    const deselectSearchEngine = (searchEngine) => {
        dispatch('deselectSearchEngine', {
            searchEngine: searchEngine
        })
    }

    // Emettre un signal pour désélectionner un moteur de recherche
    const replaceSearchEngine = (searchEngine) => {
        dispatch('replaceSearchEngine', {
            searchEngine: searchEngine
        })
    }

    // Emettre un signal pour mettre à jour la requête
    const updateQuery = (value) => {
        dispatch('updateQuery', {
            query: value
        })
    }
</script>