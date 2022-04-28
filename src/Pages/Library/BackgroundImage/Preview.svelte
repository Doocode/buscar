<script>
    // Exports
    /**
     * L'identifiant du fond d'écran
     * @type {number}
     */
    export let id = 0

    /**
     * Le nom du fond d'écran
     * @type {string}
     */
    export let name = "Lorem ipsum"

    /**
     * L'adresse URL du fond d'écran
     * @type {string}
     */
    export let url = ""

    /**
     * Les types du fond d'écran
     * @type {array}
     */
    export let types = []



    // Imports
    import { Tag, StructuredList, StructuredListRow,
        StructuredListCell, StructuredListBody, }
        from 'carbon-components-svelte'
    import Icofont
        from '../../../UI/Icofont.svelte'
    import { slide }
        from 'svelte/transition'
</script>

<main class="bgModal-preview" transition:slide|local>
    <StructuredList>

        <StructuredListBody>
            <StructuredListRow>
                <StructuredListCell head >Nom</StructuredListCell>
                <StructuredListCell>{name}</StructuredListCell>
            </StructuredListRow>

            <StructuredListRow>
                <StructuredListCell head >Type</StructuredListCell>
                <StructuredListCell>
                    {#each types as item}
                        <Tag>
                            <Icofont icon={item.icon} size="16" />
                            <p class="text">{item.name}</p>
                        </Tag>
                    {/each}
                </StructuredListCell>
            </StructuredListRow>
        </StructuredListBody>

    </StructuredList>

    <img src={url} alt="Fond {name}" />
</main>

<style lang="scss">
    .bgModal-preview {
        // Image
        img {
            max-width: 100%;
            border-radius: 10px;
            margin-bottom: 1rem;
        }

        // Tags
        :global(.bx--tag span) {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: .5rem;
        }
        :global(.bx--tag span .text) {
            padding: 0;
        }

        // Tableau
        :global(.bx--structured-list) {
            margin: 1rem -1rem;
            margin-top: 0;
            width: calc(100% + 2rem);
        }
    }
</style>