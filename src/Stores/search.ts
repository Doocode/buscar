// Store pour la recherche (et les moteurs de recherche)

// Imports
import { writable }
    from 'svelte/store'
import SearchEngine
    from '../Classes/SearchEngine/SearchEngine'
import { SearchEngineTypes }
    from '../Classes/SearchEngine/SearchEngineType'
import { storeSearchEngines }
    from '../Classes/SearchEngine/StoreSearchEngines'



// Store personnalisé : https://svelte.dev/tutorial/custom-stores
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
export const listSearchEngines = storeSearchEngines([
    new SearchEngine(1, "Google", "g", SearchEngineTypes.web, 
        "/assets/search-engines/google.png", 
        "https://www.google.fr/search?q=%query%"),
    new SearchEngine(2, "Bing", "b", SearchEngineTypes.web,
        "/assets/search-engines/bing.png",
        "https://www.bing.com/search?q=%query%"),
    new SearchEngine(3, "Qwant", "q", SearchEngineTypes.web,
        "/assets/search-engines/qwant.png",
        "https://www.qwant.com/?q=%query%"),
    new SearchEngine(4, "DuckDuckGo", "d", SearchEngineTypes.web,
        "/assets/search-engines/duckduckgo.png",
        "https://duckduckgo.com/?q=%query%"),
    new SearchEngine(5, "Ecosia", "e", SearchEngineTypes.web,
        "/assets/search-engines/ecosia.png",
        "https://www.ecosia.org/search?q=%query%"),
    new SearchEngine(6, "Yandex", "yx", SearchEngineTypes.web,
        "/assets/search-engines/yandex.png",
        "https://yandex.com/search/?text=%query%"),

    new SearchEngine(7, "Google Images", "gi", SearchEngineTypes.images,
        "/assets/search-engines/google.png",
        "https://www.google.fr/search?q=%query%&tbm=isch"),
    new SearchEngine(8, "Bing Images", "bi", SearchEngineTypes.images,
        "/assets/search-engines/bing.png",
        "https://www.bing.com/images/search?q=%query%"),
    new SearchEngine(9, "Qwant Images", "qi", SearchEngineTypes.images,
        "/assets/search-engines/qwant.png",
        "https://www.qwant.com/?t=images&q=%query%"),
    new SearchEngine(10, "DuckDuckGo Images", "di", SearchEngineTypes.images,
        "/assets/search-engines/duckduckgo.png",
        "https://duckduckgo.com/?t=ffab&q=%query%&iax=images&ia=images"),
    new SearchEngine(11, "Ecosia Images", "ei", SearchEngineTypes.images,
        "/assets/search-engines/ecosia.png",
        "https://www.ecosia.org/images?q=%query%"),
    new SearchEngine(12, "Yandex Images", "yxi", SearchEngineTypes.images,
        "/assets/search-engines/yandex.png",
        "https://yandex.com/images/search?text=%query%"),
])