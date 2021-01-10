<script>
  export let editorElem;
  export let onChange;
  export let value = { tasks: [] };

  const addTask = e => {
    onChange({
      ...value,
      tasks: [
        ...value.tasks,
        {
          done: false,
          name: "Go somewhere"
        }
      ]
    });
  };
</script>
<style>
</style>
<ul bind:this={editorElem}>
  {#if value.tasks}
  {#each value.tasks as task}
    <li>
      <input type="checkbox" bind:checked={task.done} />
      {task.name}
    </li>
  {/each}
  {/if}
  <li>
    <button on:click={addTask}>+</button>
  </li>
</ul>