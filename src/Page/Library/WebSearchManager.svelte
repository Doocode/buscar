<script>
    // ============================
    // demander augmentation après avoir fait des résultat significatifs, bien visible

    // Imports
    import { Modal, DataTable, Button, TextInput, OverflowMenu, OverflowMenuItem, OutboundLink } from "carbon-components-svelte"
    import { SearchEngineType, listSearchEngines } from '../../Stores/search'
    import { onDestroy } from 'svelte'
    import Icofont from "../../UI/Icofont.svelte"

    // Initialisation
    let tableColumns = [
        { key: "name", value: "Site web de recherche" },
        { key: "type", value: "Type" },
        { key: "query", value: "Adresse URL de la requête" },
        { key: "overflow", empty: true },
    ];
    let tableData = []
    let idSelectedItems = []
    let searchEngines
    let se_name = ""
    let se_query = ""
    let se_icon = ""
    let se_type = ""

    // Flags
    let modalAddItem = false
    let modalPreviewItem = false
    let modalEditItem = false
    let modalDeleteItem = false

    // Observations
    const unsub_listSearchEngines = listSearchEngines.subscribe(value => {
        searchEngines = value;
        tableData = searchEngines
    });

    // Lifecycle
    onDestroy(() => {
        // Unsubscriptions
        unsub_listSearchEngines();
    });

    // Méthodes
    function findItemById(id) {
        // Rechercher l'item dans la liste
        for (let ii=0; ii<searchEngines.length; ii++) {
            // Si l'item a été retrouvé
            if (parseInt(searchEngines[ii].id) === parseInt(id))
                return searchEngines[ii]; // Retourner l'item
        }
        return null;
    }
    function findItemIndexById(id) {
        // Rechercher l'item dans la liste
        for (let ii=0; ii<searchEngines.length; ii++) {
            // Si l'item a été retrouvé
            if (parseInt(searchEngines[ii].id) === parseInt(id))
                return ii; // Retourner l'index
        }
        return -1;
    }
    function closeModals() {
        // Fermer la popup
        modalAddItem = false;
        modalPreviewItem = false;
        modalEditItem = false;
        modalDeleteItem = false;

        // Vider le formulaire
        se_name = "";
        se_query = "";
        se_icon = "";
    }
    function validateForm() {
        if (se_name.length < 1) {
            return "Vous devez donner un nom au moteur de recherche";
        }
        if (se_icon.length < 1) {
            return "Vous devez saisir l'adresse URL de l'icon du moteur de recherche";
        }
        if (se_query.length < 1) {
            return "Vous devez saisir l'adresse URL de la requête du moteur de recherche";
        }
        if (se_query.indexOf("%query%") < 1) {
            return "Vous devez inclure \"%query%\" dans l'adresse URL de la requête du moteur de recherche";
        }

        // Les données saisies sont correctes
        return true;
    }
    function createItem() {
        // Vérifie que les données du formulaire sont corrects
        let validate = validateForm();
        if (validate != true)
            return alert(validate);

        // Ajouter le moteur de recherche dans le Store
        listSearchEngines.add(se_name, se_icon, se_query, "")

        // Fermer la popup et vider le formulaire
        closeModals();
    }
    function displayDetails(id) {
        // Rechercher le moteur de recherche
        let se = findItemById(id);

        // Avorter si le moteur de recherche n'existe pas
        if (se == null)
            return alert("Le moteur de recherche n'existe pas");

        // Récupération et attribution des champs
        se_name = se.name;
        se_query = se.query;
        se_icon = se.icon;
        se_type = se.type;

        // Afficher la popup de détails
        modalPreviewItem = true;
    }
    function editItem(id) {
        // Retrouver le moteur de recherche
        let se = findItemById(id);

        // Si l'item n'a pas été retrouvé
        if (se == null)
            return alert("L'item n'existe pas");

        // Remplir le formulaire
        idSelectedItems = [se.id];
        se_name = se.name;
        se_query = se.query;
        se_icon = se.icon;
        se_type = se.type;

        // Ouvrir la popup
        modalEditItem = true;
    }
    function updateItem() {
        // Vérifie que les données du formulaire sont corrects
        let validate = validateForm();
        if (validate != true)
            return alert(validate);

        // Mettre à jour la liste
        listSearchEngines.updateByIndex(
            findItemIndexById(idSelectedItems[0]),
            se_name, se_icon, se_query, se_type
        );

        // Fermer les popups
        closeModals();

        // svelte store update array item by index
    }
    function duplicateItem(id) {
        // Retrouver le moteur de recherche
        let se = findItemById(id);

        // Si l'item n'a pas été retrouvé
        if (se == null)
            return alert("L'item n'existe pas");

        // Remplir le formulaire
        se_name = se.name + " (2)";
        se_query = se.query;
        se_icon = se.icon;
        se_type = se.type;

        // Ouvrir la popup
        modalAddItem = true;
    }
    function confirmDeleteItem(id) {
        // Retrouver le moteur de recherche
        let se = findItemById(id);

        // Si l'item n'a pas été retrouvé
        if (se == null)
            return alert("L'item n'existe pas");

        // Enregistrer l'id du moteur
        idSelectedItems = [id];

        // Ouvrir la popup
        modalDeleteItem = true;
    }
    function deleteSelectedItem() {
        // Suppression des élements sélectionnés
        for (let ii=0; ii<idSelectedItems.length; ii++) {
            listSearchEngines.deleteById(idSelectedItems[ii]);
        }

        // Vider la liste des items sélectionnés (car les items n'existent plus)
        idSelectedItems = [];

        // Ferme tous les popups
        closeModals()
    }
    function parseType(type) {
        // Affichage du type dans le tableau
        let template = {
            icon: "warning",
            text: "(inconnu)"
        }

        // Parsing
        switch (type) {
            case SearchEngineType.web:
                template.icon = "web"
                template.text = "Web"
                break;
            case SearchEngineType.images:
                template.icon = "image"
                template.text = "Images"
                break;
            case SearchEngineType.videos:
                template.icon = "play"
                template.text = "Vidéos"
                break;
            case SearchEngineType.music:
                template.icon = "music"
                template.text = "Musiques"
                break;
            case SearchEngineType.files:
                template.icon = "file"
                template.text = "Fichiers"
                break;
            case SearchEngineType.mails:
                template.icon = "mail"
                template.text = "Courriers"
                break;
            case SearchEngineType.news:
                template.icon = "blog"
                template.text = "Actualités"
                break;
        }

        return template
    }
</script>

<div class="toolbar">

    <Button title="Ajouter un moteur de recherche" kind="primary" on:click={() => (modalAddItem = true)}>
        <Icofont icon="plus" size="18" />
        <span>Ajouter un moteur de recherche</span>
    </Button>

    <span class="spacer"></span>

    <!--Button title="Affichage" kind="ghost">
        <Icofont icon="squares" size="18" />
        <span>Affichage</span>
    </Button-->
    <!-- ContextMenu -->

</div>

<DataTable sortable headers={tableColumns} rows={tableData}>

    <svelte:fragment slot="cell-header" let:header>
        {header.value}
    </svelte:fragment>

    <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === "name"}
            <div class="name">
                <img src="{row.icon}" alt="Logo de {row.name}"/>
                <span class="text">{row.name}</span>
            </div>
        {:else if cell.key === "type"}
            <div class="type">
                <Icofont icon={ parseType(row.type).icon } size="20" />
                <span class="text">{ parseType(row.type).text }</span>
            </div>
        {:else if cell.key === "overflow"}
            <Button title="Voir et tester '{row.name}'" kind="ghost" on:click={() => {displayDetails(row.id)}}>
                <Icofont icon="search" size="18" />
                <span class="text">Aperçu</span>
            </Button>
            <Button title="Modifier '{row.name}'" kind="ghost" on:click={() => {editItem(row.id)}}>
                <Icofont icon="pencil" size="18" />
            </Button>
            <Button title="Dupliquer '{row.name}'" kind="ghost" on:click={() => {duplicateItem(row.id)}}>
                <Icofont icon="duplicate" size="18" />
            </Button>
            <OverflowMenu flipped>
                <OverflowMenuItem danger text="Supprimer" on:click={() => {confirmDeleteItem(row.id)}} />
            </OverflowMenu>
        {:else}
            {cell.value}
        {/if}
    </svelte:fragment>

</DataTable>

<div class="modals">
    <Modal
        bind:open={modalAddItem}
        modalHeading="Créer un moteur de recherche"
        primaryButtonText="Créer"
        secondaryButtonText="Annuler"
        on:click:button--secondary={closeModals}
        on:close={closeModals}
        on:submit={createItem}
    >
        <TextInput
            labelText="Nom du moteur de recherche"
            bind:value={se_name}
            placeholder="Google" required />
        <br/><br/>
        <TextInput
            labelText="Adresse url de la requête"
            placeholder="https://www.domain.com/search?query=%query%"
            helperText="Les occurences du mot clé %query% seront remplacés par la recherche saisie"
            bind:value={se_query}
            required />
        <br/><br/>
        <TextInput
            labelText="Logo du moteur de recherche"
            placeholder="https://www.domain.com/logo.png"
            helperText="Le logo sera placé dans un cadre circulaire"
            bind:value={se_icon}
            required />
    </Modal>

    <Modal
        bind:open={modalPreviewItem}
        modalHeading="Aperçu du moteur de recherche"
        primaryButtonText="Retour"
        on:click:button--secondary={closeModals}
        on:close={closeModals}
        on:submit={closeModals}
    >
        {#if modalPreviewItem}
            <div class="preview">
                <img src="{se_icon}" alt="Logo de {se_name}" />
                <p class="name">{se_name}</p>
                <p class="query">
                    <OutboundLink href="{se_query.replace("%query%", "test")}">{se_query}</OutboundLink>
                </p>
            </div>
        {/if}
    </Modal>

    <Modal
        bind:open={modalEditItem}
        modalHeading="Modifier le moteur de recherche"
        primaryButtonText="Enregister"
        secondaryButtonText="Annuler"
        on:click:button--secondary={closeModals}
        on:close={closeModals}
        on:submit={updateItem}
    >
        <TextInput
            labelText="Nom du moteur de recherche"
            bind:value={se_name}
            placeholder="Google" required />
        <br/><br/>
        <TextInput
            labelText="Adresse url de la requête"
            placeholder="https://www.domain.com/search?query=%query%"
            helperText="Les occurences du mot clé %query% seront remplacés par la recherche saisie"
            bind:value={se_query}
            required />
        <br/><br/>
        <TextInput
            labelText="Logo du moteur de recherche"
            placeholder="https://www.domain.com/logo.png"
            helperText="Le logo sera placé dans un cadre circulaire"
            bind:value={se_icon}
            required />
    </Modal>

    <Modal
        bind:open={modalDeleteItem} danger
        modalHeading="Supprimer {idSelectedItems.length == 1 ? "un moteur" : "des moteurs" } de recherche"
        primaryButtonText="Supprimer"
        secondaryButtonText="Annuler"
        on:click:button--secondary={closeModals}
        on:close={closeModals}
        on:submit={deleteSelectedItem}
    >
        <p>Voulez-vous vraiment supprimer {idSelectedItems.length == 1 ? "le moteur de recherche suivant" : "les moteurs de recherche suivants" } ?</p>
        <br/>

        <div class="list-se">
            {#each idSelectedItems as idItem }
                <div class="se-item">
                    <img src="{searchEngines[findItemIndexById(idItem)].icon}" alt="Logo de {searchEngines[findItemIndexById(idItem)].name}"/>

                    <div class="text">
                        <p class="name">{searchEngines[findItemIndexById(idItem)].name}</p>
                        <p class="query">{searchEngines[findItemIndexById(idItem)].query}</p>
                    </div>
                </div>
            {/each}
        </div>
    </Modal>
</div>

<style lang="scss">
    .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        :global(.bx--btn) {
            justify-content: center;
            align-items: center;
            gap: .5rem;
        }

        .spacer {flex: 1}
    }

    // Tableau
    :global(.bx--data-table-container) {
        padding: 0;

        // Boutons d'action
        :global(.bx--btn) {
            gap: .5rem;

            &:hover {
                background: var(--cds-layer-selected-hover);
            }
        }

        // Bouton menu
        :global(.bx--overflow-menu) {
            display: inline-flex;
            height: 100%;
            padding: .75rem 0rem;
            width: 52px;

            :global(.bx--overflow-menu__icon) {
                width: 1.5rem;
                height: 1.5rem;
            }
        }

        // Nom et type
        .name, .type {
            --icon-size: 25px;

            display: flex;
            align-items: center;
            gap: 10px;

            img {
                width: var(--icon-size);
                height: var(--icon-size);
                border-radius: var(--icon-size);
                box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            }

            .text {font-size: .9em;}
        }
    }

    // Popups
    // - Aperçu
    .preview {
        --icon-size: 120px;

        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        gap: 0rem;

        img {
            width: var(--icon-size);
            height: var(--icon-size);
            border-radius: var(--icon-size);
            box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            margin-bottom: 1rem;
        }

        p {
            text-align: center;
            padding: 0;
        }

        .name {font-size: 2em;}
    }

    // - Liste des moteurs sélectionnés
    .list-se {
        --icon-size: 35px;

        display: flex;
        flex-flow: column;
        padding: 0 2rem;

        .se-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: .5rem 0;
            gap: 1rem;

            img {
                width: var(--icon-size);
                height: var(--icon-size);
                border-radius: var(--icon-size);
                box-shadow: 0 0 0 1px rgba(127,127,127,.5);
            }

            .text {
                flex: 1;

                p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .name {font-weight: bold;}
            }
        }
    }
</style>