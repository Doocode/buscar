// Formater des propriétés CSS pour l'arrière plan
export class BackgroundImageStyle {
    // Constructeur
    constructor() {}



    // Méthodes
    // - Retourne le CSS interprété de la propriété 'background-position' à partir des arguments reçues
    formatPosition(keywordX, keywordY, shiftFlagX, shiftFlagY, shiftValueX, shiftValueY, shiftUnitX, shiftUnitY) {
        let css = ''

        // Axe horizontal
        if ((shiftFlagX && shiftUnitX != '%') || !shiftFlagX) // Ne pas placer le mot clé 'left' ou 'right' si unitX == %
            css += keywordX + ' '
        if (shiftFlagX && keywordX != 'center') // Si le décalage est précisé
            css += shiftValueX + shiftUnitX + ' '

        // Axe vertical
        if ((shiftFlagY && shiftUnitY != '%') || !shiftFlagY) // Ne pas placer le mot clé 'top' ou 'bottom' si unitY == %
            css += keywordY + ' '
        if (shiftFlagY && keywordY != 'center') // Si le décalage est précisé
            css += shiftValueY + shiftUnitY + ' '

        return css
    }

    // - Retourne le CSS interprété de la propriété 'background-size' à partir des arguments reçues
    formatSize(keyword, widthValue, widthUnit, heightValueEnabled, heightValue, heightUnit) {
        let css = ''

        if (['cover', 'contain'].includes(keyword))
            css += keyword
        else {
            css += widthValue + widthUnit
            if (heightValueEnabled)
                css += ' ' + heightValue + heightUnit
        }

        return css
    }
}