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

    <h2>Technos utilisés</h2>
    <ul>
        <li>Svelte</li>
        <li>Sass</li>
        <li>Carbon UI</li>
        <li>Svelte SPA Router</li>
    </ul>
</main>

<style lang="scss">
    main {
        padding: 10px;
    }
</style>