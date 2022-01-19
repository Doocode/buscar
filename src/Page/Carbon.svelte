<script>
	import { Toggle, ProgressBar, Loading, Tabs, Tab, TabContent } from "carbon-components-svelte";
</script>

<main>
	<h2>Carbon Components</h2>
    <h3>Loader</h3>
	<Loading withOverlay={false} small={false} />

    <br>
    <br>
    <h3>Toggle</h3>
    <Toggle labelText="Push notifications" labelA="No" labelB="Yes" />

    <br>
    <br>
    <h3>ProgressBar</h3>
	<ProgressBar labelText="Upload status" helperText="40 MB of 100 MB" style="width: 500px" />

    <br>
    <br>
    <h3>Tabs</h3>
    <Tabs>
        <Tab label="Tab label 1" />
        <Tab label="Tab label 2" />
        <Tab label="Tab label 3" />
        <div slot="content">
            <TabContent>Content 1</TabContent>
            <TabContent>Content 2</TabContent>
            <TabContent>Content 3</TabContent>
        </div>
    </Tabs>
</main>