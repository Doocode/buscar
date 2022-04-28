<script>
    // Imports
    import { backgroundType, backgroundColor, backgroundImage }
        from '../../../Stores/settings'
    import { listBgImgs }
        from '../../../Stores/bgImages'
    import ModalSelectBgImage
        from '../../../Modals/ModalSelectBgImage.svelte'
    import ControlsPage
        from '../ControlsPage.svelte'
    import { RadioButtonGroup, RadioButton, Button }
        from 'carbon-components-svelte'
    import Icofont
        from '../../Icofont.svelte'
	import { slide }
        from 'svelte/transition'
    import { push }
        from 'svelte-spa-router'



    // Réactivité
    $: bgUrl = findBgImgById($backgroundImage) != null ? findBgImgById($backgroundImage).url : ""



    // Propriétés
    let bgColorInput // Couleur sélectionnée
    let modalBgImageSelect = false // Selecteur d'image
    let edit_bgImage = ""



    // Fonctions
    const findBgImgById = id => {
        const results = $listBgImgs.filter(item => item.id == id)
        if (results == null || results.length == 0)
            return null
        return results[0]
    }
    const onSelectBgImage = e => {
        backgroundImage.set(e.detail.value)
        modalBgImageSelect = false
    }
</script>

<main>
    <ControlsPage
        title="Fond d'écran"
        icon="image"
        on:backRequest
        on:close
    >
        <div class="page-content">
            <!-- Le type de fond d'écran actuel -->
            <RadioButtonGroup
                legendText="Type de fond d'écran"
                orientation="vertical"
                bind:selected={$backgroundType}
            >
                <RadioButton labelText="Basique" value="neutral" />
                <RadioButton labelText="Couleur" value="color" />
                <!--<RadioButton labelText="Dégradé" value="gradient" />-->
                <RadioButton labelText="Image" value="image" />
                <!--<RadioButton labelText="Diaporama" value="slideshow" />-->
            </RadioButtonGroup>

            <!-- Les réglages sur le fond d'écran -->
            {#if $backgroundType == "color"}

                <div transition:slide|local class="block-settings" style="align-items: center;">
                    <div class="color-view" style="--value: {$backgroundColor}"
                        on:click={() => bgColorInput.click()} >
                        <input type="color"
                            bind:this={bgColorInput}
                            bind:value={$backgroundColor} />
                    </div>
                    <div class="actions" style="flex: 1">
                        <Button kind="tertiary" class="format"
                            on:click={() => bgColorInput.click()} >
                            <Icofont icon="palette" size="18" />
                            <p class="label">Choisir une couleur</p>
                        </Button>
                    </div>
                </div>

            {:else if $backgroundType == "image"}

                <div transition:slide|local class="block-settings" style="align-items: end;">
                    <img class="image-view" src={bgUrl}
                        on:click={() => modalBgImageSelect = true} />

                    <div class="actions" style="flex: 1; flex-flow: column; align-items: flex-start;">
                        <Button kind="tertiary" class="format"
                            on:click={() => modalBgImageSelect = true} >
                            <Icofont icon="folder_close" size="18" />
                            <p class="label">Choisir une image</p>
                        </Button>

                        <Button kind="tertiary" class="format"
                            on:click={() => push('/preferences/interface/background-image')} >
                            <Icofont icon="settings" size="18" />
                            <p class="label">Réglages <!--et filtres--> sur l'image</p>
                        </Button>
                    </div>
                </div>

            {/if}
        </div>
    </ControlsPage>

    <ModalSelectBgImage
        bind:open={modalBgImageSelect}
        bind:value={edit_bgImage}
        on:submit={onSelectBgImage} />
</main>

<style lang="scss">
    .page-content {
        padding: var(--cds-spacing-05);

        // Boutons
        :global(.bx--btn.format) {
            padding: var(--cds-spacing-04);
            gap: var(--cds-spacing-03);
            border-radius: 8px;
            min-height: auto;
            min-width: 130px;
            justify-content: flex-start;
        }
        .label {font-size: 100%; padding: 0;}

        // Blocs des paramètres
        .block-settings {
            display: flex;
            flex-flow: wrap;
            gap: var(--cds-spacing-02);
            margin-top: var(--cds-spacing-07);
        }

        // Actions
        .actions {
            display: flex;
            flex-flow: wrap;
            gap: var(--cds-spacing-02);
        }

        // Sélecteur de couleur
        .color-view {
            --value: #00aaff;

            width: 47px;
            height: 47px;
            border-radius: 50px;
            background-color: var(--value);
            cursor: pointer;

            input {display: none;}
        }


        // Sélecteur d'image
        .image-view {
            max-width: 296px;
            max-height: 200px;
            border-radius: 10px;
            background-color: rgb(127,127,127);
            cursor: pointer;
        }
    }
</style>