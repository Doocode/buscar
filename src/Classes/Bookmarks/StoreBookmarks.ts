// Imports
import { writable } from 'svelte/store'
import BookmarkItem from './BookmarkItem'
import bookmarksHelper from '../Helpers/BookmarksHelper'
import type BookmarkType from './BookmarkType'



// Store spécial pour les marque-pages
export const storeBookmarks = initial_value => {
    const { subscribe, set, update } = writable(initial_value)



    // Définitions de petites fonctions utiles pour gérer le store
    const findItemById = (list, id) => {
        const results = list.filter(item => parseInt(item.id) == id)
        if (results.length == 0)
            return null
        return results[0]
    }
    const findIndexById = (list, id) => {
        const item = findItemById(list, id)
        if (item == null)
            return -1
        return list.indexOf(item)
    }



    return {
        // Souscrire
        subscribe,



        // Ajouter un élément
        add: (
            name: string, 
            type: BookmarkType,
            data: any,
            //previousId?: number
            folderId?: number
        ) => {
            update(list => {
                // Calcul de l'id
                const results = list.sort((a, b) => a.id - b.id)
                const id = results.length == 0 ? 1 : results.at(-1).id + 1

                // Calcul de l'id du voisin
                const chain = bookmarksHelper.buildChain(list, 1000, folderId)
                const previousId = chain.length == 0 ? null : chain.at(-1).id

                // Ajout dans la liste
                return [...list,
                    new BookmarkItem(id, name, type, data, previousId, folderId)
                ]
            })
        },



        // Mettre à jour un élément
        updateById: (
            id: number,
            name: string,
            type: BookmarkType,
            data: any,
            previousId?: number
        ) => {
            update(list => {
                // Recherche de l'index
                const index = findIndexById(list, id)
                if (index == -1)
                    return list

                // Mise à jour des propriétés
                list[index].name = name
                list[index].type = type
                list[index].data = data
                list[index].prepreviousId =previousId
                return list
            })
        },



        // Supprimer un élément
        deleteById: id => {
            update(list => {
                // Recherche de l'item à supprimer
                const itemToDelete = findItemById(list, id)
                if (itemToDelete == null)
                    return list

                // Chercher un éventuel voisin de l'item
                const results = list.filter(
                    item => parseInt(item.previousId) === parseInt(id)
                )
                // Mise à jour des voisins des items
                if (results.length > 0) {
                    const index = list.indexOf(results[0])
                    list[index].previousId = itemToDelete.previousId
                }

                // Retirer l'item à éliminer
                return list.filter(item => parseInt(item.id) !== parseInt(id))
            })
        },



        // Réinitialiser la liste
        reset: () => set(initial_value)
    }
}