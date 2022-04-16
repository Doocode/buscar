// Store pour les paramètres

// Imports
import { writable, readable } from 'svelte/store'



// INTERFACE
// - Mode de contraste de l'interface : custom / browser / planning
export const contrastMode = writable("custom");

// - Ambiances : choix proposés aux utilisateurs
export const ambiances = readable([
    { value: "white",   name: "Claire",         icon: "sun",    public: true,   dark: false },
    { value: "g10",     name: "Lumineuse",      icon: "sun",    public: true,   dark: false },
    //{ value: "g80",     name: "Gris clair",     icon: "moon",   public: false,  dark: true },
    { value: "g90",     name: "Sombre",         icon: "moon",   public: true,   dark: true },
    { value: "g100",    name: "Très sombre",    icon: "moon",   public: true,   dark: true },
])

// - Ambiance actuelle (pour le mode de contraste "custom")
export const customAmbiance = writable("g10");

// - Ambiance claire (pour le mode "Automatique")
export const defaultLightMode = writable("g10");

// - Ambiance sombre (pour le mode "Automatique")
export const defaultDarkMode = writable("g100");

// - Planning des ambiances
export const planningAmbiances = createAmbiancePlanning([
    { id: 1, ambiance: "g10", time: "8:00" },
    { id: 2, ambiance: "g100", time: "18:00" },
    /*{ id: 3, ambiance: "g90", time: "6:00" },
    { id: 4, ambiance: "white", time: "8:30" },
    { id: 5, ambiance: "g10", time: "15:00" },
    { id: 6, ambiance: "g90", time: "18:30" },
    { id: 7, ambiance: "g100", time: "20:00" },*/
]);

// - Bouton "Retour" dans l'en-tête
export const allowHeaderBackButton = writable(true)

// - Bouton "Accueil" dans l'en-tête
export const allowHeaderHomeButton = writable(true)



// RECHERCHE
// - Action au démarrage dans la page de recherche
export const actionWhenOpeningSearchPage = writable("searchProfile") // searchProfile - searchEngines - nothing

// - Le profil de recherche au démarrage
export const startupSearchProfileId = writable(1)

// - Les moteurs de recherche au démarrage
export const startupSearchEnginesIds = writable([1])

// - Ouvrir la recherche dans la page actuelle
export const openSearchInCurrentPage = writable(true)

// - Sélection mulitiple des moteurs de recherche
export const multiSelectionSearchEngines = writable(false)

// - Sélection mulitiple des moteurs de recherche
export const compactSearchBox = writable(false)

// - Limite max pour l'affichage des "bulles" des moteurs de recherche
export const maxDisplayBubble = writable(3)

// - Utilisation des alias des moteurs de recherche
export const enableSearchEngineAlias = writable(true)

// - Alias pour ajouter un moteur de recherche
export const aliasAddSearchEngine = writable("+")

// - Alias pour supprimer un moteur de recherche
export const aliasRemoveSearchEngine = writable("-")

// - Alias pour remplacer des moteurs de recherche
export const aliasReplaceSearchEngine = writable("!")

// - Activer les alias pour ajouter un moteur de recherche
export const enableAliasAddSearchEngine = writable(true)

// - Activer les alias pour supprimer un moteur de recherche
export const enableAliasRemoveSearchEngine = writable(true)

// - Activer les alias pour remplacer des moteurs de recherche
export const enableAliasReplaceSearchEngine = writable(true)

// - Activer la limite de sélection des moteurs de recherche
export const enableSelectSearchEnginesLimit = writable(true)

// - Valeur de la limite pour la sélection des moteurs de recherche
export const selectSearchEnginesLimitValue = writable(5)



// RÉGLAGES RAPIDES
// - Liste des réglages rapides
export const listQuickControls = createQuickControlsList([
    { id: 1, position: 1, visible: true, icon: "palette",
    longName: "Sélecteur d'ambiances", value:'ambianceSelector' },
    { id: 2, position: 2, visible: true, icon: "search",
    longName: "Largeur de la barre de recherche", value:'compactSearchBar' },
    { id: 3, position: 3, visible: true, icon: "compass",
    longName: "Alias des moteurs de recherche", value:'searchEnginesAlias' },
    { id: 4, position: 4, visible: false, icon: "circles",
    longName: "Limiter la sélection des moteurs", value:'limitSelectSearchEngines' },
    { id: 5, position: 5, visible: false, icon: "arrow_left",
    longName: "Afficher le bouton Retour", value:'backButton' },
])
// Store spécial pour les contrôles rapides
function createQuickControlsList(initial_value) {
    const { subscribe, set, update } = writable(initial_value);

    return {
        subscribe,
        toggleVisibility: (value) => {
            // Vérifier que la valeur existe
            let results = initial_value.filter(i => i.value == value)
            if (results.length != 1)
                return

            // Retrouver l'index
            let index = initial_value.indexOf(results[0])

            // Mise à jour
            update(list => {
                list[index].visible = !list[index].visible
                return list
            })
        },
        switchPosition: (valueA, valueB) => {
            // Vérifier que les valeurs existent
            let results = initial_value.filter(i => i.value == valueA || i.value == valueB)
            if (results.length != 2)
                return

            // Retrouver les index
            let indexA = initial_value.indexOf(results[0])
            let indexB = initial_value.indexOf(results[1])

            // Mise à jour
            update(list => {
                let posA = list[indexA].position
                //let posB = list[indexB].position
                list[indexA].position = list[indexB].position
                list[indexB].position = posA
                return list
            })
        },
        reset: () => set(initial_value)
    };
}



// Store spécial pour les ambiances planifiées
function createAmbiancePlanning(initial_value) {
    const { subscribe, set, update } = writable(initial_value);

    return {
        subscribe,
        addItem: (time, ambiance) => {
            // Vérifier les arguments
            let splitTime = time.split(':')
            if (splitTime.length != 2 || isNaN(splitTime[0]) || isNaN(splitTime[1]))
                return
            // TODO: Vérifier si heure/minutes sont valides (h<24 min<60 etc.)

            // Formatage du temps
            time = parseInt(splitTime[0]) + ":" + parseInt(splitTime[1])
            if (parseInt(splitTime[1]) == 0)
                time = parseInt(splitTime[0]) + ":0" + parseInt(splitTime[1])

            // Ajouter dans la liste
            update(list => [...list, {
                id: list.at(-1).id + 1,
                time: time,
                ambiance: ambiance
            }])
        },
        updateById: (id, values) => {
            update(list => {
                // Vérifier que l'id existe
                let results = list.filter(a => a.id == id)
                if (results.length != 1)
                    return list

                // Retrouver l'index
                let index = list.indexOf(results[0])

                // Mettre à jour les propriétés
                //  - Heure
                if (typeof(values.time) === "string") {
                    // Vérifier l'heure
                    let splitTime = values.time.split(':')
                    if (splitTime.length != 2 || isNaN(splitTime[0]) || isNaN(splitTime[1]))
                        return
                    // TODO: Vérifier si heure/minutes sont valides (h<24 min<60 etc.)
        
                    // Formatage du temps
                    let time = parseInt(splitTime[0]) + ":" + parseInt(splitTime[1])
                    if (parseInt(splitTime[1]) == 0)
                        time = parseInt(splitTime[0]) + ":0" + parseInt(splitTime[1])

                    list[index].time = time
                }
                //  - Ambiance
                if (typeof(values.ambiance) === "string")
                    list[index].ambiance = values.ambiance

                return list
            })
        },
        deleteById: (id) => {
            update(list => list.filter(item => parseInt(item.id) !== parseInt(id)))
        },
        reset: () => set(initial_value)
    };
}