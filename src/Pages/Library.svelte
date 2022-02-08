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
        <Icofont icon="circles" />
        <span class="label">Moteurs de recherche</span>
    </Link>
    <Link href="/#/library/search-profiles" size="lg">
        <Icofont icon="search" />
        <span class="label">Profils de recherche</span>
    </Link>
</main>

<style lang="scss">
    main#librairyPage {
        display: flex;
        flex-flow: wrap;
        gap: 1rem;

        :global(.bx--link) {
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            justify-content: center;
            gap: .5rem;
            padding: 1rem;

            :global(.icofont) {
                font-size: 50px;
            }
        }

        .label {
            font-size: .8em;
        }
    }

    @media (max-width: 672px) {
        main#librairyPage {margin: var(--cds-spacing-05);}
    }

    @media (min-width: 672px) {
        main#librairyPage {
            margin: var(--cds-spacing-09) auto;
            max-width: 1100px;
            padding: 0 var(--cds-spacing-05);
        }
    }
</style>