<script lang="ts">
	export let appname: string;
	export let appversion: string;

	import Router, {location, link} from 'svelte-spa-router'
	import {wrap} from 'svelte-spa-router/wrap'

	import Header from './UI/Header.svelte'
	import Home from './Page/Home.svelte'
	import About from './Page/About.svelte'
	import Svelte from './Page/Svelte.svelte'
	import Carbon from './Page/Carbon.svelte'

	/*let contrastMode = "g100"; // "white" | "g10" | "g80" | "g90" | "g100"
	$: document.documentElement.setAttribute("theme", contrastMode);*/
</script>

<main>
	<Header bind:appname={appname} />

	<Router routes={{
		'/': Home,
		'/about': wrap({
			component: About,
			props: {
				appname: appname, 
				appversion: appversion
			}
		}),
		'/svelte': Svelte,
		'/carbon': Carbon,
	}} />
</main>

<style lang="scss">
	@media (min-width: 640px) {
		:global(.bx--modal-container) {
			border-radius: 10px;
		}
		:global(.bx--modal-close) {border-top-right-radius: 10px;}
		:global(.bx--modal-footer .bx--btn:first-child) {border-bottom-left-radius: 10px;}
		:global(.bx--modal-footer .bx--btn:last-child) {border-bottom-right-radius: 10px;}
	}
</style>