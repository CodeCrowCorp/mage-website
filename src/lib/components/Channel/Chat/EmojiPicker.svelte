<script lang="ts">
    import { onMount } from "svelte";
    import IconChatEmoji from '$lib/assets/icons/chat/IconChatEmoji.svelte'

    export let onSelect:any

    let container: any;
    let show = false

    onMount(async () => {
        
    // Picker:
    const {Picker} = await import("emoji-picker-element");
    const picker = new Picker({
      locale: "en",
    });
    
    container.appendChild(picker);
    if(onSelect)
    picker.addEventListener('emoji-click', event => onSelect(event.detail.unicode));
  });

  const onclick = () => {
    show = !show
  }

</script>

<div>
  <div  class={"dropdown dropdown-top " + (show && "dropdown-open") }>
    <ui class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52" bind:this={container}>
    </ui>
  </div>
</div>
<button
  on:click={onclick}
  type="button"
  class="btn btn-neutral text-white border-none tooltip font-normal normal-case"
  data-tip="Emoji">
  <IconChatEmoji />
  <span class="sr-only">Add emoji</span>
</button>