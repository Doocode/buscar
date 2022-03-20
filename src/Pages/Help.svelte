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
    import { Breakpoint, Link }
        from 'carbon-components-svelte'
    import { push, pop, replace, link }
        from 'svelte-spa-router'
    import { wrap }
        from 'svelte-spa-router/wrap'
    import { pageName, pageIcon }
        from '../Stores/header'
    import { onMount }
        from 'svelte'
    import Router
        from 'svelte-spa-router'
    import Search
        from './Help/Search.svelte'
    import About
        from './Help/About.svelte'
    import Icofont
        from '../UI/Icofont.svelte'
    import PageLinks
        from '../UI/PageLinks.svelte'



    // Propriétés internes
    const ROUTER_PREFIX = '/help'
    const ROUTE_PROPS_ABOUT = {
        appname: appname, 
        appversion: appversion,
        license: license,
    }
    const ROUTES = {
        '/search': Search,
        '/about': wrap({
            component: About,
            props: ROUTE_PROPS_ABOUT
        }),
        '/': wrap({
            component: About,
            props: ROUTE_PROPS_ABOUT
        }),
    }
    let pages = [
        {name: "A propos de", path: "about", icon: "info"},
        {type: "separator"},
        {name: "La recherche", path: "search", icon: "search"},
    ]
    let size



    // MAJ du header
    pageName.set("Aide")
    pageIcon.set("info")



    // Lifecycle
    onMount(() => {
        // Parser les paramètres dans l'adresse URL
        parseRouterArgs()
    })



    // Réactivité
    $: isNavMenuVisible = canDisplayNavMenu(size)
    $: isContentVisible = canDisplayContent(size)
    $: parseRouterArgs(size) // Responsivité mobile/tablette/pc



    // Fonctions
    const parseRouterArgs = () => {
        // Si la section n'est pas définie
        if (typeof(params.section) === "undefined" || params.section === null) {
            // En fonction de la taille de l'écran
            switch(size) {
                case "lg":
                case "xlg":
                case "max":
                    return push('/help/about')
            }
        }
    }
    const isCurrentPage = (page) => {
        // Si la section est définie dans l'url
        if (params.section !== null) {
            // Vérifier si la section actuelle correspond à la page
            return params.section === page.path
        }

        // Sinon vérifier si le lien correspond à la page de recherche
        return false
    }
    const isSectionValid = (section) => {
        // Vérifier si la section fait partie des routes définies sans compter les routes '*' et '/'
        let routes = Object.keys(ROUTES)

        // Parcourir les routes existantes
        for (let ii=0; ii<routes.length; ii++) {
            let path = routes[ii]
            let pathSplit = path.split('/')

            // Si la route contient plusieurs caractères et qu'il commence par '/'
            if (path.length > 1 && path.indexOf('/') == 0 && pathSplit.length > 1) {
                if (pathSplit[1] == section) // Si la route correspond
                    return true
            }
        }
    }
    const canDisplayBothSide = () => {
        // Si la taille de l'écran est
        switch (size) {
            case 'lg': // "large"
            case 'xlg': // "extra large"
            case 'max': // "maximale"
                return true // => Pour afficher la navigation et le contenu
        }

        // Sinon afficher un seul coté : navigation ou contenu
        return false
    }
    const canDisplayNavMenu = () => {
        // Afficher le menu de navigation
        // 1. S'il est possible d'afficher les deux parties de la page
        if (canDisplayBothSide())
            return true

        // 2. Sinon si la section attendue est présente ...
        if (params.section !== null) {
            // ... et qu'elle ne correspond pas à une page existante
            return !isSectionValid(params.section)
        }

        // Autrement
        return true // => Afficher
    }
    const canDisplayContent = () => {
        // Afficher le contenu de la page (dans le Router)
        // 1. S'il est possible d'afficher les deux parties de la page
        if (canDisplayBothSide())
            return true

        // 2. Ou sinon si la section attendue est présente ...
        if (params.section !== null) {
            // ... et qu'elle correspond à une page existante
            return isSectionValid(params.section)
        }

        // Autrement
        return false // => Masquer
    }
    const onRouteLoaded = () => {
        // Mise à jour du flag du lien actif
        for (let ii=0; ii<pages.length; ii++) {
            let link = pages[ii]
            if (typeof(link.path) !== "undefined")
                pages[ii].current = isCurrentPage(link)
        }

        pages = pages
    }
</script>

<Breakpoint bind:size={size} />

<main class="help">
    {#if isNavMenuVisible}
        <div class="nav-section">
            <h2>Aide</h2>
            <PageLinks
                links={pages}
                legend={(size == "sm" || size == "md") ? "" : "Navigation"}
                linkPrefix="/#{ROUTER_PREFIX}/"
                size={(size == "sm" || size == "md") ? "lg" : "sm"} />
        </div>
    {/if}

    {#if isContentVisible}
        <div class="router-section">
            <Router
                routes={ROUTES} prefix={ROUTER_PREFIX} 
                on:routeLoaded={onRouteLoaded} />
        </div>
    {/if}
</main>

<style lang="scss">
    main.help {
        display: flex;
        max-width: 1100px;
        margin: auto;
        padding: 2rem 2rem;
        gap: 2rem;
        position: relative;
        transition: all .5s;

        // Navigation
        .nav-section {
            position: sticky;
            top: 2rem;
            align-self: flex-start;
        }

        // Section affiché depuis le Router
        .router-section {
            flex: 1;
        }
    }

    @media (max-width: 672px) { // width < md
        main.help {
            padding: 1rem;
            flex: 1;

            // Navigation
            .nav-section {flex: 1}
        }
    }

    @media (max-width: 1056px) { // width < lg
        main.help {
            // Navigation
            :global(.page-links) {
                margin: 1rem -.5rem;
            }
        }
    }

    @media (min-width: 1056px) { // width > lg
        main.help {
            .nav-section {
                width: 250px;
            }
            .router-section {
                flex: 1;
            }
        }
    }
</style>