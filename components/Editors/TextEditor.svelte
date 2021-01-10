<script>
  export let editorElem;
  export let onChange;
  export let value = "";

  const update = e => {
    onChange(e.target.value);
  };
</script>
<style>
					.content-editor {
					  width: 100%;
					  height: 100%;
					  box-sizing: border-box;
					}
</style>

<textarea bind:this={editorElem} class="content-editor" on:change={update}>{value}</textarea>