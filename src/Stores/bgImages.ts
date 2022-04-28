// Store pour les images de fond d'écran

// Imports
import { readable, writable }
    from 'svelte/store'
import { BackgroundImage, BackgroundImageType, storeBgImgList }
    from '../Classes/BackgroundImage'



// Paramètres
// - Position de l'image d'arrière plan
export const bgPositionKeywordX = writable('center')
export const bgPositionKeywordY = writable('center')
export const bgShiftFlagX = writable(false)
export const bgShiftFlagY = writable(false)
export const bgShiftValueX = writable(0)
export const bgShiftValueY = writable(0)
export const bgShiftUnitX = writable('px')
export const bgShiftUnitY = writable('px')

// - Taille de l'image d'arrière plan
export const bgSizeKeyword = writable('cover')
export const bgWidthValue = writable(50)
export const bgHeightValue = writable(50)
export const bgWidthUnit = writable('%')
export const bgHeightUnit = writable('%')
export const bgHeightValueEnabled = writable(false)

// - Répéter l'image d'arrière plan
export const bgRepeat = writable('repeat')



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