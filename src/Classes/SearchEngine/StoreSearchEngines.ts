// Imports
import { writable } from 'svelte/store'
import SearchEngine from './SearchEngine'
import type SearchEngineType from './SearchEngineType'



// Store spécial pour les marque-pages
export const storeSearchEngines = initial_value => {
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
            alias: string,
            icon: string,
            query: string,
            type: SearchEngineType,
        ) => {
            update(list => {
                // Calcul de l'id
                const results = list.sort((a, b) => a.id - b.id)
                const id = results.length == 0 ? 1 : results.at(-1).id + 1

                // Ajout dans la liste
                return [...list,
                    new SearchEngine(id, name, alias, type, icon, query)
                ]
            })
        },



        // Mettre à jour un élément
        updateById: (
            id: number,
            name: string,
            alias: string,
            icon: string,
            query: string,
            type: SearchEngineType,
        ) => {
            update(list => {
                // Recherche de l'index
                const index = findIndexById(list, id)
                if (index == -1)
                    return list

                // Mise à jour des propriétés
                list[index].name = name
                list[index].type = type
                list[index].icon = icon
                list[index].alias = alias
                list[index].queryUrl = query
                return list
            })
        },



        // Supprimer un élément
        deleteById: id => {
            update(list => {
                // Retirer l'item à éliminer
                return list.filter(item => parseInt(item.id) !== parseInt(id))
            })
        },



        // Réinitialiser la liste
        reset: () => set(initial_value)
    }
}