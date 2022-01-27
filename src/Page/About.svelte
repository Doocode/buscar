<script>
    // Imports
    import { Grid, Row, Column, OutboundLink } from "carbon-components-svelte";
    import Icofont from "../UI/Icofont.svelte";

    // Attributs
    export let appname = "Hello world!";
    export let appversion = "0.0";
    export let license = "(inconnue)";

    // Propriétés
    let ref_link = appname.toLowerCase() + ".doocode.xyz";
</script>

<main>
    <h2>Général</h2>
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
                    <p><OutboundLink href="https://www.doocode.xyz/?ref={ ref_link }">Doocode.xyz</OutboundLink></p>
                </Column>
            </Row>
        </Grid>
    </div>

    <br/><br/>
    <p>{appname} Doocode.xyz est une application web permettant de lancer une recherche vers plusieurs moteurs de recherche (ou sites web) en simultanée. L'intérêt est de pouvoir lancer, par exemple une recherche d'un article sur plusieurs commerces en ligne, ou retrouver un fichier sur différents serveurs de stockage.</p>
    <br/>
    <p>{appname} est une réécriture de <OutboundLink href="https://search.doocode.xyz/?ref={ ref_link }">Doosearch</OutboundLink> et en sera le successeur une fois le projet arrivé à terme.</p>
    <br/><br/>

    <h2>Technologies utilisés</h2>
    <p>L'application web {appname} est développé avec l'outil de développement Svelte. Le code source du projet est principalement écrit en TypeScript. L'ensemble des composants graphique utilisés dans {appname} sont issus du Carbon Design System (développé par IBM).</p>

    <br/>
    <ul>
        <li>
            <OutboundLink href="https://svelte.io/?ref={ ref_link }">Svelte</OutboundLink>
            : Compilateur front-end open-source sous licence MIT. L'objectif de Svelte consiste à compiler une application en incluant strictement le code utile pour réduire la taille des fichiers ;
        </li>
        <li>
            <OutboundLink href="https://github.com/ItalyPaleAle/svelte-spa-router">Svelte SPA Router</OutboundLink>
            : Routeur pour application en Svelte 3 spécialement dédié aux SPA (Single Page Application) sous licence MIT;
        </li>
        <li>
            <OutboundLink href="https://www.carbondesignsystem.com/?ref={ ref_link }">Carbon Design System</OutboundLink>
            : Design System open-source développé par IBM proposant du code fonctionnel, des composants graphique et des directives d'interfaces utilisateurs ;
        </li>
        <li>
            <OutboundLink href="https://carbon-components-svelte.onrender.com/?ref={ ref_link }">Carbon Components for Svelte</OutboundLink>
            : Bibliothèque de composants graphique qui implémente le Carbon Design System ;
        </li>
        <li>
            <OutboundLink href="https://sass-lang.com/?ref={ ref_link }">Sass</OutboundLink>
            ; (Syntactically awesome stylesheets) est un langage de script préprocesseur qui est compilé ou interprété en CSS ;
        </li>
        <li>
            <OutboundLink href="https://caolan.github.io/async/v3/?ref={ ref_link }">Async</OutboundLink>
            : Module utilitaire offrant des fonctionnalités asynchrones en JavaScript ;
        </li>
        <!--
            TODO:
            - Sass pour Svelte : https://daveceddia.com/svelte-with-sass-in-vscode/
            - TypeScript
            - Licence LGPL v.3
        -->
    </ul>
    <br/><br/>

    <h2>Icônes</h2>
    <p>La plupart des icônes utilisés dans l'application {appname} ont été dessinés sur Inkscape par Doocode.</p>
</main>

<style lang="scss">
    main {
        padding: 90px;
        max-width: 1100px;
        margin: auto;
        transition: all .5s;
    }

    h2 {margin-bottom: 15px;}

    .table {
        max-width: 500px;
        background: var(--cds-ui-02);
        padding: 1.5rem 0;
        border-radius: 10px;
    }

    ul {
        list-style: disc;
        padding-left: 30px;
        line-height: 1.5em;

        li {margin: .9rem 0;}
    }

    @media (max-width: 672px) {
        main {padding: 15px;}
    }
</style>