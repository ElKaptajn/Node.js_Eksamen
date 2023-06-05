<script>
    export let rating;
</script>

<span>
    {#each Array(rating) as _, i}
        💪
    {/each}
</span>
