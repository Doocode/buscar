<script>
    // Imports
    import { contrastMode, customAmbiance, defaultLightMode, defaultDarkMode,
        ambiances, planningAmbiances, allowHeaderBackButton, compactSearchBox,
        backgroundType, backgroundColor, backgroundImage, allowHeaderHomeButton } 
        from '../../Stores/settings'
    import { Breadcrumb, BreadcrumbItem, Toggle, Grid, Row, Column, Button,
        TileGroup, RadioTile, RadioButtonGroup, RadioButton, Modal, NumberInput,
        ExpandableTile }
        from 'carbon-components-svelte'
    import { pageName, pageIcon }
        from '../../Stores/header'
    import { listBgImgs }
        from '../../Stores/bgImages'
    import PlanningAmbiances
        from '../../UI/PlanningAmbiances.svelte'
    import ModalSelectBgImage
        from '../../Modals/ModalSelectBgImage.svelte'
    import Icofont
        from '../../UI/Icofont.svelte'
    import { fade, slide }
        from 'svelte/transition'
    import { push }
        from 'svelte-spa-router'



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")
    const TITLE_PAGE = "Apparence"



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Préférences", url: "/#/preferences"},
        {title: TITLE_PAGE, url: "/#/preferences/interface", current: true},
    ]
    let modalPlanningTiles = false
    let modalBgImageSelect = false
    let bgColorInput // Sélecteur de couleur
    let focusTime = ""
    let edit_planningId = 0
    let edit_planningTimeH = 0
    let edit_planningTimeM = 0
    let edit_planningAmbiance = ""
    let edit_bgImage = ""



    // Réactivité
    $: publicAmbiances = $ambiances.filter(item => item.public)
    $: planningAccordion = formatPlanningAmbiances($planningAmbiances, focusTime, edit_planningTimeH, edit_planningTimeM)
    $: startTimePlannedAmbiance = findCurrentPlannedAmbiance(planningAccordion) // TODO: Ajouter un timer pour MAJ l'affichage
    $: bgUrl = findBgImgById($backgroundImage) != null ? findBgImgById($backgroundImage).url : ""



    // Méthodes
    const onCustomAmbianceSelected = e => customAmbiance.set(e.detail)
    const onBrowserAmbianceSelected = (isDarkMode, e) => {
        if (isDarkMode == true)
            defaultDarkMode.set(e.detail)
        else if (isDarkMode == false)
            defaultLightMode.set(e.detail)
    }
    const onTimeFocus = e => {
        focusTime = e.time
        edit_planningId = e.id
        edit_planningTimeH = parseInt(e.splitTime[0])
        edit_planningTimeM = parseInt(e.splitTime[1])
        edit_planningAmbiance = e.ambiance
    }
    const onCloseModal = () => {
        focusTime = ""
        edit_planningId = 0
        edit_planningTimeH = 0
        edit_planningTimeM = 0
        edit_planningAmbiance = ""
    }
    const onSubmitPlanning = () => {
        if (edit_planningId > 0) {
            // Envoi des modifs
            planningAmbiances.updateById(edit_planningId, {
                ambiance: edit_planningAmbiance,
                time: edit_planningTimeH + ":" + edit_planningTimeM
            })

            // Effacer le formulaire
            focusTime = ""
            edit_planningId = 0
            edit_planningTimeH = 0
            edit_planningTimeM = 0
            edit_planningAmbiance = ""
        } else {
            modalPlanningTiles = false
        }
    }
    const scheduleAmbiance = () => {
        // Rechercher un horaire disponible
        let h = 0, m = 0
        let freetime = [] // Liste des temps libres
        for (let hh=0; hh<24; hh++) {
            freetime[hh] = []
            for (let mm=0; mm<60; mm++)
                freetime[hh].push(mm)
        }

        // Supprimer les horaires déjà pris
        planningAccordion.forEach(item => {
            let iH = parseInt(item.splitTime[0])
            let iM = parseInt(item.splitTime[1])

            freetime[iH] = freetime[iH]
                .filter(minute => minute != iM)
        })
        freetime = freetime.filter(hour => hour.length > 0)

        // Séléction au hasard (heure/ambiance)
        let min, max
        // - Heure
        min = 0, max = freetime.length
        h = Math.floor(Math.random() * (max - min) ) + min
        // - Minutes
        min = 0, max = freetime[h].length
        m = Math.floor(Math.random() * (max - min) ) + min
        // - Ambiance
        min = 0, max = publicAmbiances.length
        let ambiance = publicAmbiances[Math.floor(Math.random() * (max - min) ) + min].value

        // Ajouter au planning
        planningAmbiances.addItem(h+":"+m, ambiance)

        // Afficher dans l'éditeur
        focusTime = h+":"+m
        edit_planningId = $planningAmbiances[$planningAmbiances.length - 1].id
        edit_planningTimeH = h
        edit_planningTimeM = m
        edit_planningAmbiance = ambiance
        modalPlanningTiles = true
    }
    const deletePlanningItem = id => {
        if (edit_planningId > 0) {
            // Envoi des modifs
            planningAmbiances.deleteById(edit_planningId)

            // Effacer le formulaire
            focusTime = ""
            edit_planningId = 0
            edit_planningTimeH = 0
            edit_planningTimeM = 0
            edit_planningAmbiance = ""
        } else if (id != null && !isNaN(parseInt(id)) && parseInt(id) > 0) {
            planningAmbiances.deleteById(parseInt(id))
        }
    }
    const editCurrentScheduledAmbiance = () => {
        modalPlanningTiles = true
        onTimeFocus(planningAccordion.filter(item => item.time == startTimePlannedAmbiance)[0])
    }
    const formatPlanningAmbiances = () => {
        return $planningAmbiances.map(function(item) {
            // Parser du planning

            // Jointure avec $ambiances
            item.data = publicAmbiances.filter((a) => a.value == item.ambiance)[0]
            item.open = item.time == focusTime // Flag pour l'accordéon
            item.splitTime = item.time.split(':') // Format du temp
            return item

        }).sort((a, b) => { // Trier en fonction du l'heure
            
            // Tri sur l'heure
            if (parseInt(a.splitTime[0]) < parseInt(b.splitTime[0]))
                return -1
            if (parseInt(a.splitTime[0]) > parseInt(b.splitTime[0]))
                return 1
            
            // Même heure ==> tri en fonction des minutes
            if (parseInt(a.splitTime[0]) == parseInt(b.splitTime[0])) {
                if (parseInt(a.splitTime[1]) < parseInt(b.splitTime[1]))
                    return -1
                if (parseInt(a.splitTime[1]) > parseInt(b.splitTime[1]))
                    return 1
            }

            // Même heure/minutes
            return 0

        })
    }
    const findCurrentPlannedAmbiance = () => {
        // Initialisation
        const date = new Date()
        const h = date.getHours()
        const m = date.getMinutes()
        let timeToFocus = "0:00"

        // Rechercher l'heure de debut de l'ambiance actuelle
        planningAccordion.forEach(function(item) {
            let itemH = parseInt(item.splitTime[0])
            let itemM = parseInt(item.splitTime[1])

            // Si l'heure et les minutes ont déjà été atteint
            // - Si l'heure a été dépassée
            // - ou si même heure mais minutes arrivées ou dépassées
            if (itemH < h || (itemH == h && itemM <= m))
                timeToFocus = item.time
        })

        return timeToFocus
    }
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

<main id="prefs-display" class="prefs-section"
     in:fade={{duration: 200}}>
    <h2>{TITLE_PAGE}</h2>
    {#if BREADCRUMBS.length > 0}
        <Breadcrumb noTrailingSlash>
            {#each BREADCRUMBS as page}
                <BreadcrumbItem
                    href={ page.url }
                    isCurrentPage={ page.current }>
                    { page.title }
                </BreadcrumbItem>
            {/each}
        </Breadcrumb>
    {/if}



    <h3 class="format">Ambiance</h3>
    <RadioButtonGroup
        legendText="Mode de contraste de l'interface"
        bind:selected={$contrastMode}
    >
        <!-- TODO: Ne pas proposer Système si browser ne supporte pas : https://github.com/pearofducks/svelte-match-media -->
        <RadioButton labelText="Système" value="browser" />
        <RadioButton labelText="Planifié" value="planning" />
        <RadioButton labelText="Personnalisé" value="custom" />
    </RadioButtonGroup>
    <br/>

    {#if $contrastMode == "browser"}
        <div transition:slide|local>
            <div class="ambianceTiles">
                <TileGroup
                    legend="Ambiance claire"
                    on:select={(e) => onBrowserAmbianceSelected(false, e)}
                >
                    {#each publicAmbiances.filter((item) => !item.dark) as ambiance}
                        <RadioTile value={ambiance.value} checked={$defaultLightMode == ambiance.value} >
                            <Icofont icon={ambiance.icon} size="22" />
                            <span class="text">{ambiance.name}</span>
                        </RadioTile>
                    {/each}
                </TileGroup>
            </div>
            <br/>
            <div class="ambianceTiles">
                <TileGroup
                    legend="Ambiance sombre"
                    on:select={(e) => onBrowserAmbianceSelected(true, e)}
                >
                    {#each publicAmbiances.filter((item) => item.dark) as ambiance}
                        <RadioTile value={ambiance.value} checked={$defaultDarkMode == ambiance.value} >
                            <Icofont icon={ambiance.icon} size="22" />
                            <span class="text">{ambiance.name}</span>
                        </RadioTile>
                    {/each}
                </TileGroup>
            </div>
        </div>
    {:else if $contrastMode == "planning"}
        <div transition:slide|local>
            <!-- Barre de progression du planning -->
            <PlanningAmbiances
                currentTime={startTimePlannedAmbiance}
                label="Planification des ambiances"
                planning={$planningAmbiances} />
            <br/>
            <div class="actions">
                <Button kind="tertiary" class="format"
                    on:click={() => modalPlanningTiles = true} >
                    <Icofont icon="agenda" size="18" />
                    <p class="label">Modifier le planning des ambiances</p>
                </Button>
                <Button kind="tertiary" class="format" on:click={scheduleAmbiance} >
                    <Icofont icon="plus" size="18" />
                    <p class="label">Planifier une ambiance</p>
                </Button>
                <Button kind="tertiary" class="format" on:click={editCurrentScheduledAmbiance}>
                    <Icofont icon="settings" size="18" />
                    <p class="label">Changer l'ambiance actuelle</p>
                </Button>
            </div>
        </div>
    {:else if $contrastMode == "custom"}
        <div class="ambianceTiles" transition:slide|local>
            <TileGroup
                legend="Ambiance de l'interface"
                on:select={onCustomAmbianceSelected}
            >
                {#each publicAmbiances as ambiance}
                    <RadioTile value={ambiance.value} checked={$customAmbiance == ambiance.value} >
                        <Icofont icon={ambiance.icon} size="22" />
                        <span class="text">{ambiance.name}</span>
                    </RadioTile>
                {/each}
            </TileGroup>
        </div>
    {/if}



    <h3 class="format">Fond d'écran</h3>
    <RadioButtonGroup
        legendText="Type de fond d'écran"
        bind:selected={$backgroundType}
    >
        <RadioButton labelText="Basique" value="neutral" />
        <RadioButton labelText="Couleur" value="color" />
        <!--<RadioButton labelText="Dégradé" value="gradient" />-->
        <RadioButton labelText="Image" value="image" />
        <!--<RadioButton labelText="Diaporama" value="slideshow" />-->
    </RadioButtonGroup>
    <br/>

    {#if $backgroundType == "color"}
        <div transition:slide|local style="display: flex; flex-flow: wrap; align-items: center; gap: var(--cds-spacing-02);">
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
        <div transition:slide|local style="display: flex; flex-flow: wrap; align-items: end; gap: var(--cds-spacing-02);">
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



    <h3 class="format">Options</h3>
    <Grid style="max-width: 510px; margin: 0; padding: 0;">
        <Row>
            <Column>
                <Toggle labelText="Afficher le bouton 'Retour' en haut"
                    bind:toggled={$allowHeaderBackButton}
                    labelA="Non" labelB="Oui" />
            </Column>
            <Column>
                <Toggle labelText="Afficher le bouton 'Accueil' en haut"
                    bind:toggled={$allowHeaderHomeButton}
                    labelA="Non" labelB="Oui" />
            </Column>
        </Row>
    </Grid>
    <br/><br/>
    <Grid style="max-width: 510px; margin: 0; padding: 0;">
        <Row>
            <Column>
                <Toggle labelText="Barre de recherche compacte"
                    bind:toggled={$compactSearchBox}
                    labelA="Non" labelB="Oui" />
            </Column>
        </Row>
    </Grid>

    <Modal
        modalHeading="Horaire des ambiances"
        primaryButtonText="Terminer"
        bind:open={modalPlanningTiles}
        on:click:button--primary={onSubmitPlanning}
        on:close={onCloseModal}
    >
        <!-- Barre de progression du planning -->
        <PlanningAmbiances
            currentTime={focusTime}
            label="Planification des ambiances"
            planning={$planningAmbiances} />
        <br/>

        {#if edit_planningId < 1}
            <div class="actions">
                <Button kind="primary" class="format" on:click={scheduleAmbiance} >
                    <Icofont icon="plus" size="18" />
                    <p class="label">Planifier une ambiance</p>
                </Button>
                <Button kind="secondary" class="format" on:click={editCurrentScheduledAmbiance}>
                    <Icofont icon="settings" size="18" />
                    <p class="label">Changer l'ambiance actuelle</p>
                </Button>
            </div>
            <br/>

            <div class="planning-list">
                {#each planningAccordion as item}
                    <ExpandableTile tileCollapsedLabel="Gérer"
                        bind:open={item.open}
                    >
                        <div slot="above">
                            <h6>À partir de {item.time}</h6>
                            <div class="message">
                                <Icofont icon={item.data.icon} />
                                <p class="label">{item.data.name}</p>
                            </div>
                        </div>
                        <div slot="below">
                            <div class="actions">
                                <Button kind="secondary" class="format" on:click={() => onTimeFocus(item)}>
                                    <Icofont icon="settings" size="18" />
                                    <p class="label">Modifier</p>
                                </Button>

                                {#if $planningAmbiances.length > 1}
                                    <Button kind="danger" class="format" on:click={() => {deletePlanningItem(item.id)}}>
                                        <Icofont icon="bin" size="18" />
                                        <p class="label">Supprimer</p>
                                    </Button>
                                {/if}
                            </div>
                        </div>
                    </ExpandableTile>
                {/each}
            </div>
        {:else if edit_planningId > 0}
            <Grid condensed>
                <Row>
                    <Column>
                        <NumberInput
                            label="Heure de mise en place" min={0} max={23}
                            helperText="Minimum 0 - Maximum 23"
                            invalidText="Vous devez saisir un nombre entre 0 et 23 compris"
                            bind:value={edit_planningTimeH}
                        />
                    </Column>
                    <Column>
                        <NumberInput
                            label="Minutes" min={0} max={59}
                            helperText="Minimum 0 - Maximum 59"
                            invalidText="Vous devez saisir un nombre entre 0 et 59 compris"
                            bind:value={edit_planningTimeM}
                        />
                    </Column>
                </Row>
            </Grid>
            <br/>

            <div class="ambianceTiles">
                <TileGroup
                    legend="Ambiance de l'interface à cet horaire"
                    on:select={e => edit_planningAmbiance = e.detail}
                >
                    {#each publicAmbiances as ambiance}
                        <RadioTile value={ambiance.value} checked={edit_planningAmbiance == ambiance.value} >
                            <Icofont icon={ambiance.icon} size="22" />
                            <span class="text">{ambiance.name}</span>
                        </RadioTile>
                    {/each}
                </TileGroup>
            </div>
            
            {#if $planningAmbiances.length > 1}
                <br/>
                <div class="actions">
                    <Button kind="danger" class="format"
                        on:click={deletePlanningItem}>
                        <Icofont icon="bin" size="18" />
                        <p class="label">Supprimer cet horaire</p>
                    </Button>
                </div>
            {/if}
        {/if}
        <br/>
    </Modal>

    <ModalSelectBgImage
        bind:open={modalBgImageSelect}
        bind:value={edit_bgImage}
        on:submit={onSelectBgImage} />

</main>

<style lang="scss">
    @import './Preferences.scss';

    #prefs-display {
        // Sélecteur d'ambiance
        .ambianceTiles {
            // - Grille
            :global(.bx--tile-group div) {
                max-width: 1100px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: var(--cds-spacing-03);
            }
            // - Cellule
            :global(.bx--tile) {
                border-radius: 10px;
                min-width: 5rem;
                padding-right: 1rem;
            }
            // - Texte
            :global(.bx--tile--selectable .text) {
                display: block;
                margin-top: var(--cds-spacing-03);
            }
        }

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
        .message {
            display: flex;
            align-items: center;
            gap: var(--cds-spacing-02);
        }

        // Planning des ambiances
        .planning-list {
            display: flex;
            flex-flow: column;
            gap: var(--cds-spacing-02);

            .actions {
                margin-top: var(--cds-spacing-04);
            }
        }
        :global(.bx--modal-content .bx--grid) {
            padding: 0 1rem;
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
            max-width: 300px;
            max-height: 400px;
            border-radius: 10px;
            background-color: rgb(127,127,127);
            cursor: pointer;
        }
    }

    @media (min-width: 672px) {
        // Sélecteur d'ambiance
        #prefs-display .ambianceTiles :global(.bx--tile-group div) {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    }

    @media (min-width: 1056px) {
        // Sélecteur d'ambiance
        #prefs-display .ambianceTiles :global(.bx--tile-group div) {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }
</style>