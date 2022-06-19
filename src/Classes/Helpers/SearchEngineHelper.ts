// Imports
import { actionWhenOpeningSearchPage, startupSearchEnginesIds }
    from '../../Stores/settings'
import type SearchEngine
    from '../SearchEngine/SearchEngine'



export default class SearchEnginesHelper {
    // Méthodes
    // - Retrouver des items à partir d'une liste d'id
    findByListIds(listId: Array<number>, listSearchEngines: Array<SearchEngine>) {
        // Rechercher les items dans la liste
        return listSearchEngines
            .filter(item => listId.indexOf(item.id) > -1)
    }

    // - Retrouver un item à partir de son id
    findById(id: number, listSearchEngines: Array<SearchEngine>) {
        // Rechercher l'item dans la liste
        const results = this.findByListIds([id], listSearchEngines)

        // Retour du résultat
        if (results.length > 0)
            return results[0]
        return null
    }



    // - Vérifier si l'alias est unique
    isAliasUnique(searchEngineList: Array<SearchEngine>, id: number, alias: string) {
        // Liste des conditions à vérifier
        const isSameAlias = item => item.alias.toLowerCase() == alias.toLowerCase()
        const isSameItem = item => item.id === id

        // Rechercher s'il y a des éléments similaires
        const results = searchEngineList
            .filter(item => isSameAlias(item) && !isSameItem(item))

        // Retour du résultat
        return results.length == 0
    }



    // - Définir une liste d'id comme sélection de moteurs au démarrage
    setListAsStartupSelection(listId: Array<number>) {
        actionWhenOpeningSearchPage.set("searchEngines")
        startupSearchEnginesIds.set(listId)
    }
}