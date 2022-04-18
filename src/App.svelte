<script>
	// Exports
	export let appname
	export let appversion
	export let license

	// Imports
	// - Packages/modules
	import Router from 'svelte-spa-router'
	import { wrap } from 'svelte-spa-router/wrap'

	// - Stores
	import { transparentHeader, pageIcon, pageName }
		from './Stores/header'

	// - Pages
	import Header from './UI/Header.svelte'
	import Search from './Pages/Search.svelte'
	import Library from './Pages/Library.svelte'
	import SearchEnginesManager from './Pages/Library/SearchEnginesManager.svelte'
	import SearchProfilesManager from './Pages/Library/SearchProfilesManager.svelte'
	import BackgroundImagesManager from './Pages/Library/BackgroundImagesManager.svelte'
	import Preferences from './Pages/Preferences.svelte'
	import Help from './Pages/Help.svelte'

	// - Autres
	import AmbianceLoader from './AmbianceLoader.svelte'
	import Wallpaper from './UI/Wallpaper.svelte'



	// Propriétés
	// - Propriétés pour la page "A propos"
	const HELP_PROPS = {
		appname: appname, 
		appversion: appversion,
		license: license,
	}
	let routes = { // Routes de l'app
		'/': Search,
		'/library/': Library,
		'/library/search-engines': SearchEnginesManager,
		'/library/search-profiles': SearchProfilesManager,
		'/library/background-images': BackgroundImagesManager,

		// Préférences
		'/preferences': Preferences,
		'/preferences/:section': Preferences,
		'/preferences/:section/*': Preferences,
		
		// Aide
		'/help': wrap({
			component: Help,
			props: HELP_PROPS
		}),
		'/help/:section':  wrap({
			component: Help,
			props: HELP_PROPS
		}),
	}



	// Méthodes
	const onRouteLoading = () => {
		// Afficher la barre de titre
		transparentHeader.set(false)
		pageIcon.set("file")
		pageName.set("Page sans nom")
	}
	const formatTitle = (title) => {
        let appName = "Buscar"

        if (title.length > 0 && title != " ")
            return title + " - " + appName
        return appName
    }
</script>

<svelte:head>
    <title>{ formatTitle($pageName) }</title>
</svelte:head>

<main>
	<AmbianceLoader />

	<Wallpaper>
		<Header bind:appname={appname} />
		
		<Router routes={routes}
			on:routeLoading={onRouteLoading} />
	</Wallpaper>
</main>

<style lang="scss">
	main {min-height: 100%;}
	main :global(.bx--modal-content) {
		margin-bottom: 0;
	}

	main {
		// NumberInput
		:global(.bx--number input[type="number"]) {
			margin: 0;
		}
				
		// Bouton menu
		:global(.bx--overflow-menu div.label) {
			display: inline-flex;
			align-items: center;
			gap: var(--cds-spacing-03);
		}
		:global(.bx--overflow-menu-options) {
			width: 250px;
		}
		:global(.bx--overflow-menu-options li) {
			height: 3.5rem;
		}
		:global(.bx--overflow-menu-options button),
		:global(.bx--overflow-menu-options a) {
			flex: 1;
			max-width: initial;
			height: 3.5rem;
		}
	}

	@media (min-width: 672px) {
		:global(.bx--modal-container) {
			border-radius: 10px;
			:global(.bx--modal-close) {border-top-right-radius: 10px;}
			/*:global(.bx--modal-footer) {
				padding: var(--cds-spacing-05);
				background: var(--cds-skeleton-01);
				gap: 5px;
				height: auto;

				:global(.bx--btn) {border-radius: 7px;}
			}*/
		}
	}
</style>