<script>
    // Imports
    import { Toggle, Modal, Button }
        from 'carbon-components-svelte'
    import BackgroundPosition
        from '../../Forms/BackgroundPosition.svelte'
    import BackgroundSize
        from '../../Forms/BackgroundSize.svelte'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { BackgroundImageStyle }
        from '../../Classes/BackgroundImageStyle'
    import { backgroundColor, backgroundImage }
        from '../../Stores/settings'
    import { pageName, pageIcon, transparentHeader }
        from '../../Stores/header'
    import { listBgImgs, bgRepeat, bgSizeKeyword,
        bgWidthValue, bgWidthUnit, bgHeightValueEnabled,
        bgHeightValue, bgHeightUnit,
        bgPositionKeywordX, bgPositionKeywordY,
        bgShiftFlagX, bgShiftFlagY,
        bgShiftValueX, bgShiftValueY,
        bgShiftUnitX, bgShiftUnitY }
        from '../../Stores/bgImages'
	import { slide }
        from 'svelte/transition'
    import { pop }
        from 'svelte-spa-router'
    import { onMount }
        from 'svelte'



    // MAJ du header
    pageName.set("Fond d'écran")
    pageIcon.set("image")
    transparentHeader.set(true)



    // Propriétés internes
    let innerHeight
    let preview = true // Aperçu en temps réel des modifs
    let backup = {} // Sauvegarde avant modification
    let position = 'center center'
    let size = 'cover'
    let repeat = 'repeat'

    // - Position
    let modalPosition = false
    let positionKeywordX = 'center'
    let positionKeywordY = 'center'
    let shiftFlagX = false
    let shiftFlagY = false
    let shiftValueX = 0
    let shiftValueY = 0
    let shiftUnitX = 'px'
    let shiftUnitY = 'px'

    // - Taille
    let modalSize = false
    let sizeKeyword = 'cover'
    let widthValue = 50
    let heightValue = 50
    let widthUnit = '%'
    let heightUnit = '%'
    let heightValueEnabled = false



    // Réactivité
    $: isModalOpen = modalPosition || modalSize
    $: updatePositionCSS(positionKeywordX, positionKeywordY, shiftFlagX, shiftFlagY,
        shiftValueX, shiftValueY, shiftUnitX, shiftUnitY)
    $: updateSizeCSS(sizeKeyword, widthValue, heightValue, widthUnit, heightUnit, heightValueEnabled)
    $: bgUrl = fetchBgImgUrl($backgroundImage)
    $: style = formatStyle(preview, innerHeight, position, size, repeat, $backgroundColor, $backgroundImage)



    // Fonctions
    const loadData = () => {
        repeat = $bgRepeat

        // - Position
        positionKeywordX = $bgPositionKeywordX
        positionKeywordY = $bgPositionKeywordY
        shiftFlagX = $bgShiftFlagX
        shiftFlagY = $bgShiftFlagY
        shiftValueX = $bgShiftValueX
        shiftValueY = $bgShiftValueY
        shiftUnitX = $bgShiftUnitX
        shiftUnitY = $bgShiftUnitY

        // - Taille
        sizeKeyword = $bgSizeKeyword
        widthValue = $bgWidthValue
        heightValue = $bgHeightValue
        widthUnit = $bgWidthUnit
        heightUnit = $bgHeightUnit
        heightValueEnabled = $bgHeightValueEnabled
    }
    const openForm = form => {
        // Effectuer une sauvegarde
        switch (form) {
            case 'size':
                backup = {
                    sizeKeyword: sizeKeyword,
                    widthValue: widthValue,
                    heightValue: heightValue,
                    widthUnit: widthUnit,
                    heightUnit: heightUnit,
                    heightValueEnabled: heightValueEnabled,
                }
                modalSize = true
                break
            case 'position':
                backup = {
                    positionKeywordX: positionKeywordX,
                    positionKeywordY: positionKeywordY,
                    shiftFlagX: shiftFlagX,
                    shiftFlagY: shiftFlagY,
                    shiftValueX: shiftValueX,
                    shiftValueY: shiftValueY,
                    shiftUnitX: shiftUnitX,
                    shiftUnitY: shiftUnitY,
                }
                modalPosition = true
                break
            default:
                backup = {}
        }
    }
    const saveChanges = () => {
        // Enregistrer les modifs dans les stores
        // - Position de l'image d'arrière plan
        bgPositionKeywordX.set(positionKeywordX)
        bgPositionKeywordY.set(positionKeywordY)
        bgShiftFlagX.set(shiftFlagX)
        bgShiftFlagY.set(shiftFlagY)
        bgShiftValueX.set(shiftValueX)
        bgShiftValueY.set(shiftValueY)
        bgShiftUnitX.set(shiftUnitX)
        bgShiftUnitY.set(shiftUnitY)

        // - Taille de l'image d'arrière plan
        bgSizeKeyword.set(sizeKeyword)
        bgWidthValue.set(widthValue)
        bgHeightValue.set(heightValue)
        bgWidthUnit.set(widthUnit)
        bgHeightUnit.set(heightUnit)
        bgHeightValueEnabled.set(heightValueEnabled)

        // - Répéter l'image d'arrière plan
        bgRepeat.set(repeat)

        // Retour en arrière
        pop()
    }
    const applyChanges = section => {
        backup = {} // Effacer le backup

        // Fermer la popup
        switch (section) {
            case 'position':
                modalPosition = false
                break
            case 'size':
                modalSize = false
                break
        }
    }
    const restoreBackup = section => {
        if (Object.keys(backup).length == 0)
            return

        switch (section) {
            case 'position':
                positionKeywordX = backup.positionKeywordX
                positionKeywordY = backup.positionKeywordY
                shiftFlagX = backup.shiftFlagX
                shiftFlagY = backup.shiftFlagY
                shiftValueX = backup.shiftValueX
                shiftValueY = backup.shiftValueY
                shiftUnitX = backup.shiftUnitX
                shiftUnitY = backup.shiftUnitY
                modalPosition = false
                break
            case 'size':
                sizeKeyword = backup.sizeKeyword
                widthValue = backup.widthValue
                heightValue = backup.heightValue
                widthUnit = backup.widthUnit
                heightUnit = backup.heightUnit
                heightValueEnabled = backup.heightValueEnabled
                modalSize = false
                break
        }
        backup = {}
    }
    const fetchBgImgUrl = () => {
        let url = ''
        const results = $listBgImgs
            .filter(item => parseInt(item.id) == parseInt($backgroundImage))
        if (results.length > 0)
            url = results[0].url
        return url
    }
    const toggleBgRepeat = () => {
        switch (repeat) {
            case 'no-repeat':
                repeat = 'repeat'
                break
            case 'repeat':
                repeat = 'no-repeat'
                break
        }
    }
    const formatStyle = () => {
        let css = '--height: '+innerHeight+'px; '

        if (preview) {
            // Background
            css += 'background-color: '+$backgroundColor+'; '
            if (bgUrl.length > 0)
                css += "background-image: url('"+bgUrl+"'); "
            if (position.length > 0)
                css += "background-position: "+position+"; "
            if (size.length > 0)
                css += "background-size: "+size+"; "
            if (repeat.length > 0)
                css += "background-repeat: "+repeat+"; "
        }

        return css
    }
    const updatePositionCSS = () => {
        // Mise à jour de la position du fond en CSS
        const CSS = new BackgroundImageStyle()
        position = CSS.formatPosition(
            positionKeywordX, positionKeywordY,
            shiftFlagX, shiftFlagY,
            shiftValueX, shiftValueY,
            shiftUnitX, shiftUnitY
        )
    }
    const updateSizeCSS = () => {
        // Mise à jour de la taille du fond en CSS
        const CSS = new BackgroundImageStyle()
        size = CSS.formatSize(
            sizeKeyword, widthValue, widthUnit,
            heightValueEnabled, heightValue, heightUnit
        )
    }



    // Lifecycle
    onMount(loadData)
</script>

<svelte:window bind:innerHeight={innerHeight} />

<main id="bgimgSettings" {style} >

    <div class="header-mask">
        {#if !isModalOpen}
            <div class="toolbar" transition:slide|local>
                <Button kind="primary" class="format" on:click={saveChanges}>
                    <div class="label">
                        <Icofont icon="check" size="18" />
                        <span class="text">Enregistrer les modifications</span>
                    </div>
                </Button>
                <Button kind="danger" class="format" on:click={pop}>
                    <div class="label">
                        <Icofont icon="cross" size="18" />
                        <span class="text">Abandonner</span>
                    </div>
                </Button>

                <!--div><Toggle bind:toggled={preview} labelA="Aucun aperçu" labelB="Aperçu activé" /></div-->
            </div>
        {/if}
    </div>
    
    <!-- Les flags -->
    {#if !isModalOpen}
        <div class="flags" transition:slide|local>
            <Button kind="ghost"
                on:click={() => openForm('size')} >
                <div class="label"
                    class:checked={size.length > 0}>
                    <Icofont icon="crop_free" />
                    <span class="text">Taille</span>
                </div>
            </Button>

            <Button kind="ghost"
                on:click={() => openForm('position')} >
                <div class="label"
                    class:checked={position.length > 0}>
                    <Icofont icon="target" />
                    <span class="text">Position</span>
                </div>
            </Button>
            
            <Button kind="ghost"
                on:click={toggleBgRepeat} >
                <div class="label"
                    class:checked={repeat != 'no-repeat'}>
                    <Icofont icon="squares" />
                    <span class="text">Répéter</span>
                </div>
            </Button>

            <!--div class="spacer"></div-->
        </div>
    {/if}

    <!-- Les modals -->
    <div>
        <Modal size="xs"
            bind:open={modalPosition}
            primaryButtonText="Appliquer"
            secondaryButtonText="Annuler"
            preventCloseOnClickOutside={true}
            on:click:button--primary={() => applyChanges('position')}
            on:click:button--secondary={() => restoreBackup('position')}
            on:close={() => restoreBackup('position')}
        >
            <div slot="heading" class="label">
                <Icofont icon="target" size="20" />
                <span class="text">Position</span>
            </div>
            <!-- Utilisation du 'if' pour forcer la mise à jour de la vue-->
            {#if modalPosition}
                <BackgroundPosition
                    bind:positionKeywordX bind:positionKeywordY
                    bind:shiftFlagX bind:shiftFlagY
                    bind:shiftValueX bind:shiftValueY
                    bind:shiftUnitX bind:shiftUnitY />
            {/if}
        </Modal>

        <Modal size="xs"
            bind:open={modalSize}
            primaryButtonText="Appliquer"
            secondaryButtonText="Annuler"
            preventCloseOnClickOutside={true}
            on:click:button--primary={() => applyChanges('size')}
            on:click:button--secondary={() => restoreBackup('size')}
            on:close={() => restoreBackup('size')}
        >
            <div slot="heading" class="label">
                <Icofont icon="crop_free" size="20" />
                <span class="text">Taille</span>
            </div>
            <!-- Utilisation du 'if' pour forcer la mise à jour de la vue-->
            {#if modalSize}
                <BackgroundSize
                    bind:sizeKeyword bind:heightValueEnabled
                    bind:widthValue bind:heightValue
                    bind:widthUnit bind:heightUnit />
            {/if}
        </Modal>
    </div>
</main>

<style lang="scss">
    :global(html[theme=white]) main#bgimgSettings {
        --mask-bg-color: #ffffffaa;
        --modal-bg-color: #f4f4f4aa;
    }
    :global(html[theme=g10]) main#bgimgSettings {
        --mask-bg-color: #f4f4f4aa;
        --modal-bg-color: #ffffffaa;
    }
    :global(html[theme=g90]) main#bgimgSettings {
        --mask-bg-color: #262626aa;
        --modal-bg-color: #393939aa;
    }
    :global(html[theme=g100]) main#bgimgSettings {
        --mask-bg-color: #161616aa;
        --modal-bg-color: #262626aa;
    }
    main#bgimgSettings {
        --height: 300px;
        --header-height: 92px;

        transition: all .3s;
        height: calc(var(--height));
        margin-top: calc(-1 * var(--header-height));

        // Label
        div.label {
            display: inline-flex;
            flex-flow: row;
            align-items: center;
            gap: var(--cds-spacing-03);
        }

        .header-mask,
        .flags {
            backdrop-filter: blur(30px);
            background: var(--mask-bg-color);
        }
        .header-mask {
            padding-top: var(--header-height);
        }

        // Barre d'outils (en haut)
        .toolbar {
            display: flex;
            flex-flow: wrap;
            gap: var(--cds-spacing-04);
            align-items: center;
            justify-content: flex-start;
            padding: 0 var(--cds-spacing-07);
            padding-bottom: var(--cds-spacing-04);

            :global(.bx--btn.format) {
                border-radius: 10px;
                display: inline-flex;
                align-items: center;
                padding: .7rem 1.2rem;
                width: inherit;
                max-width: inherit;
            }
        }

        // Flags (barre des filtres)
        .flags {
            gap: 0;
            display: flex;
            flex-flow: row;
            justify-content: center;
            width: 100%;
            overflow: auto;
            padding: 1.5rem 1rem;
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;

            // Boutons
            :global(.bx--btn) {
                padding: .5rem;
                width: 90px;
                justify-content: center;
                align-items: flex-start;
                border-radius: 10px;
            }

            // Contenu du label
            .label {
                flex-flow: column;
                align-items: center;
                text-align: center;
            }

            // Icônes
            div.label :global(.icofont) {
                font-size: 20px;
                width: 46px;
                height: 46px;
                border-radius: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--cds-interactive-01);
            }

            // Icône activé
            div.label.checked :global(.icofont) {
                background: var(--cds-interactive-01);
                color: var(--cds-text-04);
            }

            div.label:not(.checked) :global(.icofont) {
                border-color: var(--cds-link-01);
            }

            // Texte
            .text {font-size: 95%;}

            // Espacement
            .spacer {width: 2rem;}
        }

        // Les modals
        // - Zone externe
        :global(.bx--modal) {
            background: transparent;
            align-items: flex-start;
            justify-content: flex-end;
        }
        // - La popup elle-même
        :global(.bx--modal-container) {
            position: fixed;
            top: 0;
            display: grid;
            overflow: hidden;
            height: 100%;
            max-height: 100%;
            grid-template-columns: 100%;
            grid-template-rows: auto 1fr auto;
            border-radius: 0;
            background: var(--modal-bg-color);
            backdrop-filter: blur(50px);
        }
    }

    @media (max-width: 672px) {
        // Composant
        main#bgimgSettings {
            --header-height: 52px;

            .toolbar {
                padding: var(--cds-spacing-04);
                padding-top: 0;
            }
        }
    }
</style>