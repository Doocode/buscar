<script>
    // Imports
    import { backgroundType, backgroundColor, backgroundImage }
        from '../Stores/settings'
    import { listBgImgs, bgRepeat, bgSizeKeyword, bgWidthValue,
        bgWidthUnit, bgHeightValueEnabled, bgHeightValue, bgHeightUnit,
        bgPositionKeywordX, bgPositionKeywordY, bgShiftFlagX, bgShiftFlagY,
        bgShiftValueX, bgShiftValueY, bgShiftUnitX, bgShiftUnitY }
        from '../Stores/bgImages'
    import { transparentHeader }
        from '../Stores/header'
    import BgImagesManager
        from '../Classes/BgImagesManager'
    import { onDestroy }
        from 'svelte'
    import { BackgroundImageStyle }
        from '../Classes/BackgroundImageStyle'



    // Propriétés
    const BG_MNG = new BgImagesManager()



    // Réactivité
    $: css = formatStyleArgs($backgroundType, $backgroundColor, $backgroundImage, $listBgImgs,
        $bgRepeat, $bgSizeKeyword, $bgWidthValue, $bgWidthUnit, $bgHeightValueEnabled,
        $bgHeightValue, $bgHeightUnit, $bgPositionKeywordX, $bgPositionKeywordY,
        $bgShiftFlagX, $bgShiftFlagY, $bgShiftValueX, $bgShiftValueY,
        $bgShiftUnitX, $bgShiftUnitY)



    // Lifecycle
    onDestroy(e => DB_MNG.destroy)



    // Fonctions
    const formatStyleArgs = () => {
        // Liste des propriétés CSS sous forme de tableau/objet
        let props = []
        
        // Ajout des propriétés
        switch ($backgroundType) {
            case "color":
                props['--bg-color'] = $backgroundColor
                break;
            case "image":
                formatBgImage(props)
                break;
        }

        // Formatage en chaine
        let data = ''
        Object.keys(props).forEach(key => 
            data = data + key + ': ' + props[key] + '; ')
        return data
    }
    const formatBgImage = props => {
        // Initialisation
        const CSS = new BackgroundImageStyle() // Traducteur Paramètres => CSS
        const bg = BG_MNG.findById($backgroundImage) // Récupérer l'image d'arrière plan
        const url = bg != null ? bg.url : "" // Récupérer l'url

        // Attribution des propriétés CSS
        props['--bg-image-url'] = 'url("' + url + '")'
        props['--bg-position'] = CSS.formatPosition(
            $bgPositionKeywordX, $bgPositionKeywordY,
            $bgShiftFlagX, $bgShiftFlagY,
            $bgShiftValueX, $bgShiftValueY,
            $bgShiftUnitX, $bgShiftUnitY
        )
        props['--bg-size'] = CSS.formatSize(
            $bgSizeKeyword, $bgWidthValue, $bgWidthUnit,
            $bgHeightValueEnabled, $bgHeightValue, $bgHeightUnit
        )
        props['--bg-repeat'] = $bgRepeat
        props['--bg-color'] = $backgroundColor

    }
</script>

<main class="vw-wallpaper"
    class:neutral={!$transparentHeader || $backgroundType == "neutral"}
    class:bgColor={$backgroundType == "color"}
    class:bgImage={$backgroundType == "image"}
    style={css}
>
    <slot></slot>
</main>

<style lang="scss">
    .vw-wallpaper {
        --bg-color: red;
        --bg-image-url: '';
        --bg-position: center center;
        --bg-repeat: repeat;
        --bg-size: cover;

        &:not(.neutral) {
            // Arrière plan en couleur
            &.bgColor {
                background: var(--bg-color);
            }

            // Arrière plan en image
            &.bgImage {
                background: var(--bg-image-url) var(--bg-color);
                background-position: var(--bg-position);
                background-repeat: var(--bg-repeat);
                background-size: var(--bg-size);
                //background-attachment: fixed;
            }
        }
    }
</style>