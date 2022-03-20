<script>
    // Imports
    import { aliasAddSearchEngine, aliasRemoveSearchEngine, aliasReplaceSearchEngine } 
        from '../../Stores/settings'
    import { Breadcrumb, BreadcrumbItem, Link, CodeSnippet }
        from "carbon-components-svelte";
    import { pageName, pageIcon }
        from '../../Stores/header'



    // MAJ du header
    pageName.set("Aide")
    pageIcon.set("info")
    const TITLE_PAGE = "La recherche"



    // Propriétés internes
    const BREADCRUMBS = [
        {title: "Aide", url: "/#/help"},
        {title: TITLE_PAGE, url: "/#/help/search", current: true},
    ]
    const copiedToClipboard = "Texte copié dans le presse-papier"
</script>

<main class="help-section">
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



    <h3 class="format">La barre de recherche</h3>
    <p class="format">Composant central de la page de recherche, la barre de recherche permet de
        lancer une recherche sur un ou plusieurs sites web via les moteurs de recherches sélectionnés.</p>



    <h3 class="format">Les moteurs de recherche</h3>
    <p class="format">Les moteurs de recherche permettent d'effectuer une recherche en ligne. Vous
        pouvez les définir, modifier et supprimer depuis votre
        <Link href="/#/library/search-engines" size="lg">bibliothèque</Link>.</p>
    <p class="format">Pour créer un moteur de recherche dans la bibliothèque, il vous faut les
        éléments suivants :</p>
    <ul class="format">
        <li>Le <strong>nom du moteur de recherche</strong> (obligatoire) : le nom
            qui définit le moteur de recherche ou le site web concerné ;</li>
        <li><strong>L'adresse URL pour la recherche</strong> (obligatoire) :
            l'adresse URL dans lequel la requête sera placée pour lancer la
            recherche. La requête saisie dans le formulaire de recherche va
            remplacer les occurrences du mot clé "%query%" ;</li>
        <li><strong>L'adresse URL du logo</strong> (obligatoire) : le logo obtenu
            via l'adresse URL qui est affiché dans une icône arrondie dans un ratio
            1:1 ;</li>
        <li><strong>L'alias</strong> du moteur de recherche (facultatif) : le
            raccourci pour sélectionner (ou désélectionné) le moteur depuis la
            barre de recherche (cf. Les Alias) ;</li>
    </ul>



    <h3 class="format">Les profils de recherche</h3>
    <p class="format">Un profil de recherche est un ensemble de moteurs de recherche configuré. L'objectif
        est de permettre de définir plusieurs profils de recherche selon divers catégories
        (web, images, vidéos, etc.). Ainsi, il vous est possible de les utiliser depuis le
        haut de la <Link href="/#/" size="lg">page de recherche</Link>.</p>
    <p class="format">Vous avez la possibilité de créer/modifier et supprimer autant profils de recherche
        que vous désirez depuis la
        <Link href="/#/library/search-profiles" size="lg">bibliothèque</Link>.</p>



    <h3 class="format">Les alias des moteurs de recherche</h3>
    <p class="format">Les alias sont des raccourcis pour utiliser des moteurs de recherche. Lorsque
        la fonctionnalité est activée, vous pouvez de sélectionner (ou désélectionner)
        un moteur de recherche depuis la barre de recherche.</p>
    <p class="format">Pour l'utiliser, il suffira alors de saisir un des préfixes, selon l'action que
        vous souhaitez réaliser suivi de l'alias du moteur de recherche concerné. Tapez
        ensuite `espace` pour exécuter votre alias sinon il ne sera pas traité.</p>
    <p class="format">Par exemple si vous saisissez :</p>
    <ul class="format">
        <li>"<CodeSnippet type="inline"
                feedback={copiedToClipboard}
                code="{$aliasAddSearchEngine}g " />", vous sélectionnerez
            le moteur de recherche dont l'alias est "g".</li>
        <li>"<CodeSnippet type="inline"
                feedback={copiedToClipboard}
                code="{$aliasRemoveSearchEngine}b " />", vous retirerez de
            la sélection le moteur de recherche dont l'alias est "b".</li>
        <li>"<CodeSnippet type="inline"
                feedback={copiedToClipboard}
                code="{$aliasReplaceSearchEngine}q " />", vous remplacerez
            les moteurs de recherche sélectionnés par celui dont l'alias est "q".</li>
    </ul>
    <p>Vous pouvez paramétrer les préfixes des alias dans la page des
        <Link href="/#/preferences" size="lg">préférences</Link>.
        Vous n'avez droit qu'à un seul caractère par préfixe. Il est conseillé d'utiliser
        des caractères spéciaux pour les préfixes
    </p>
</main>

<style lang="scss">
    @import './Help.scss';
</style>