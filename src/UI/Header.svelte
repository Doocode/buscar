<script>
    // Exports
    export let appname = "Lorem ipsum"



    // Imports
    import { pop, location, push }
        from 'svelte-spa-router'
    import { Button, Link }
        from "carbon-components-svelte"
    import { elasticOut, quintOut }
        from 'svelte/easing'
    import { fade, fly }
        from 'svelte/transition' // Liste des transitions : https://svelte.dev/docs#run-time-svelte-transition
    import Icofont
        from './Icofont.svelte'
    import { allowHeaderBackButton, allowHeaderHomeButton }
        from '../Stores/settings'
    import { pageName, pageIcon, transparentHeader }
        from '../Stores/header'
    import QuickControlsPane
        from './QuickControls/QuickControlsPane.svelte'
    import OutClick
        from 'svelte-outclick'



    // Attributs internes
    let menuWidth = 300 // Largeur du panneau de menu



    // Flags
    let backButton_visible = true
    let leftMenu_visible = false
    let rightMenu_visible = false



    // Réactivité
    $: canGoBack = $location != "/"
    $: canGoHome = $location != "/"



    // Méthodes
    const toggleLeftMenu = () => {
        leftMenu_visible = !leftMenu_visible
        rightMenu_visible = false
    }
    const toggleRightMenu = () => {
        rightMenu_visible = !rightMenu_visible
        leftMenu_visible = false
    }
    const goBack = () => {
        pop()
        backButton_visible = !backButton_visible
    }
    const whoosh = (node, params) => {
		const existingTransform = getComputedStyle(node).transform.replace('none', '')

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		}
	}
</script>

<header class:transparent="{$transparentHeader}">
    <div class="left">
        {#if canGoBack && $allowHeaderBackButton}
            <span in:fade out:whoosh>
                <Button kind="ghost" class="btn-back" title="Retour vers la page précédente" on:click={goBack}>
                    <Icofont icon="arrow_left" size="20" />
                </Button>
            </span>
        {/if}

        {#if canGoHome && $allowHeaderHomeButton}
            <span>
                <Button kind="ghost" class="btn-home" title="Page d'accueil" on:click={() => push('/')}>
                    <Icofont icon="house" size="20" />
                </Button>
            </span>
        {/if}

        <Button kind="ghost" title="Menu de navigation" on:click={toggleLeftMenu}>
            <Icofont icon="menu" size="20" />
        </Button>
    </div>

    <div class="center">
        <Icofont icon="{$pageIcon}" />
        <h1>{$pageName}</h1>
    </div>

    <div class="right">
        <Button kind="ghost" title="Réglages rapides" on:click={toggleRightMenu} >
            <Icofont icon="settings" size="20" />
        </Button>
    </div>
</header>

{#if leftMenu_visible}
    <OutClick on:outclick={toggleLeftMenu} >
        <nav
            class="menu-left"
            bind:clientWidth={menuWidth}
            transition:fly="{{duration: 300, x: -menuWidth, y: 0, opacity: 1, easing: quintOut}}"
        >
            <div class="head">
                <Button 
                    kind="tertiary" 
                    on:click="{toggleLeftMenu}" 
                    style="border-radius: 8px; gap: 10px; min-height: auto; padding: 12px;"
                >
                    <Icofont icon="arrow_left" size="16" />
                    <span class="label">Fermer le menu</span>
                </Button>

                <div class="appIdent">
                    <img src="/assets/pwa-icons/icon-128x128.png" alt="Logo de l'application" />
                    <p class="title">{appname}</p>
                </div>
            </div>

            <div class="links" on:click="{toggleLeftMenu}" >
                <Link href="/#/" size="lg">
                    <Icofont icon="house" />
                    <span class="label">Accueil</span>
                </Link>
                <Link href="/#/search" size="lg">
                    <Icofont icon="search" />
                    <span class="label">Recherche</span>
                </Link>
                <Link href="/#/speeddial" size="lg">
                    <Icofont icon="apps" />
                    <span class="label">Accès rapide</span>
                </Link>
                <!--Link href="/#/network" size="lg">
                    <Icofont icon="compass" />
                    <span class="label">Réseau</span>
                </Link-->

                <span class="blank-space"></span>
                
                <!--Link href="/#/library" size="lg">
                    <Icofont icon="details" />
                    <span class="label">Bibliothèque</span>
                </Link-->
                <Link href="/#/library/search-engines" size="lg">
                    <Icofont icon="search" />
                    <span class="label">Moteurs de recherche</span>
                </Link>
                <Link href="/#/library/search-profiles" size="lg">
                    <Icofont icon="search_group" />
                    <span class="label">Profils de recherche</span>
                </Link>
                <!--Link href="/#/library/background-images" size="lg">
                    <Icofont icon="image" />
                    <span class="label">Fonds d'écran</span>
                </Link-->
                <Link href="/#/library/bookmarks" size="lg">
                    <Icofont icon="bookmark" />
                    <span class="label">Marque-pages</span>
                </Link>

                <span class="blank-space"></span>

                <Link href="/#/preferences" size="lg">
                    <Icofont icon="config" />
                    <span class="label">Préférences</span>
                </Link>

                <span class="blank-space"></span>

                <Link href="/#/help" size="lg">
                    <Icofont icon="info" />
                    <span class="label">Aide</span>
                </Link>
            </div>
        </nav>
    </OutClick>
{/if}

{#if rightMenu_visible}
    <div class="quick-controls">
        <QuickControlsPane on:close={toggleRightMenu} />
    </div>
{/if}

<style lang="scss">
    header {
        background: var(--cds-ui-01);
        box-shadow: 0 0 30px rgba(0,0,0,.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        padding: 25px;
        transition:  all .3s;

        :global(button) {
            padding: 10px;
            gap: 10px;
            border-radius: 10px;
            min-height: auto;
        }

        /*:global(.btn-back),
        :global(.btn-home)
        {border-radius: 50px;}*/

        > .left, > .right, > .center {display: flex;}

        &:not(.transparent) {
            > .left, > .right {
                flex: 2;
            }
        }

        > .left, > .right {
            :global(button:not(.bx--btn--tertiary)) {color: var(--cds-text-01);}
        }

        > .left {justify-content: flex-start; gap: 5px;}
        > .right {justify-content: flex-end;}

        > .center {
            align-items: center;
            gap: 10px;

            h1 {font-size: 20px;}
            :global(.icofont) {font-size: 22px;}
        }

        &.transparent {
            background: transparent;
            box-shadow: none;
            pointer-events: none;
            
            z-index: 1;
            position: relative;

            > .center {display: none;}
            > .left, > .right {pointer-events: all;}
        }
    }

    .menu-left {
        min-width: 300px;
        background: var(--cds-ui-01);
        box-shadow: 0 0 50px rgba(0,0,0,.3);
        transition: background .2s;

        display: flex;
        flex-flow: column;

        position: absolute;
        top: 0; bottom: 0;
        left: 0px;
        z-index: 100;

        .links {
            display: flex;
            flex-flow: column;

            :global(.bx--link) {
                padding: 10px 25px;
                display: flex;
                align-items: center;
                gap: 10px;

                :global(.icofont) {font-size: 18px;}
            }

            .blank-space {height: 25px;}
        }

        .head {
            padding: 25px;
            margin-bottom: 15px;
            border-bottom: 5px solid var(--cds-decorative-01);

            .appIdent {
                margin-top: 35px;
                display: flex;
                align-items: flex-start;
                flex-flow: column;
                gap: 10px;

                .title {font-size: 20px;}
                :global(.icofont) {display: none;}
                img {width: 80px;}
            }
        }
    }

    .quick-controls {
        --margin: 1.3rem;
        position: absolute;
        top: var(--margin);
        right: var(--margin);
        z-index: 100;
        transition: all .3s;
    }


    @media (max-width: 672px) {
		header {
			padding: 5px;

            > .center {
                h1 {font-size: 18px;}
                :global(.icofont) {font-size: 18px;}
            }
		}

        .quick-controls {
            --margin: 1px;
        }
	}
</style>