<script lang="ts">
    export let label:string = ""
    export let value:any
    export let type = "text"
    export let onChange:any
    export let attr:any

    function typeAction(node:any) {
        node.type = type;
    }
</script>

<div class="form-control w-full mb-4">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span class="label-text">{label}</span>
    </label>
    <input
        bind:value={value}
        use:typeAction
        class="input input-bordered w-full" 
        on:change={onChange}
        {...attr}
    />
</div>