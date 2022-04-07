<script>
    // Exports
    export let planning = []
    export let label = ""
    export let currentTime = ""



    // Imports
    import { ambiances } 
        from '../Stores/settings'
    import Icofont
        from "./Icofont.svelte"



    // Réactivité
    $: publicAmbiances = $ambiances.filter(item => item.public)
    $: viewPlanning = formatPlanning(planning, currentTime)



    // Fonctions
    const formatPlanning = () => {
        let list = []

        // Ajout du planning
        planning.forEach(item => {
            // Jointure avec $ambiances
            item.data = publicAmbiances.filter((a) => a.value == item.ambiance)[0]
            item.splitTime = item.time.split(':'), // Pour trier dans l'ordre
            item.follow = false, // Indique si continue après 23:59
            list.push(item) 
        })

        // Trier en fonction de l'heure
        list = list.sort((a, b) => {
            let aH = parseInt(a.splitTime[0]), bH = parseInt(b.splitTime[0])
            let aM = parseInt(a.splitTime[1]), bM = parseInt(b.splitTime[1])

            // Comparer l'heure
            if (aH < bH) return -1
            if (aH > bH) return 1
            
            // Même heure ==> comparer les minutes
            if (aH == bH) {
                if (aM < bM) return -1
                if (aM > bM) return 1
            }

            // Même heure/minutes => pas bouger
            return 0
        })

        // S'il n'y a rien de défini à minuit pile
        if (list[0].time != "0:00") {
            // Créer le début du planning (suite de la veille)
            let last = list[list.length - 1]
            list.unshift({
                follow: true, // Suite du planning avant 0:00
                time: "0:00",
                data: last.data,
                ambiance: last.ambiance,
                splitTime: "0:00".split(':')
            })
        }

        // Formater "time" pour la frise chronologique
        const NB_HOURS = 24 // Nombre d'heures : 0 à 23 (0 pour minuit)
        const MIN_PER_HOUR = 60 // Nombre de minutes dans 1h : 0 à 59
        const MIN_PER_DAY = NB_HOURS * MIN_PER_HOUR // Nombre de minutes dans 1j : 0 à 59
        list.reverse().forEach((item, index)=> {
            let prevItem = list[index-1]
            let start = parseInt(item.splitTime[0]) * MIN_PER_HOUR + parseInt(item.splitTime[1])
            let end = index == 0 ? MIN_PER_DAY : parseInt(prevItem.splitTime[0]) * MIN_PER_HOUR + parseInt(prevItem.splitTime[1])
            list[index].percent = (end * 100 / MIN_PER_DAY) - (start * 100 / MIN_PER_DAY) + "%"
        })

        // Ajout du flag current
        return list.reverse().map(item => {
            let sameTime = item.time == currentTime
            let followLastTime = item.follow && list[list.length - 1].time == currentTime
            item.current = sameTime || followLastTime
            return item
        })
    }
</script>

<main class="planning-progress">
    {#if label.length > 0}
        <legend class="bx--label">{ label }</legend>
    {/if}
    
    {#if viewPlanning.length > 0}
        <div class="progress-bar">
            {#each viewPlanning as item}
                <div class="item-{item.ambiance}"
                    class:current={item.current}
                    style="--percent: {item.percent}"
                    title="{item.data.name} à partir de {item.time}"
                >
                    <Icofont icon={item.data.icon} />
                </div>
            {/each}
        </div>
    {/if}
</main>

<style lang="scss">
    // Planning des ambiances
    main.planning-progress .progress-bar {
        height: 30px;
        border-radius: 50px;
        background: var(--cds-ui-03);
        border: 1px solid var(--cds-ui-03);
        display: flex;
        gap: 1px;

        > div {
            --percent: 100%;
            --bg: #f4f4f4;
            --text: #000;
            background: var(--bg);
            color: var(--text);
            width: var(--percent);
            display: flex;
            align-items: center;
            padding: 0 var(--cds-spacing-03);

            &.current {
                box-shadow: 0 0 0 3px var(--cds-interactive-01);
                z-index: 5;
            }

            &.item-white {
                --bg: #f4f4f4;
                --text: #161616;
            }
            &.item-g10 {
                --bg: #ffffff;
                --text: #161616;
            }
            &.item-g90 {
                --bg: #393939;
                --text: #f4f4f4;
            }
            &.item-g100 {
                --bg: #262626;
                --text: #f4f4f4;
            }

            &:first-child {border-radius: 50px 0 0 50px;}
            &:last-child {border-radius: 0 50px 50px 0;}
        }
    }
</style>