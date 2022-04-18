// Store pour les images de fond d'écran

// Imports
import { readable } from 'svelte/store'
import { BackgroundImage, BackgroundImageType, storeBgImgList } from '../Classes/BackgroundImage'



// Types de fond d'écran
export const BackgroundImageTypes = {
    pc: new BackgroundImageType(1, "Taille standard", "screen"),
    smartphone: new BackgroundImageType(2, "Smartphone", "smartphone"),
}



// Liste des icônes
let bgId = 1
export const listBgImgs = storeBgImgList([
    new BackgroundImage(bgId++, "Poisson dans l'eau",
        "https://www.doocode.xyz/res/img/backgrounds/DCG6.png", [
        BackgroundImageTypes.pc
    ]),
    new BackgroundImage(bgId++, "Dégradé bleu magenta",
        "https://www.doocode.xyz/res/img/backgrounds/DCG28.png", [
        BackgroundImageTypes.pc
    ]),
    new BackgroundImage(bgId++, "Full love",
        "https://www.doocode.xyz/res/img/backgrounds/DCG31.png", [
        BackgroundImageTypes.pc
    ]),
    new BackgroundImage(bgId++, "Dégradé Sunset",
        "https://www.doocode.xyz/res/img/backgrounds/DCG32.png", [
        BackgroundImageTypes.pc
    ]),
    new BackgroundImage(bgId++, "Cercles",
        "https://www.doocode.xyz/res/img/backgrounds/DCG33.png", [
        BackgroundImageTypes.pc
    ]),
    new BackgroundImage(bgId++, "Paysage imaginaire",
        "https://www.doocode.xyz/res/img/backgrounds/DCG34.png", [
        BackgroundImageTypes.pc
    ]),
]);