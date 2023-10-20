<script lang="ts">
    import { onMount } from 'svelte';
	import { get, put, del, post } from '$lib/api.js'
	import { page } from '$app/stores'

    $: auth = {
		userId: $page.data.user?.userId,
		token: $page.data.user?.token
	}
    let list:any = []
    let payload = {
        url: "",
        streamKey: "" 
    }
    let loading = false
    let model:any 
    let confirmModel = false
    let addModel = false
    let selected = ""

    const addNew = async() => {
       loading = true
       await await put(
        'output',
        payload,
        auth
        )
       loading = false
       getAll()
       addModel = false
       payload = {
        url: "",
        streamKey: "" 
       }
    }

    const remove = async() => {
        loading = true
        await del(`/output?outputId=${selected}`, auth)
        await getAll()
        loading = false
        confirmModel = false
    }

    const getAll = async() => {
       loading = true
       const data = await get('outputs', auth)
       list = data
       loading = false
    }

    onMount(() => {
        getAll()
    })

    const confirm = (id:string) => {
        selected = id
        confirmModel = true
    }

</script>

<div class="flex justify-between items-center">
    <span class="font-semibold text-xl">Restream Urls</span>
    <button class="btn" on:click={()=>{ addModel = true}}>Add New +</button>
</div>

{#each list as item}
    <div class="bg-base-100 p-4 my-1 rounded flex justify-between items-center">
        <div class="flex-1">
            <div class="">{item.url}</div>
            <div>
                <input 
                    value="dummyvalues"
                    type="password" 
                    placeholder="Type here" 
                    class="bg-transparent" 
                    disabled
                />
            </div>
        </div>
        <button 
            on:click={()=> confirm(item._id)}
            class="btn btn-sm btn-circle btn-ghost"
        >
         ✕
        </button>
    </div>
{/each}

<dialog class={`modal ${confirmModel && 'modal-open' }`}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm</h3>
        <p class="py-4">{loading ? 'Please wait...' : 'Are you sure?'}</p>
        <div class="modal-action">
        {#if !loading}
            <form method="dialog">
                <button disabled={loading} class="btn" on:click={remove}>Yes</button>
                <button disabled={loading} on:click={()=>{ confirmModel = false}}>Cancel</button>
            </form>
        {/if}
        </div>
    </div>
</dialog>

<dialog bind:this={model} id="my_modal_1" class={`modal ${addModel && 'modal-open' }`}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">Add New Stream</h3>
        <form method="dialog">
            <button 
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                on:click={()=>{ addModel = false}}
            >✕</button>
        </form>
        <div class="form-control w-full pt-4">
            <label class="label">
                <span class="label-text">Url</span>
            </label>
            <input bind:value={payload.url} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            <label class="label">
                <span class="label-text">Server Key</span>
            </label>
            <input bind:value={payload.streamKey} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
            <button 
                disabled={loading || !payload.url || !payload.streamKey} 
                class="btn btn-primary mt-8"
                on:click={addNew}
            >
            Save
            </button>
        </div>
    </div>
  </dialog>
  
