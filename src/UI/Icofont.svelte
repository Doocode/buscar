<script>
    export let icon = "square";
    export let size = null;
    //export let rotate = 0;
</script>

{#if typeof(size) !== "undefined" && !isNaN(parseInt(size))}
    <span class="icofont icon-{icon}" style="font-size: {size}px"></span>
{:else}
    <span class="icofont icon-{icon}"></span>
{/if}

<style lang="scss">
    .icofont {
        &:before {display: inline-block;}
        &.rotate-90:before {transform: rotate(90deg);}
        &.rotate-180:before {transform: rotate(180deg);}
        &.rotate-270:before {transform: rotate(270deg);}
    }
</style>