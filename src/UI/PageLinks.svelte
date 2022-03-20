<script>
    // Exports
    /**
     * L'arborescence des liens
     * @type {object}
     */
    export let links = {}

    /**
     * La légende à afficher juste avant
     * @type {string}
     */
    export let legend = ""

    /**
     * Le préfixe du lien
     * @type {string}
     */
    export let linkPrefix = ""

    /**
     * La taille des liens
     * @type {"sm" | "lg"}
     */
    export let size = "sm"




    // Imports
    import { Link }
        from 'carbon-components-svelte'
    import Icofont
        from './Icofont.svelte'



    // Fonctions
    const getValue = (value, defaultValue) => {
        if (typeof(value) === "undefined")
            return defaultValue
        return value
    }
</script>

<main>
    <nav
        class="page-links"
        class:large={size.toLowerCase() === "lg"}
    >
        {#if legend.length > 0}
            <p class="legend">{legend}</p>
        {/if}

        <div>
            {#each links as item }
                {#if getValue(item.type, "link") == "separator"}
                    <hr class="separator" />
                {:else}
                    <Link
                        size={size.toLowerCase() == "lg" ? "lg" : ""}
                        href={linkPrefix + getValue(item.path, "/#/")}
                        class={getValue(item.current, false) == true ? 'current' : ''}
                    >
                        <Icofont icon={getValue(item.icon, "arrow-right")} />
                        <span class="label">{getValue(item.name, "Lorem ipsum")}</span>
                    </Link>
                {/if}
            {/each}
        </div>
    </nav>
</main>

<style lang="scss">
    .page-links {
        display: flex;
        flex-flow: column;

        .legend {
            font-size: 12px;
            letter-spacing: .2em;
            text-transform: uppercase;
            margin-bottom: .5rem;
        }

        .separator {
            border: none;
            background: transparent;
            height: var(--cds-spacing-05);
            margin: 0;
        }

        // Lien
        :global(.bx--link) {
            padding: .6rem .7rem;
            display: flex;
            gap: var(--cds-spacing-03);
            align-items: center;
            border-radius: 7px;
            transition: all .2s;

            // Icône
            :global(.icofont) {
                font-size: 18px;
                transition: all .2s;
            }
        }
        :global(.bx--link::before) {
            content: "";
            display: block;
            width: 3px;
            height: 0;
            background: var(--cds-link-01, #0f62fe);
            border-radius: 10px;
            margin-left: -13px;
            margin-right: 2px;
            transition: all .2s;
        }

        // Lien actif
        :global(.bx--link.current::before) {
            height: 16px;
        }
        :global(.bx--link.current) {
            background: var(--cds-selected-ui);
            background: var(--cds-skeleton-01);
            background: var(--cds-ui-01);
        }

        // Lien survolé
        :global(.bx--link:hover) {
            text-decoration: none;
        }
        :global(.bx--link:hover .label) {
            text-decoration: underline;
        }
    }

    .page-links.large {
        // Lien
        :global(.bx--link) {
            gap: var(--cds-spacing-04);
            border-radius: 10px;

            // Icône
            :global(.icofont) {
                --size: 36px;
                font-size: 18px;
                width: var(--size);
                height: var(--size);
                border-radius: var(--size);
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid var(--cds-link-01);
            }
        }

        // Lien actif
        :global(.bx--link::before),
        :global(.bx--link.current::before) {
            display: none;
        }
        :global(.bx--link.current .icofont) {
            border-color: var(--cds-interactive-01);
            background: var(--cds-interactive-01);
            color: var(--cds-text-04);
        }
    }
</style>