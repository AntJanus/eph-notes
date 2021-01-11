<script>
			import { log, runEffect } from "./utils";
			import uuid from "uuid/v4";
			import Icon from "fa-svelte";
			import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
			import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
			import { faSave } from "@fortawesome/free-solid-svg-icons/faSave";
			import { faStickyNote } from "@fortawesome/free-solid-svg-icons/faStickyNote";
			import { faListAlt } from "@fortawesome/free-solid-svg-icons/faListAlt";
			import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

			import TextEditor from "./components/Editors/TextEditor.svelte";
			import ToDoList from "./components/Editors/ToDoList.svelte";

			let notes = [
			  {
			    id: uuid(),
			    title: "Note 1",
			    content: "notes 123445",
			    type: "text",
			    created_at: new Date(),
			    updated_at: new Date()
			  },
			  {
			    id: uuid(),
			    title: "Note 2",
			    content: "note445",
			    type: "text",
			    created_at: new Date(),
			    updated_at: new Date()
			  }
			];
			let currentNote = 0;
			let noteEditor;
			let editNameNote = {};
			let editNameEditor;
			let lastUpdated = null;

			const switchToNote = idx => e => {
			  e.preventDefault();
			  currentNote = idx;
			};

			const addNote = e => {
			  e.preventDefault();

			  notes = [
			    ...notes,
			    {
			      id: uuid(),
			      title: "New note",
			      type: "text",
			      content: "",
			      created_at: new Date(),
			      updated_at: new Date()
			    }
			  ];
			};

			const addTaskList = e => {
			  e.preventDefault();

			  notes = [
			    ...notes,
			    {
			      id: uuid(),
			      title: "New task list",
			      type: "tasklist",
			      created_at: new Date(),
			      updated_at: new Date()
			    }
			  ];
			};

			const renameNote = note => e => {
			  e.preventDefault();

			  editNameNote = note;
			};

			const deleteNote = idx => e => {
			  e.preventDefault();

			  notes = notes.filter((note, i) => i !== idx);
			};

			const updateNote = idx => value => {
			  notes = notes.map((note, i) => {
			    if (i === idx) {
			      return {
			        ...note,
			        content: value,
			        updated_at: new Date()
			      };
			    }

			    return note;
			  });
			};

			const updateNoteName = (originalNote, update) => e => {
			  e.preventDefault();

			  notes = notes.map((note, i) => {
			    if (originalNote.id === note.id) {
			      return {
			        ...note,
			        ...update,
			        updated_at: new Date()
			      };
			    }

			    return note;
			  });

			  editNameNote = {};
			};

			let save;
			$: save = runEffect(() => {
			  console.log(JSON.stringify(localStorage.removeItem("ephNotes")));
			  const ephNotes = JSON.parse(localStorage.getItem("ephNotes"));

			  if (!ephNotes) {
			    return localStorage.setItem("ephNotes", notes);
			  }

			  if (new Date(ephNotes.date) > lastUpdated || !lastUpdated) {
			    notes = ephNotes.notes;
			    lastUpdated = ephNotes.date;

			    return;
			  }

			  lastUpdated = new Date();

			  console.log("Test: ", JSON.stringify({ notes, date: lastUpdated }));
			  localStorage.setItem(
			    "ephNotes",
			    JSON.stringify({ notes, date: lastUpdated })
			  );
			});

			let focus;
			$: focus = runEffect(() => {
			  if (editNameNote && editNameEditor) {
			    return editNameEditor.focus();
			  }

			  if (currentNote && noteEditor) {
			    noteEditor.focus();
			  }
			});
</script>

<style>
	button {
	  cursor: pointer;
	}

	.tabs {
	  list-style: none;
	  display: flex;
	  flex-wrap: no-wrap;
	  align-items: baseline;
	  margin: 0;
	  padding: 0;
	  width: 100%;
	  overflow-x: auto;
	}

	.tab {
	  background: #aeaeae;
	  margin-right: -5px;
	  border: 1px solid #333;
	  border-top-left-radius: 4px;
	  border-top-right-radius: 4px;
	  flex: 0 0 auto;
	  font-size: 10px;
	}

	.tab button {
	  border: 0;
	  background: none;
	  padding: 5px 10px;
	  margin: 0;
	  margin-bottom: -1px;
	}

	.tab input[type="text"] {
	  padding: 5px;
	  margin: 0;
	  border: 0;
	}

	.tab button:first-child {
	  padding-right: 15px;
	  margin-right: 5px;
	}

	.tab button:hover {
	  background: #333;
	  color: #fff;
	}
	.tab button:active {
	  background: #000;
	  color: #fff;
	}

	.tab > button,
	.tab > input[type="text"] {
	  margin-right: -5px;
	}

	.tab > button:last-child {
	  margin-right: 5px;
	}

	.tab.active {
	  background: #fff;
	  z-index: 10;
	  border-top: 4px solid orangered;
	}

	.tab.editing {
	  background: #aeaeae;
	  z-index: 10;
	}

	.tab .button-icon {
	  font-size: 12px;
	  padding: 1px 3px;
	}

	.tab.tab-add button {
	  padding-right: 10px;
	  margin-right: 0;
	}

	main {
	  height: 100%;
	  padding: 0 10px;
	}

	.container {
	  height: 100%;
	  display: grid;
	  grid-template-rows: 45px 1fr;
	}

	h1 {
	  margin: 5px;
	  font-size: 26px;
	  text-transform: uppercase;
	  font: "Open Sans", sans-serif;
	}

	:global(html),
	:global(body) {
	  height: 100%;
	}

	:global(body) {
	  overflow: hidden;
	  margin: 0;
	  padding: 0;
	}

	.tab button.save-icon {
	  margin-right: 0;
	}

	.delete-button {
	  color: red;
	}

	.rename-button {
	  color: #235c6d;
	}
</style>

<main>
<h1>Ephemeral Notes</h1>
<div class="container">
<div class="tab-container">
<ul class="tabs">
	{#each notes as note, i}
		<li class="tab"
			class:active="{i === currentNote}"
			class:editing={editNameNote.id === note.id}
		>
			{#if editNameNote.id === note.id}
				<input type="text" bind:this={editNameEditor} bind:value={editNameNote.title} />
				<button class="save-icon" on:click={updateNoteName(note, editNameNote)}><Icon icon={faSave} /></button>
			{/if}
			{#if editNameNote.id !== note.id}
				<button on:click={switchToNote(i)}>{note.title}</button>
				<button class="button-icon rename-button" on:click={renameNote(note, i)}><Icon icon={faEdit} /></button>
				<button class="button-icon delete-button" on:click={deleteNote(i)}><Icon icon={faTrash} /></button>
			{/if}
		</li>
		{/each}
		<li class="tab tab-add">
			<button on:click={addNote}><Icon icon={faStickyNote} /></button>
			<button on:click={addTaskList}><Icon icon={faListAlt} /></button>
		</li>
	</ul>
	</div>
	<div class="content-container">
	{#if notes[currentNote]}
	   {#if notes[currentNote].type === "text"}
	   <TextEditor 
		    editorElem={noteEditor}
				onChange={updateNote(currentNote)}
				value={notes[currentNote].content}
		  />
			{/if}
	   {#if notes[currentNote].type === "tasklist"}
	   <ToDoList 
		    editorElem={noteEditor}
				onChange={updateNote(currentNote)}
				value={notes[currentNote].content}
		  />
			{/if}
	{/if}
	</div>
	<div>
</main>