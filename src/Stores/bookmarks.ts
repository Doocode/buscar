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
// - Afficher les dossiers clickable en tant que lien
export const renderFolderAsLink = writable(true);

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
    new BookmarkItem(bid++, "Tendances - Twitter", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'cover', iconBgColor: '#00aced',
        icon: 'https://search.doocode.xyz/res/img/motors/twitter.png',
        url: 'https://twitter.com/i/trends'
    }, bid-2),
    new BookmarkItem(bid++, "Google", BookmarkTypes.searchEngine, {
        icon: '/assets/search-engines/google.png', id: 1
    }, bid-2),
    new BookmarkItem(bid++, "Clubic", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'cover', iconBgColor: '#ff0000',
        icon: 'https://www.clubic.com/apple-touch-icon.png',
        url: 'https://www.clubic.com/'
    }, bid-2),
    new BookmarkItem(bid++, "Doocode", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'medium', iconBgColor: '#163b55',
        icon: 'https://www.doocode.xyz/res/img/favicon.png',
        url: 'https://www.doocode.xyz/'
    }, bid-2),
    new BookmarkItem(bid++, "Doosearch", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'medium', iconBgColor: '#AFC800',
        icon: 'https://search.doocode.xyz/res/img/favicon.png',
        url: 'https://search.doocode.xyz/'
    }, bid-2),
    new BookmarkItem(bid++, "Buscar", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'cover', iconBgColor: '#AF074A',
        icon: '/assets/pwa-icons/maskable_icon.png',
        url: '/#/'
    }, bid-2),
    new BookmarkItem(bid++, "Color - CDS", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'medium', iconBgColor: '#ffffff',
        icon: 'https://carbondesignsystem.com/icons/icon-512x512.png',
        url: 'https://carbondesignsystem.com/guidelines/color/usage/'
    }, bid-2),
    new BookmarkItem(bid++, "Svelte Carbon Components", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'small', iconBgColor: '#ffffff',
        icon: 'https://carbon-components-svelte.onrender.com/favicon.ico',
        url: 'https://carbon-components-svelte.onrender.com/'
    }, bid-2),
    new BookmarkItem(bid++, "GitHub", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'medium', iconBgColor: '#1e2327',
        icon: 'https://github.com/fluidicon.png',
        url: 'https://www.github.com/'
    }, bid-2),
    new BookmarkItem(bid++, "Svelte", BookmarkTypes.website, {
        iconType: 'image', iconImageFormat: 'medium', iconBgColor: '#ffffff',
        icon: 'https://svelte.io/favicon.png',
        url: 'https://svelte.io/'
    }, bid-2),
])