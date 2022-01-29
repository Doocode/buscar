// Store pour les paramètres

// Imports
import { writable, readable } from 'svelte/store';



// INTERFACE
// - Contraste de l'interface : "white" | "g10" | "g80" | "g90" | "g100"
export const contrastMode = writable("g10");

// - Ambiances : choix proposés aux utilisateurs
export const ambiances = readable([
    { value: "white",   name: "Claire",         icon: "sun",    public: false },
    { value: "g10",     name: "Lumineuse",      icon: "sun",    public: true },
    { value: "g80",     name: "Gris clair",     icon: "moon",   public: false },
    { value: "g90",     name: "Sombre",         icon: "moon",   public: false },
    { value: "g100",    name: "Très sombre",    icon: "moon",   public: true },
]);
export const filterPublicAmbiances = (a) => {
    return a.public;
}

// - Bouton "Retour" dans l'en-tête
export const allowHeaderBackButton = writable(false);



// RECHERCHE
// - Ouvrir la recherche dans la page actuelle
export const openSearchInCurrentPage = writable(true);

// - Sélection mulitiple des moteurs de recherche
export const multiSelectionSearchEngines = writable(false);

// - Limite max pour l'affichage des "bulles" des moteurs de recherche
export const maxDisplayBubble = writable(3);