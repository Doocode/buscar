// Imports
import { listSearchEngines }
    from '../Stores/search'
import { actionWhenOpeningSearchPage, startupSearchEnginesIds }
    from '../Stores/settings'



// Classe gérer les moteurs de recherche
export default class SearchEnginesManager {
    // Propriétés
    unsubscribe: Function
    searchEngines = []



    // Constructeur
    constructor() {
        const that = this
        this.unsubscribe = listSearchEngines.subscribe(v => that.searchEngines = v)
    }



    // Méthodes
    // - Pour mettre fin aux souscriptions
    destroy() {
        this.unsubscribe()
    }

    // - Rechercher un élément à partir d'une liste d'ids
    findByListIds(listIds) {
        // Rechercher les items dans la liste
        return this.searchEngines
            .filter(item => listIds.indexOf(parseInt(item.id)) > -1)
    }

    // - Rechercher un élément à partir de l'id
    findById(id) {
        // Rechercher l'item dans la liste
        const results = this.findByListIds([id])

        // Retour du résultat
        if (results.length > 0)
            return results[0]
        return null
    }

    // - Mettre à jour un élément à partir de son id
    updateById(id, name, alias, icon, query, type) {
        listSearchEngines.updateByIndex(
            this.findIndexById(id),
            name, alias, icon, query, type
        )
    }

    // - Supprimer un élément à partir de son id
    deleteById(id) {
        if (!isNaN(id))
            listSearchEngines.deleteById(parseInt(id))
    }

    // - Rechercher l'index d'un élément à partir de son id
    findIndexById(id) {
        let index = -1
        this.searchEngines.forEach((item, ii) => {
            if (parseInt(id) === parseInt(item.id))
                index = ii
        })
        return index
    }

    // - Vérifie si l'alias est unique
    isAliasUnique(id, alias) {
        // Liste des conditions à vérifier
        const isSameAlias = item => item.alias.toLowerCase() == alias.toLowerCase()
        const isSameItem = item => parseInt(item.id) === parseInt(id)

        // Recherche
        const results = this.searchEngines
            .filter(item => isSameAlias(item) && !isSameItem(item))
        
        // Retour du résultat
        return results.length == 0
    }

    // - Définit une liste d'id comme moteurs de recherche de démarrage
    setListAsStartup(listIds) {
        actionWhenOpeningSearchPage.set("searchEngines")
        startupSearchEnginesIds.set(listIds)
    }
}