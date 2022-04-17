// Imports
import { listBgImgs }
    from '../Stores/bgImages'
import { backgroundType, backgroundImage }
    from '../Stores/settings'



// Classe gérer les fonds d'écran
export default class BgImagesManager {
    // Propriétés
    unsubscribe: Function
    backgroundImages = []



    // Constructeur
    constructor() {
        const that = this
        this.unsubscribe = listBgImgs.subscribe(v => that.backgroundImages = v)
    }



    // Méthodes
    // - Pour mettre fin aux souscriptions
    destroy() {
        this.unsubscribe()
    }

    // - Rechercher un élément à partir de l'id
    findById(id) {
        // Rechercher l'item dans la liste
        const results = this.backgroundImages
            .filter(item => parseInt(item.id) == parseInt(id))

        // Retour du résultat
        if (results.length > 0)
            return results[0]
        return null
    }

    // - Mettre à jour un élément à partir de son id
    updateById(id, name, url, type) {
        listBgImgs.updateByIndex(
            this.findIndexById(id),
            name, url, type
        )
    }

    // - Supprimer un élément à partir de son id
    deleteById(id) {
        if (!isNaN(id))
            listBgImgs.deleteById(parseInt(id))
    }

    // - Rechercher l'index d'un élément à partir de son id
    findIndexById(id) {
        let index = -1
        this.backgroundImages.forEach((item, ii) => {
            if (parseInt(id) === parseInt(item.id))
                index = ii
        })
        return index
    }

    // - Définit une image d'arrière plan
    setAsBackground(id) {
        backgroundType.set("image")
        backgroundImage.set(id)
    }
}