// Store pour les paramètres

// Imports
import { writable, readable } from 'svelte/store'



// INTERFACE
// - Contraste de l'interface : "white" | "g10" | "g80" | "g90" | "g100"
export const contrastMode = writable("g10");

// - Ambiances : choix proposés aux utilisateurs
export const ambiances = readable([
    { value: "white",   name: "Claire",         icon: "sun",    public: true },
    { value: "g10",     name: "Lumineuse",      icon: "sun",    public: true },
    { value: "g80",     name: "Gris clair",     icon: "moon",   public: true },
    { value: "g90",     name: "Sombre",         icon: "moon",   public: true },
    { value: "g100",    name: "Très sombre",    icon: "moon",   public: true },
]);
export const filterPublicAmbiances = a => a.public

// - Bouton "Retour" dans l'en-tête
export const allowHeaderBackButton = writable(false)



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