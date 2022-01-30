// Store pour la recherche (et les moteurs de recherche)

// Imports
import { writable } from 'svelte/store';



// Store personnalisé : https://svelte.dev/tutorial/custom-stores
function createSearchEngineList(initial_value) {
    const { subscribe, set, update } = writable(initial_value);

    return {
        subscribe,
        add: (name, icon, query, type) => { // Ajouter un élément
            // Partir de l'état actuel de la liste pour ajouter à la fin : https://svelte.dev/tutorial/updating-arrays-and-objects
            update(list => [...list, {
                id: list.at(-1).id + 1, type: type,
                name: name, icon: icon, query: query,
            }]);
        },
        updateByIndex: (index, name, icon, query, type) => { // Mettre à jour un item
            update(list => {
                list[index] = {
                    id: list[index].id, type: type,
                    name: name, icon: icon, query: query,
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
export const SearchEngineType = {
    web: "web",
    images: "images",
    videos: "videos",
    music: "music",
    files: "files",
    mails: "mails",
    news: "news",
};



// Moteurs de recherche
export const listSearchEngines = createSearchEngineList([
    {
        id: 1, name: "Google", type: SearchEngineType.web,
        icon: "/assets/search-engines/google.png",
        query: "https://www.google.fr/search?q=%query%"
    },
    {
        id: 2, name: "Bing", type: SearchEngineType.web,
        icon: "/assets/search-engines/bing.png",
        query: "https://www.bing.com/search?q=%query%"
    },
    {
        id: 3, name: "Qwant", type: SearchEngineType.web,
        icon: "/assets/search-engines/qwant.png",
        query: "https://www.qwant.com/?q=%query%"
    },
    {
        id: 4, name: "DuckDuckGo", type: SearchEngineType.web,
        icon: "/assets/search-engines/duckduckgo.png",
        query: "https://duckduckgo.com/?q=%query%"
    },
    {
        id: 5, name: "Ecosia", type: SearchEngineType.web,
        icon: "/assets/search-engines/ecosia.png",
        query: "https://www.ecosia.org/search?q=%query%"
    },
    /*{
        id: 6, name: "Lilo", type: SearchEngineType.web,
        icon: "/assets/search-engines/lilo.png",
        query: "https://search.lilo.org/?q=%query%"
    },*/
    {
        id: 7, name: "Yandex", type: SearchEngineType.web,
        icon: "/assets/search-engines/yandex.png",
        query: "https://yandex.com/search/?text=%query%"
    },

    {
        id: 8, name: "Google Images", type: SearchEngineType.images,
        icon: "/assets/search-engines/google.png",
        query: "https://www.google.fr/search?q=%query%&tbm=isch"
    },
    {
        id: 9, name: "Bing Images", type: SearchEngineType.images,
        icon: "/assets/search-engines/bing.png",
        query: "https://www.bing.com/images/search?q=%query%"
    },
    {
        id: 10, name: "Qwant Images", type: SearchEngineType.images,
        icon: "/assets/search-engines/qwant.png",
        query: "https://www.qwant.com/?t=images&q=%query%"
    },
    {
        id: 11, name: "DuckDuckGo Images", type: SearchEngineType.images,
        icon: "/assets/search-engines/duckduckgo.png",
        query: "https://duckduckgo.com/?t=ffab&q=%query%&iax=images&ia=images"
    },
    {
        id: 12, name: "Ecosia Images", type: SearchEngineType.images,
        icon: "/assets/search-engines/ecosia.png",
        query: "https://www.ecosia.org/images?q=%query%"
    },
    {
        id: 13, name: "Yandex Images", type: SearchEngineType.images,
        icon: "/assets/search-engines/yandex.png",
        query: "https://yandex.com/images/search?text=%query%"
    },
]);
