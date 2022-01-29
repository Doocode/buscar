// Store pour les paramètres

// Imports
import { writable } from 'svelte/store';



// INTERFACE
// - Contraste de l'interface : "white" | "g10" | "g80" | "g90" | "g100"
export const contrastMode = writable("g10");

// - Bouton "Retour" dans l'en-tête
export const allowHeaderBackButton = writable(false);



// RECHERCHE
// - Ouvrir la recherche dans la page actuelle
export const openSearchInCurrentPage = writable(true);

// - Sélection mulitiple des moteurs de recherche
export const multiSelectionSearchEngines = writable(false);

// - Limite max pour l'affichage des "bulles" des moteurs de recherche
export const maxDisplayBubble = writable(3);