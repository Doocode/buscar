<script>
    // Exports
    /**
     * Les paramètres depuis le routeur (svelte-spa-router)
     * @type {object}
     */
    export let params = {}

    /**
     * Le nom de l'application
     * @type {string}
     */
    export let appname = "Hello world"

    /**
     * La version de l'application
     * @type {string}
     */
    export let appversion = "1.0.0"

    /**
     * La license de l'application
     * @type {string}
     */
    export let license = "(inconnue)"



    // Imports
    import { Grid, Row, Column, OutboundLink, Breadcrumb, BreadcrumbItem }
        from "carbon-components-svelte"
    import { pageName, pageIcon }
        from '../../Stores/header'



    // MAJ du header
    pageName.set("A propos")
    pageIcon.set("info")



    // Propriétés
    const TITLE_PAGE = "A propos de " + appname
    const BREADCRUMBS = [
        {title: "Aide", url: "/#/help"},
        {title: TITLE_PAGE, url: "/#/help/about", current: true},
    ]
    const ref_link = appname.toLowerCase() + ".doocode.xyz";
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



    <h3 class="format">Général</h3>
    <figure id="appLogo">
        <img src="/assets/pwa-icons/icon-128x128.png" alt="Logo de l'application" />
        <figcaption>Logo de {appname}</figcaption>
    </figure>
    <div class="table">
        <Grid>
            <Row>
                <Column>
                    <strong>Application</strong>
                    <p>{appname}</p>
                </Column>
                <Column>
                    <strong>Version</strong>
                    <p>{appversion}</p>
                </Column>
                <Column>
                    <strong>Licence</strong>
                    <p>{license}</p>
                </Column>
                <Column>
                    <strong>Organisation</strong>
                    <p><OutboundLink size="lg" href="https://www.doocode.xyz/?ref={ ref_link }">Doocode.xyz</OutboundLink></p>
                </Column>
            </Row>
        </Grid>
    </div>

    <p class="format">{appname} Doocode.xyz est une application web permettant de lancer une recherche vers
        plusieurs moteurs de recherche (ou sites web) en simultanée. L'intérêt est de pouvoir
        lancer, par exemple une recherche d'un article sur plusieurs commerces en ligne, ou
        retrouver un fichier sur différents serveurs de stockage.</p>
    <p class="format">Note : {appname} est une réécriture de <OutboundLink size="lg" href="https://search.doocode.xyz/?ref={ ref_link }">
        Doosearch</OutboundLink> et en sera le successeur une fois le projet arrivé à terme.</p>



    <h3 class="format">Technologies utilisés</h3>
    <p class="format">L'application web {appname} est développé avec l'outil de développement Svelte. Le code source
        du projet est principalement écrit en TypeScript. L'ensemble des composants graphique utilisés
        dans {appname} sont issus du Carbon Design System (développé par IBM).</p>

    <ul class="format">
        <li>
            <OutboundLink size="lg" href="https://svelte.io/?ref={ ref_link }">Svelte</OutboundLink>
            : Compilateur front-end open-source sous licence MIT. L'objectif de Svelte consiste à
            compiler une application en incluant strictement le code utile pour réduire la taille des fichiers ;
        </li>
        <li>
            <OutboundLink size="lg" href="https://github.com/ItalyPaleAle/svelte-spa-router">Svelte SPA Router</OutboundLink>
            : Routeur pour application en Svelte 3 spécialement dédié aux SPA (Single Page Application) sous licence MIT;
        </li>
        <li>
            <OutboundLink size="lg" href="https://www.carbondesignsystem.com/?ref={ ref_link }">Carbon Design System</OutboundLink>
            : Design System open-source développé par IBM proposant du code fonctionnel, des
            composants graphique et des directives d'interfaces utilisateurs ;
        </li>
        <li>
            <OutboundLink size="lg" href="https://carbon-components-svelte.onrender.com/?ref={ ref_link }">Carbon Components for Svelte</OutboundLink>
            : Bibliothèque de composants graphique qui implémente le Carbon Design System ;
        </li>
        <li>
            <OutboundLink size="lg" href="https://sass-lang.com/?ref={ ref_link }">Sass</OutboundLink>
            ; (Syntactically awesome stylesheets) est un langage de script préprocesseur qui est compilé ou interprété en CSS ;
        </li>
        <li>
            <OutboundLink size="lg" href="https://caolan.github.io/async/v3/?ref={ ref_link }">Async</OutboundLink>
            : Module utilitaire offrant des fonctionnalités asynchrones en JavaScript ;
        </li>
        <!--
            TODO:
            - Sass pour Svelte : https://daveceddia.com/svelte-with-sass-in-vscode/
            - TypeScript
            - Licence LGPL v.3
        -->
    </ul>



    <h3 class="format">Icônes</h3>
    <p class="format">La plupart des icônes utilisés dans l'application {appname} ont été dessinés sur Inkscape par Doocode.</p>
</main>

<style lang="scss">
    @import './Help.scss';

    main.help-section {
        .table {
            max-width: 600px;
            background: var(--cds-ui-01);
            padding: 2rem 0;
            border-radius: 15px;
            border: 1px solid var(--cds-decorative-01);
            margin: 1rem 0;

            :global(.bx--row) {gap: 1.5rem;}

            p {margin: .5rem 0 0 0;}
        }

        ul li {margin: 1rem 0;}

        figure {
            &.float-left {
                float: left;
                margin-right: 2rem;
            }
            &.float-right {
                float: right;
                margin-left: 2rem;
            }
        }
    }

    @media (min-width: 1056px) { // width > lg
        #appLogo {
            float: right;
            margin-left: 2rem;
        }
    }

</style>