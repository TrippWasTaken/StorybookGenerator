<script lang="ts">
  import { ChevronDown, ChevronRight } from "lucide-svelte"

  let propDetails: boolean = $state(false)

  const { propsPassed = null, currentFile = null, searchValue = "" } = $props()

  const filterProps = $derived(
    searchValue.length > 1
      ? propsPassed?.filter((item: string) => item.includes(searchValue))
      : propsPassed
  )
</script>

<details
  class="vscode-collapsible details"
  bind:open={propDetails}
>
  <summary>
    {#if propDetails}
      <ChevronDown />
    {:else}
      <ChevronRight />
    {/if}
    <h2 class="title">
      {currentFile} prop keys

      <span class="vscode-badge">
        {filterProps?.length || 0}
      </span>
    </h2>
  </summary>
  <div>
    <div class="props-container">
      {#if filterProps}
        {#each filterProps as prop}
          <span class="prop-display">{prop}</span>
        {/each}
      {:else}
        <div class="props-display">No props found in {currentFile}</div>
      {/if}
    </div>
  </div>
</details>

<style>
  .props-container {
    display: flex;
    max-height: 50%;
    margin-left: 2rem;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    gap: 2px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .details {
    padding: 10px;
    padding-left: 0px;
    background-color: var(--vscode-sideBarSectionHeader-background);
  }
</style>
