<script>
    import { onMount } from 'svelte'
    import { themeChange } from 'theme-change'
  
    onMount(() => {
      themeChange(false)
      // false parameter is required for svelte
    })
  </script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="checkbox" class="toggle" id="theme-toggle" data-toggle-theme="light,dark" data-act-class="ACTIVECLASS">
