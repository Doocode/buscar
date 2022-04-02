<script>
    // Exports
    /**
     * Les paramètres depuis le routeur (svelte-spa-router)
     * @type {object}
     */
    export let params = {}



    // Imports
    import { Breakpoint }
        from 'carbon-components-svelte'
    import { push, pop, replace, link }
        from 'svelte-spa-router'
    import { pageName, pageIcon }
        from '../Stores/header'
    import { onMount }
        from 'svelte'
    import Router
        from 'svelte-spa-router'
    import PageLinks
        from '../UI/PageLinks.svelte'
    import Display
        from './Preferences/Display.svelte'
    import Search
        from './Preferences/Search.svelte'
    import QuickSettings
        from './Preferences/QuickSettings.svelte'



    // Propriétés internes
    const ROUTER_PREFIX = '/preferences'
    const ROUTES = {
        '/search':          Search,
        '/interface':       Display,
        '/quick-settings':  QuickSettings,
        '/':                Display,
    }
    let pages = [
        {name: "Apparence", path: "interface", icon: "screen"},
        {name: "Recherche", path: "search", icon: "search"},
        {type: "separator"},
        {name: "Réglages rapides", path: "quick-settings", icon: "settings"},
    ]
    let size



    // MAJ du header
    pageName.set("Préférences")
    pageIcon.set("config")



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
                    return push(ROUTER_PREFIX + '/interface')
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

<main class="preferences">
    {#if isNavMenuVisible}
        <div class="nav-section">
            <h2>Préférences</h2>
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
                routes={ROUTES}
                prefix={ROUTER_PREFIX} 
                on:routeLoaded={onRouteLoaded} />
        </div>
    {/if}
</main>

<style lang="scss">
    main.preferences {
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
        main.preferences {
            padding: 1rem;
            flex: 1;

            // Navigation
            .nav-section {flex: 1}
        }
    }

    @media (max-width: 1056px) { // width < lg
        main.preferences {
            // Navigation
            :global(.page-links) {
                margin: 1rem -.5rem;
            }
        }
    }

    @media (min-width: 1056px) { // width > lg
        main.preferences {
            .nav-section {
                width: 250px;
            }
            .router-section {
                flex: 1;
            }
        }
    }
</style>