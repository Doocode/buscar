// Store pour les icônes

// Imports
import { readable } from 'svelte/store'



// Liste des icônes
export const listIcons = readable([
    { value: "agenda", name: "Agenda" },
    { value: "align_center", name: "Aligner au centre" },
    { value: "align_left", name: "Aligner à gauche" },
    { value: "align_right", name: "Aligner à droite" },
    { value: "align_justify", name: "Aligner en justifié" },
    { value: "apps", name: "Applications" },
    { value: "arrow_up", name: "Flèche vers le haut" },
    { value: "arrow_down", name: "Flèche vers le bas" },
    { value: "arrow_left", name: "Flèche de gauche" },
    { value: "arrow_right", name: "Flèche vers la droite" },
    { value: "arrow_diagonal_1", name: "Flèche vers le nord-est" },
    { value: "arrow_diagonal_2", name: "Flèche vers le sud_est" },
    { value: "arrow_diagonal_3", name: "Flèche vers le nord-ouest" },
    { value: "arrow_diagonal_4", name: "Flèche vers le sud-ouest" },
    { value: "bag", name: "Travail" },
    { value: "bell", name: "Cloche" },
    { value: "bin", name: "Poubelle" },
    { value: "blog", name: "Actus" },
    { value: "blur", name: "Flouter" },
    { value: "bookmark", name: "Marque-page" },
    { value: "chat", name: "Chat" },
    { value: "check", name: "Check" },
    { value: "checkbox", name: "Case à cocher" },
    { value: "checkbox_indeterminate", name: "Case à cocher indéterminéé" },
    { value: "circle", name: "Rond" },
    { value: "circles", name: "Cercles" },
    { value: "clock", name: "Horloge" },
    { value: "cloud", name: "Nuage" },
    { value: "compass", name: "Boussole" },
    { value: "config", name: "Configuration" },
    { value: "contrast", name: "Contraste" },
    { value: "critical", name: "Critique" },
    { value: "cursor_select", name: "Curseur de sélection" },
    { value: "crop_free", name: "Non recardrer" },
    { value: "cross", name: "Croix" },
    { value: "details", name: "Détails" },
    { value: "dice", name: "Dé" },
    { value: "disable", name: "Interdit" },
    { value: "download", name: "Télécharger" },
    { value: "dropdown", name: "Descendre" },
    { value: "duplicate", name: "Dupliquer" },
    { value: "expand", name: "Agrandir" },
    { value: "experiment", name: "Chimie" },
    { value: "eye", name: "Oeil" },
    { value: "file", name: "Fichier" },
    { value: "filter", name: "Entonnoir" },
    { value: "flag", name: "Drapeau" },
    { value: "folder", name: "Dossier" },
    { value: "folder_close", name: "Dossier fermé" },
    { value: "folder_open", name: "Dossier ouvert" },
    { value: "heart", name: "Cœur" },
    { value: "hide", name: "Masquer" },
    { value: "home", name: "Accueil" },
    { value: "house", name: "Maison" },
    { value: "image", name: "Image" },
    { value: "info", name: "Information" },
    { value: "inline_dots", name: "Points alignés" },
    { value: "input", name: "Entrée" },
    { value: "joystick", name: "Manette de jeu" },
    { value: "labo", name: "Plot" },
    { value: "layers", name: "Calques" },
    { value: "line", name: "Ligne" },
    { value: "link", name: "Lien" },
    { value: "lock", name: "Verrou" },
    { value: "mail", name: "Mail" },
    { value: "menu", name: "Menu hamburger" },
    { value: "menu_dots", name: "Menu à points" },
    { value: "moon", name: "Lune" },
    { value: "mouse", name: "Souris d'ordinateur" },
    { value: "music", name: "Musique" },
    { value: "network", name: "Réseau" },
    { value: "output", name: "Sortie" },
    { value: "palette", name: "Palette" },
    { value: "palette_filled", name: "Palette 2" },
    { value: "pause", name: "Pause" },
    { value: "pencil", name: "Crayon" },
    { value: "pie_chart", name: "Camembert" },
    { value: "pin", name: "Epingler" },
    { value: "planet", name: "Planète" },
    { value: "play", name: "Lecture" },
    { value: "plus", name: "Plus" },
    { value: "profile", name: "Profil" },
    { value: "program", name: "Programme" },
    { value: "project", name: "Boite" },
    { value: "radiobox", name: "Boite radio" },
    { value: "redo", name: "Refaire" },
    { value: "reload", name: "Recharger" },
    { value: "rename", name: "Renommer" },
    { value: "rotate", name: "Rotation" },
    { value: "save", name: "Enregistrer" },
    { value: "screen", name: "Ecran de PC" },
    { value: "script", name: "Script" },
    { value: "search", name: "Loupe" },
    { value: "search_group", name: "Profil de recherche" },
    { value: "select_all", name: "Sélectionner tout" },
    { value: "send", name: "Envoyer" },
    { value: "settings", name: "Réglages" },
    { value: "shapes", name: "Formes" },
    { value: "shopping", name: "Shopping" },
    { value: "slideshow", name: "Présentation" },
    { value: "smartphone", name: "Smartphone" },
    { value: "sort", name: "Trier" },
    { value: "square", name: "Carré" },
    { value: "squares", name: "Petits carrés" },
    { value: "star", name: "Etoile" },
    { value: "star_filled", name: "Etoile 2" },
    { value: "stop", name: "Stop" },
    { value: "sun", name: "Soleil" },
    { value: "system_update", name: "Mise à jour système" },
    { value: "target", name: "Cible" },
    { value: "television", name: "Télévision" },
    { value: "undo", name: "annuler" },
    { value: "unlock", name: "Déverrouiller" },
    { value: "unpin", name: "Désépingler" },
    { value: "upload", name: "Importer" },
    { value: "warning", name: "Danger" },
    { value: "web", name: "Web" },
]);