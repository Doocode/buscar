<script>
    // Imports
    import {push, pop, replace, location} from 'svelte-spa-router'
    import {ButtonSet, Button, Link } from "carbon-components-svelte";
    import {elasticOut, quintOut} from 'svelte/easing';
    import {fade, fly} from 'svelte/transition'; // Liste des transitions : https://svelte.dev/docs#run-time-svelte-transition
    import Icofont from './Icofont.svelte';

    // Attributs à définir
    export let appname = "Lorem ipsum";

    // Attributs internes
    let contrastMode = "g10"; // g10 / g100
    let pageName = "Accueil";
    let pageIcon = "screen";
    let menuWidth = 300;

    // Flags
    let backButton_visible = true;
    let leftMenu_visible = false;
    let rightMenu_visible = false;
    let transparentBg = false;

    // Réactivité
	$: document.documentElement.setAttribute("theme", contrastMode);
    $: canGoBack = $location != "/";
    $: { // Affichage du titre et de l'icône
        // Diviser l'url pour obtenir les différentes sections
        let sections = ($location).split("/");

        // Titre par défaut
        pageName = "Page non trouvée";
        pageIcon = "disable";
        transparentBg = false;

        // Parser l'url pour déterminer l'icône et le titre de la page
        if (sections.length > 1) {
            switch (sections[1]) {
                case "":
                    pageName = "Accueil";
                    pageIcon = "home";
                    transparentBg = true;
                    break;
                case "carbon":
                    pageName = "Carbon pour Svelte";
                    pageIcon = "project";
                    break;
                case "svelte":
                    pageName = "Svelte";
                    pageIcon = "pie_chart";
                    break;
                case "config":
                    pageName = "Paramètres";
                    pageIcon = "config";
                    break;
                case "about":
                    pageName = "A propos de";
                    pageIcon = "info";
                    break;
            }
        }
    }

    // Méthodes
    function toggleLeftMenu() {
        leftMenu_visible = !leftMenu_visible;
        rightMenu_visible = false;
    }
    function toggleRightMenu() {
        rightMenu_visible = !rightMenu_visible;
        leftMenu_visible = false;
    }
    function goBack() {
        pop();
        backButton_visible = !backButton_visible
    }
    function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

<header class:transparent="{transparentBg}">
    <div class="left">
        {#if canGoBack}
            <span in:fade out:whoosh>
                <Button kind="tertiary" class="btn-back" title="Retour vers la page précédente" on:click={goBack}>
                    <Icofont icon="arrow_left" size="20" />
                </Button>
            </span>
        {/if}
        
        <Button kind="ghost" title="Menu de navigation" on:click={toggleLeftMenu}>
            <Icofont icon="menu" size="20" />
        </Button>
    </div>
    <div class="center">
        <Icofont icon="{pageIcon}" />
        <h1>{pageName}</h1>
    </div>
    <div class="right">
        <!--Button kind="ghost" title="S'identifier">
            <Icofont icon="profile" size="20" />
        </Button-->
        <Button kind="ghost" title="Réglages" on:click={toggleRightMenu}>
            <Icofont icon="settings" size="20" />
        </Button>
    </div>
</header>

{#if leftMenu_visible}
    <nav 
        class="menu-left" 
        bind:clientWidth={menuWidth}
        transition:fly="{{duration: 300, x: -menuWidth, y: 0, opacity: 1, easing: quintOut}}"
    >
        <div class="head">
            <Button 
                kind="tertiary" 
                on:click="{toggleLeftMenu}" 
                style="border-radius: 5px; gap: 5px; min-height: auto; padding: 10px;"
            >
                <Icofont icon="cross" />
                <span class="label">Fermer le menu</span>
            </Button>

            <div class="appIdent">
                <Icofont icon="search" size="50" />
                <p class="title">{appname}</p>
            </div>
        </div>

        <div class="links" on:click="{toggleLeftMenu}" >
            <Link href="/#/" size="lg">
                <Icofont icon="home" />
                <span class="label">Accueil</span>
            </Link>
            <Link href="/#/bookmarks" size="lg">
                <Icofont icon="squares" />
                <span class="label">Favoris</span>
            </Link>
            <Link href="/#/network" size="lg">
                <Icofont icon="compass" />
                <span class="label">Réseau</span>
            </Link>

            <span class="blank-space"></span>

            <Link href="/#/settings" size="lg">
                <Icofont icon="config" />
                <span class="label">Paramètres</span>
            </Link>

            <span class="blank-space"></span>

            <Link href="/#/about" size="lg">
                <Icofont icon="info" />
                <span class="label">A propos</span>
            </Link>
            <Link href="/#/svelte" size="lg">
                <span class="label">Svelte</span>
            </Link>
            <Link href="/#/carbon" size="lg">
                <span class="label">Carbon</span>
            </Link>
        </div>
    </nav>
{/if}

<div
    class="menu-right"
	class:expanded="{rightMenu_visible}"
>
    <h2>Réglages</h2>
    <ButtonSet stacked style="width: 100%">
        {#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
            <Button
                disabled={contrastMode === value}
                kind="secondary"
                on:click={() => {
                    contrastMode = value;
                }}
            >
                Mode "{value}"
            </Button>
        {/each}
    </ButtonSet>
</div>

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

        :global(.btn-back) {border-radius: 50px;}

        > .left, > .right, > .center {display: flex;}

        > .left, > .right {
            flex: 2;

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

            > .center {display: none;}
            > .left, > .right {pointer-events: all;}
        }
    }

    .menu-left {
        min-width: 300px;
        background: var(--cds-ui-01, #fff);
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
            }
        }
    }

    .menu-right {
        margin: 25px;
        //min-width: 250px;
        background: var(--cds-ui-01, #fff);
        border-radius: 10px;
        box-shadow: 0 0 50px rgba(0,0,0,.3);
        overflow: auto;
        transition: all .2s;

        display: flex;
        flex-flow: column;

        position: absolute;
        top: 92px;
        right: -300px;
        z-index: 100;

        display: none;
        &.expanded {right: 0px; display: flex;}

        h2 {
            margin: 25px;
            font-size: 20px;
        }
    }


    @media (max-width: 672px) {
		header {
			padding: 5px;

            > .center {
                h1 {font-size: 18px;}
                :global(.icofont) {font-size: 18px;}
            }
		}

        .menu-left {
            width: 100%;
        }
        
        .menu-right {
            top: 52px;
        }
	}
</style>