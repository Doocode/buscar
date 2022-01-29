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

	// - Pages
	import Header from './UI/Header.svelte'
	import Search from './Page/Search.svelte'
	import Library from './Page/Library.svelte'
	import Preferences from './Page/Preferences.svelte'
	import About from './Page/About.svelte'

	// Propriétés
	let currentContrastMode;

	// Observations
	const unsub_contrastMode = contrastMode.subscribe(value => {
		currentContrastMode = value;
	});

	// Lifecycle
	onDestroy(() => {
		// Unsubscriptions
		unsub_contrastMode();
	});

	// Application du contraste
	$: document.documentElement.setAttribute("theme", currentContrastMode);
</script>

<main>
	<Header bind:appname={appname} />

	<Router routes={{
		'/': Search,
		'/about': wrap({
			component: About,
			props: {
				appname: appname, 
				appversion: appversion,
				license: license,
			}
		}),
		'/library': Library,
		'/preferences': Preferences,
	}} />
</main>

<style lang="scss">
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