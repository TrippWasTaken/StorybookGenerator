<script lang="ts">
  import { onMount } from "svelte"
  import DropdownProps from "./DropdownProps.svelte"
  import ComparisionTable from "./ComparisionTable.svelte"
  import {
    CREATE,
    FILE_INFO,
    MOUNT_CHECK,
    OVERWRITE,
    UPDATE,
  } from "../enums/messageTypes"
  interface fileValue {
    component: string
    componentProps: any
    story: string | null
    storyProps: any
  }

  let baseComponentFile: string | null = $state(null)
  let storyFile: string | null = $state(null)
  let storyProps: null | string[] = $state(null)
  let componentProps: null | string[] = $state(null)
  let newPropsFound: null | string[] = $state(null)
  let removedPropsFound: null | string[] = $state(null)
  let searchProps: string = $state("")

  const sendMessage = (type: string) => {
    vscode.postMessage({
      type: type,
      value: null,
    })
  }

  const showCompMessage = () => {
    if (newPropsFound && removedPropsFound)
      return "Props mismatched between both files"
    if (newPropsFound && !removedPropsFound)
      return "new props missing in component"
    else return "props have been removed from component"
  }

  const handleFiles = (value: fileValue) => {
    const {
      component,
      story,
      componentProps: props,
      storyProps: sProps,
    } = value

    baseComponentFile = component
    storyFile = story
    componentProps = props ? Object.keys(props) : null
    storyProps = sProps ? Object.keys(sProps) : null

    if (storyProps && componentProps) {
      const set1 = new Set(componentProps)
      const set2 = new Set(storyProps)
      const set1DifferenceArray = storyProps.filter((key) => !set1.has(key))
      const set2DifferenceArray = componentProps.filter((key) => !set2.has(key))

      newPropsFound =
        set2DifferenceArray.length > 0 ? set2DifferenceArray : null
      removedPropsFound =
        set1DifferenceArray.length > 0 ? set1DifferenceArray : null
    }
  }

  onMount(() => {
    sendMessage(MOUNT_CHECK)
    window.addEventListener("message", (e) => {
      const message = e.data
      // using a switch to prevent unwanted
      // additional messages that may or may not be sent
      switch (message.type) {
        case FILE_INFO:
          handleFiles(message.value)
          break
        default:
          break
      }
    })
  })
</script>

<div class="main-container">
  <div class="heading-container">
    {#if baseComponentFile}
      <h1 class="heading">
        File:
        <span class="vscode-badge">
          {baseComponentFile}
        </span>
      </h1>
    {:else}
      <h1 class="heading">No component currently found</h1>
    {/if}
  </div>
  <hr class="vscode-divider" />
  {#if baseComponentFile}
    <label for="searchBox">Search Props: </label>
    <input
      type="text"
      name="searchBox"
      class="vscode-textfield"
      aria-label="search for prop"
      bind:value={searchProps}
    />

    <hr class="vscode-divider" />

    <DropdownProps
      searchValue={searchProps}
      currentFile={baseComponentFile}
      propsPassed={componentProps}
    />

    {#if storyFile}
      <DropdownProps
        searchValue={searchProps}
        currentFile={storyFile}
        propsPassed={storyProps}
      />
    {:else}
      <p>
        no story file found for <span class="vscode-badge"
          >{baseComponentFile}</span
        >
      </p>
    {/if}

    {#if newPropsFound || removedPropsFound}
      <hr class="vscode-divider" />
      <span class="props-found">{showCompMessage()}</span>
      <ComparisionTable
        newProps={newPropsFound || []}
        removedProps={removedPropsFound || []}
      />
    {/if}

    <div class="button-cont">
      <button
        class="vscode-button block"
        onclick={() =>
          storyFile ? sendMessage(OVERWRITE) : sendMessage(CREATE)}
        >{storyFile ? "Overwrite Story" : "Create Story"}</button
      >

      {#if storyFile && (removedPropsFound || newPropsFound)}
        <button
          class="vscode-button block secondary"
          onclick={() => sendMessage(UPDATE)}>Update Story props</button
        >
      {/if}
    </div>
  {/if}
</div>

<style>
  .main-container {
    height: 100%;
  }
  .button-cont {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .heading {
    font-size: 1rem;
    font-weight: nromal;
    span {
      font-weight: bold;
    }
  }

  .props-found {
    font-size: 1.5rem;
    padding: 5px;
    margin: auto;
    width: 100%;
  }
</style>
