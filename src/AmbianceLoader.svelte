<script>
	// Imports
	import { contrastMode, customAmbiance, defaultLightMode, defaultDarkMode,
        planningAmbiances }
		from './Stores/settings'
    import { onDestroy, onMount }
        from 'svelte'
    import ScheduleAmbiance
        from './ScheduleAmbiance.svelte'



	// Propriétés
	let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')



    // Réactivité
	// - Application du contraste
	$: updateContrastMode($contrastMode, $customAmbiance, $planningAmbiances,
        $defaultLightMode, $defaultDarkMode)



    // Lifecycle
    onMount(() => {
        prefersDarkMode.addEventListener('change', updateContrastMode)
    })
    onDestroy(() => {
        prefersDarkMode.removeEventListener('change', updateContrastMode);
    })



	// Fonctions
	const updateContrastMode = () => {
		switch ($contrastMode) {
			case "custom":
				return document.documentElement.setAttribute("theme", $customAmbiance)
			case "browser":
				if (prefersDarkMode.matches)
					return document.documentElement.setAttribute("theme", $defaultDarkMode)
				else
					return document.documentElement.setAttribute("theme", $defaultLightMode)
			case "planning":
				return loadCurrentScheduledAmbiance()
		}
	}
	const loadCurrentScheduledAmbiance = () => {
        // Initialisation
        const date = new Date()
        const h = date.getHours()
        const m = date.getMinutes()
		let ambiance = "white"

        // Rechercher l'heure de debut de l'ambiance actuelle
        $planningAmbiances
		.sort((a, b) => {
			let aSplit = a.time.split(":")
			let bSplit = b.time.split(":")
            
            // Tri sur l'heure
            if (parseInt(aSplit[0]) < parseInt(bSplit[0]))
                return -1
            if (parseInt(aSplit[0]) > parseInt(bSplit[0]))
                return 1
            
            // Même heure ==> tri en fonction des minutes
            if (parseInt(aSplit[0]) == parseInt(bSplit[0])) {
                if (parseInt(aSplit[1]) < parseInt(bSplit[1]))
                    return -1
                if (parseInt(aSplit[1]) > parseInt(bSplit[1]))
                    return 1
            }

            // Même heure/minutes
            return 0
		})
		.forEach(function(item) {
			let splitTime = item.time.split(":")
            let itemH = parseInt(splitTime[0])
            let itemM = parseInt(splitTime[1])

            // Si l'heure et les minutes ont déjà été atteint
            // - Si l'heure a été dépassée
            // - ou si même heure mais minutes arrivées ou dépassées
            if (itemH < h || (itemH == h && itemM <= m))
				ambiance = item.ambiance
        })

		document.documentElement.setAttribute("theme", ambiance)
	}
</script>

<main>
    {#if $contrastMode == "planning"}
        {#each $planningAmbiances as schedule}
            <ScheduleAmbiance time={schedule.time} ambiance={schedule.ambiance} />
        {/each}
    {/if}
</main>
