// Store pour la recherche (et les moteurs de recherche)

// Imports
import { writable } from 'svelte/store'
import { SearchEngine, SearchEngineType } from '../Classes/SearchEngine'

// Store personnalisé : https://svelte.dev/tutorial/custom-stores
// - Liste des moteurs de recherche
function createSearchEngineList(initial_value) {
    const { subscribe, set, update } = writable(initial_value);

    return {
        subscribe,
        add: (name, icon, query, type) => { // Ajouter un élément
            // Partir de l'état actuel de la liste pour ajouter à la fin : https://svelte.dev/tutorial/updating-arrays-and-objects
            update(list => [
                ...list, 
                new SearchEngine(parseInt(list.at(-1).id) + 1, name, type, icon, query)
            ]);
        },
        updateByIndex: (index, name, icon, query, type) => { // Mettre à jour un item
            update(list => {
                list[index] = new SearchEngine(list[index].id, name, type, icon, query)
                return list
            });
        },
        deleteById: (id) => { // Supprimer un élément en utilisant son id
            update(list => list.filter(item => parseInt(item.id) !== parseInt(id)))
        },
        reset: () => set(initial_value)
    };
}

// - Liste des profils de recherche
function createSearchProfileList(initial_value) {
    const { subscribe, set, update } = writable(initial_value);

    return {
        subscribe,
        add: (name, icon, searchEnginesIds, orderPresentation) => { // Ajouter un élément
            update(list => [...list, {
                id: list.at(-1).id + 1,
                name: name, icon: icon,
                orderPresentation: orderPresentation,
                searchEnginesIds: searchEnginesIds,
            }]);
        },
        updateByIndex: (index, name, icon, searchEnginesIds, orderPresentation) => { // Mettre à jour un item
            update(list => {
                list[index] = {
                    id: list[index].id,
                    name: name, icon: icon,
                    orderPresentation: orderPresentation,
                    searchEnginesIds: searchEnginesIds,
                };
                return list
            });
        },
        deleteById: (id) => { // Supprimer un élément en utilisant son id
            update(list => list.filter(item => parseInt(item.id) !== parseInt(id)))
        },
        reset: () => set(initial_value)
    };
}



// Types de moteurs de recherche
export const SearchEngineTypes = {
    web: new SearchEngineType(1, "Web", "web"),
    images: new SearchEngineType(2, "Images", "image"),
    videos: new SearchEngineType(3, "Videos", "play"),
    music: new SearchEngineType(4, "Musique", "music"),
    files: new SearchEngineType(5, "Fichiers", "file"),
    mails: new SearchEngineType(6, "Mails", "mail"),
    news: new SearchEngineType(7, "Presse", "blog"),
    shop: new SearchEngineType(8, "Achats", "shopping"),
}



// Profils de recherche
export const listSearchProfiles = createSearchProfileList([
    {
        id: 1, name: "Général", icon: "web",
        orderPresentation: 1, searchEnginesIds: [1]
    },
    {
        id: 2, name: "Images", icon: "image",
        orderPresentation: 2, searchEnginesIds: [7, 8, 9]
    },
    {
        id: 3, name: "Vidéos", icon: "play",
        orderPresentation: 3, searchEnginesIds: []
    },
    {
        id: 4, name: "Musiques", icon: "music",
        orderPresentation: 4, searchEnginesIds: []
    },
    {
        id: 5, name: "Mails", icon: "mail",
        orderPresentation: 5, searchEnginesIds: []
    },
])

// Moteurs de recherche
export const listSearchEngines = createSearchEngineList([
    new SearchEngine(1, "Google", SearchEngineTypes.web, 
        "/assets/search-engines/google.png", 
        "https://www.google.fr/search?q=%query%"),
    new SearchEngine(2, "Bing", SearchEngineTypes.web,
        "/assets/search-engines/bing.png",
        "https://www.bing.com/search?q=%query%"),
    new SearchEngine(3, "Qwant", SearchEngineTypes.web,
        "/assets/search-engines/qwant.png",
        "https://www.qwant.com/?q=%query%"),
    new SearchEngine(4, "DuckDuckGo", SearchEngineTypes.web,
        "/assets/search-engines/duckduckgo.png",
        "https://duckduckgo.com/?q=%query%"),
    new SearchEngine(5, "Ecosia", SearchEngineTypes.web,
        "/assets/search-engines/ecosia.png",
        "https://www.ecosia.org/search?q=%query%"),
    new SearchEngine(6, "Yandex", SearchEngineTypes.web,
        "/assets/search-engines/yandex.png",
        "https://yandex.com/search/?text=%query%"),

    new SearchEngine(7, "Google Images", SearchEngineTypes.images,
        "/assets/search-engines/google.png",
        "https://www.google.fr/search?q=%query%&tbm=isch"),
    new SearchEngine(8, "Bing Images", SearchEngineTypes.images,
        "/assets/search-engines/bing.png",
        "https://www.bing.com/images/search?q=%query%"),
    new SearchEngine(9, "Qwant Images", SearchEngineTypes.images,
        "/assets/search-engines/qwant.png",
        "https://www.qwant.com/?t=images&q=%query%"),
    new SearchEngine(10, "DuckDuckGo Images", SearchEngineTypes.images,
        "/assets/search-engines/duckduckgo.png",
        "https://duckduckgo.com/?t=ffab&q=%query%&iax=images&ia=images"),
    new SearchEngine(11, "Ecosia Images", SearchEngineTypes.images,
        "/assets/search-engines/ecosia.png",
        "https://www.ecosia.org/images?q=%query%"),
    new SearchEngine(12, "Yandex Images", SearchEngineTypes.images,
        "/assets/search-engines/yandex.png",
        "https://yandex.com/images/search?text=%query%"),
])