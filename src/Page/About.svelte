<script>
    // Imports
    import { Grid, Row, Column } from "carbon-components-svelte";
    import Icofont from "../UI/Icofont.svelte";

    // Attributs
    export let appname = "Hello world!";
    export let appversion = "0.0";
</script>

<main>
    <h2>Général</h2>
    <Grid>
        <Row>
            <Column>
                <strong>Nom de l'app</strong>
                <p>{appname}</p>
            </Column>
            <Column>
                <strong>Version</strong>
                <p>{appversion}</p>
            </Column>
        </Row>
    </Grid>
    <br/><br/>

    <h2>Libraries et frameworks utilisés</h2>
    <ul>
        <li>Svelte</li>
        <li>Sass</li>
        <li>Carbon UI</li>
        <li>Svelte SPA Router</li>
    </ul>
</main>

<style lang="scss">
    main {
        padding: 90px;
        transition: all .5s;
    }

    h2 {margin-bottom: 15px;}

    ul {
        list-style: disc;
        padding-left: 30px;
        line-height: 1.2em;
    }

    @media (max-width: 672px) {
        main {padding: 15px;}
    }
</style>