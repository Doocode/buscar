<script>
    // Imports
    import { backgroundType, backgroundColor, backgroundImage }
        from '../Stores/settings'
    import { listBgImgs }
        from '../Stores/bgImages'
    import { transparentHeader }
        from '../Stores/header'
    import BgImagesManager
        from '../Classes/BgImagesManager'
    import { onDestroy }
        from 'svelte'



    // Propriétés
    const BG_MNG = new BgImagesManager()



    // Réactivité
    $: css = formatStyleArgs($backgroundType, $backgroundColor, $backgroundImage, $listBgImgs)



    // Lifecycle
    onDestroy(e => DB_MNG.destroy)



    // Fonctions
    const formatStyleArgs = () => {
        let props = []
        
        // Ajout des propriétés
        switch ($backgroundType) {
            case "color":
                props["--bg-color"] = $backgroundColor;
                break;
            case "image":
                const bg = BG_MNG.findById($backgroundImage)
                const url = bg != null ? bg.url : ""
                props["--bg-image-url"] = 'url("' + url + '")';
                break;
        }

        // Formatage en chaine
        let data = ''
        Object.keys(props).forEach(key => 
            data = data + key + ': ' + props[key] + '; ')
        return data
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
        --bg-image-url: "";

        &:not(.neutral) {
            // Arrière plan en couleur
            &.bgColor {
                background: var(--bg-color);
            }

            // Arrière plan en image
            &.bgImage {
                background-image: var(--bg-image-url);

                // TODO: Params
                background-position: center;
                background-size: cover;
                background-attachment: fixed;
            }
        }
    }
</style>