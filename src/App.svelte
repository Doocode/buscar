<script lang="ts">
	// Exports
	export let appname: string;
	export let appversion: string;
	export let license: string;

	// Imports
	// - Packages/modules
	import Router, {location, link} from 'svelte-spa-router'
	import {wrap} from 'svelte-spa-router/wrap'
	import { onDestroy } from 'svelte'

	// - Stores
	import { contrastMode } from './Stores/settings'
	import { transparentHeader, pageIcon, pageName } from './Stores/header'

	// - Pages
	import Header from './UI/Header.svelte'
	import Search from './Pages/Search.svelte'
	import Library from './Pages/Library.svelte'
	import SearchEnginesManager from './Pages/Library/SearchEnginesManager.svelte'
	import SearchProfilesManager from './Pages/Library/SearchProfilesManager.svelte'
	import Preferences from './Pages/Preferences.svelte'
	import About from './Pages/About.svelte'

	// Propriétés
	let currentContrastMode // Contraste de l'interface
	let routes = { // Routes de l'app
		'/': Search,
		'/about': wrap({
			component: About,
			props: {
				appname: appname, 
				appversion: appversion,
				license: license,
			}
		}),
		'/library/': Library,
		'/library/search-engines': SearchEnginesManager,
		'/library/search-profiles': SearchProfilesManager,
		'/preferences': Preferences,
	}

	// Observations
	const unsub_contrastMode = contrastMode.subscribe(value => {
		currentContrastMode = value
	})

	// Lifecycle
	onDestroy(() => {
		// Unsubscriptions
		unsub_contrastMode();
	})

	// Application du contraste
	$: document.documentElement.setAttribute("theme", currentContrastMode)

	// Méthodes
	function onRouteLoading() {
		// Afficher la barre de titre
		transparentHeader.set(false)
		pageIcon.set("file")
		pageName.set("Page sans nom")
	}
	const formatTitle = (title:string) => {
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
	<Header bind:appname={appname} />

	<Router routes={routes}
		on:routeLoading={onRouteLoading} />
</main>

<style lang="scss">
	main :global(.bx--modal-content) {
		margin-bottom: 0;
	}

	@media (min-width: 672px) {
		:global(.bx--modal-container) {
			border-radius: 10px;
			:global(.bx--modal-close) {border-top-right-radius: 10px;}
			:global(.bx--modal-footer) {
				padding: var(--cds-spacing-05);
				background: var(--cds-skeleton-01);
				gap: 5px;
				height: auto;

				:global(.bx--btn) {border-radius: 7px;}
			}
		}
	}
</style>