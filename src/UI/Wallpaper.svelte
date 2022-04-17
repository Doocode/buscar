<script>
    // Imports
    import { backgroundType, backgroundColor, backgroundImage }
        from '../Stores/settings'
    import { transparentHeader }
        from '../Stores/header'



    // Réactivité
    $: css = formatStyleArgs($backgroundType, $backgroundColor, $backgroundImage)



    // Fonctions
    const formatStyleArgs = () => {
        let props = []
        
        // Ajout des propriétés
        switch ($backgroundType) {
            case "color":
                props["--bg-color"] = $backgroundColor;
                break;
            case "image":
                props["--bg-image-url"] = 'url("' + $backgroundImage + '")';
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