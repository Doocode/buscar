<script>
    // Exports
    /**
     * L'heure de mise en service
     * @type {string}
     */
    export let time = "0:00"
    
    /**
     * L'ambiance à mettre en place
     * @type {string}
     */
    export let ambiance = "white"



    // Imports
    import { onDestroy, onMount }
        from "svelte"



    // Lifecycle
    onDestroy(() => {
        if (timeoutHandle != null)
            clearTimeout(timeoutHandle)
    })
    onMount(() => {
        // Valider l'horaire
        let splitTime = time.split(':')
        if (splitTime.length != 2)
            return
        if (isNaN(splitTime[0]) || isNaN(splitTime[1]))
            return
        let h = parseInt(splitTime[0]),
            m = parseInt(splitTime[1])
        if (h < 0 || h > 23 || m < 0 || m > 59)
            return
        
        // Calculer le temps d'attente pour le minuteur
        let date = new Date()
        let t1 = new Date(2000, 0, 1, date.getHours(), date.getMinutes())
        let t2 = new Date(2000, 0, 1, h, m)

        // Ajouter un jour de plus si le 
        if (t2 < t1)
            t2.setDate(t2.getDate() + 1)

        let ms = t2 - t1

        if (ms > 0)
            timeoutHandle = setTimeout(activateAmbiance, ms)
    })



    // Propriétés
    let timeoutHandle = null



    // Fonctions
    const activateAmbiance = () => {
        document.documentElement.setAttribute("theme", ambiance)
    }
</script>