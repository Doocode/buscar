// Imports
import { listSearchProfiles }
    from '../Stores/search'
import { actionWhenOpeningSearchPage, startupSearchProfileId }
    from '../Stores/settings'



// Classe gérer les profils de recherche
export default class SearchProfilesManager {
    // Propriétés
    unsubscribe: Function
    searchProfiles = []



    // Constructeur
    constructor() {
        const that = this
        this.unsubscribe = listSearchProfiles.subscribe(v => that.searchProfiles = v)
    }



    // Méthodes
    // - Pour mettre fin aux souscriptions
    destroy() {
        this.unsubscribe()
    }

    // - Rechercher un élément à partir d'une liste d'ids
    findByListIds(listIds) {
        // Rechercher les items dans la liste
        return this.searchProfiles
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
    updateById(id, name, icon, searchEnginesIds, orderPresentation) {
        listSearchProfiles.updateByIndex(
            this.findIndexById(id),
            name, icon, searchEnginesIds, orderPresentation
        )
    }

    // - Supprimer un élément à partir de son id
    deleteById(id) {
        if (!isNaN(id))
            listSearchProfiles.deleteById(parseInt(id))
    }

    // - Rechercher l'index d'un élément à partir de son id
    findIndexById(id) {
        let index = -1
        this.searchProfiles.forEach((item, ii) => {
            if (parseInt(id) === parseInt(item.id))
                index = ii
        })
        return index
    }

    // - Définit un profil de recherche de démarrage à partir de son id
    setItemAsStartup(id) {
        actionWhenOpeningSearchPage.set("searchProfile")
        startupSearchProfileId.set(parseInt(id))
    }

    // - Définit une liste de moteurs de recherche à un profil de recherche existant
    setSearchEnginesToItem(id, listIds) {
        // Retrouver le profil de recherche
        let item = this.findById(id)

        // Traitement des erreurs
        if (item == null)
            return false

        // Traitement des paramètres
        let searchEngines = []
        listIds.forEach(n => searchEngines.push(parseInt(n)))

        // Mise à jour
        this.updateById(item.id, item.name, item.icon,
            searchEngines.sort(), item.orderPresentation)
        return true
    }
}