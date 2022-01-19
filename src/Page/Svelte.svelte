<script>
import {fade} from 'svelte/transition'
</script>

<main in:fade="{{duration: 500}}">
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<p class="red">Installation de Svelte avec Sass : https://daveceddia.com/svelte-with-sass-in-vscode/</p>
</main>

<style lang="scss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>