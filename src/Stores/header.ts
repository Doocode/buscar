// Store pour la barre de titre

// Imports
import { writable } from 'svelte/store'



// Titre de la page actuelle
export const pageName = writable("Page sans nom")

// Icône de la page actuelle
export const pageIcon = writable("file")

// Barre de titre invisible (titre et fond masqué)
export const transparentHeader = writable(false)