<script lang="ts">
  const { removedProps, newProps } = $props()

  const length =
    removedProps.length > newProps.length
      ? removedProps.length
      : newProps.length
</script>

<table
  class="vscode-table bordered-columns bordered-rows fixed-header zebra comp-table"
  style="width: 100%"
>
  <thead>
    <tr>
      <th>Component</th>
      <th>Story</th>
    </tr>
  </thead>

  <tbody>
    {#each { length } as _, index}
      <tr>
        <td>{newProps?.[index] || ""}</td>
        <td>{removedProps?.[index] || ""}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .comp-table {
    margin-top: 1rem;
  }
</style>
