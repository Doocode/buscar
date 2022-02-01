<script>
    // Imports
    import WebSearchManager from "./Library/WebSearchManager.svelte"
    import { pageName, pageIcon } from '../Stores/header'

    // MAJ du header
    pageName.set("Moteurs de recherche")
    pageIcon.set("circles")
</script>

<WebSearchManager/>
