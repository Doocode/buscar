// Store pour les marque-pages

// Imports
import { writable }
    from 'svelte/store'
import BookmarkItem
    from '../Classes/Bookmarks/BookmarkItem'
import { BookmarkTypes }
    from '../Classes/Bookmarks/BookmarkType'
import { storeBookmarks }
    from '../Classes/Bookmarks/StoreBookmarks'



// Options sur la page d'accès rapide
// - Afficher les moteurs de recherche clickable en tant que lien
export const renderSearchEnginesAsLink = writable(true);

// - Afficher les profils de recherche clickable en tant que lien
export const renderSearchProfilesAsLink = writable(true);

// - Afficher le nom des éléments
export const displayTileName = writable(true);

// - Afficher un masque sur le libellé des tuiles
export const displayTileNameMask = writable(false);

// - Limiter le débordement du texte dans le libellé des tuiles
export const limitLabelTextOverflow = writable(true);



// - Liste des marque-pages
let bid = 1
export const listBookmarks = storeBookmarks([
])