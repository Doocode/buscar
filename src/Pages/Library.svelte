<script>
    // Imports
    import { ButtonSet, Button, Link } from "carbon-components-svelte";
    import { pageName, pageIcon } from '../Stores/header'
    import Icofont from '../UI/Icofont.svelte'

    // MAJ du header
    pageName.set("Bibliothèque")
    pageIcon.set("details")
</script>

<main id="librairyPage">
    <Link href="/#/library/search-engines" size="lg">
        <Icofont icon="search" />
        <span class="label">Moteurs de recherche</span>
    </Link>
    <Link href="/#/library/search-profiles" size="lg">
        <Icofont icon="search_group" />
        <span class="label">Profils de recherche</span>
    </Link>
    <Link href="/#/library/background-images" size="lg">
        <Icofont icon="image" />
        <span class="label">Fonds d'écran</span>
    </Link>
    <Link href="/#/library/bookmarks" size="lg">
        <Icofont icon="bookmark" />
        <span class="label">Marque-pages</span>
    </Link>
</main>

<style lang="scss">
    main#librairyPage {
        display: flex;
        flex-flow: wrap;
        gap: .5rem;

        :global(.bx--link) {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: flex-start;
            gap: .5rem;
            padding: 1rem .5rem;
            border-radius: 10px;

            :global(.icofont) {
                font-size: 50px;
            }
        }

        .label {
            font-size: .8em;
            width: 110px;
            text-align: center;
        }
    }

    @media (max-width: 672px) {
        main#librairyPage {margin: var(--cds-spacing-05);}
    }

    @media (min-width: 672px) {
        main#librairyPage {
            margin: var(--cds-spacing-06) auto;
            max-width: 1100px;
        }
    }
</style>