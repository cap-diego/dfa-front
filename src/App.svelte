<script>
	let transitions = [[]];
	let initialState = null;
	let finalStates = [];
	let alphabet = [];
	let delta = null;
	function addTransition(ev) {
		if (!canAddTransition())
			return
		transitions.push([])
		transitions = [...transitions]
	}
	function canAddTransition() {
		let canAdd = true
		transitions.forEach(({q1, c, q2}) => {
			if (!q1 || !q2 || !c) 
				canAdd = false
		})
		return canAdd
	}
	function minimize() {
		if (canAddTransition) {
			
		}
	}
</script>

<main class="flex justify-center">
	<div>

		<div class="">
			{#each transitions as {q1, q2}, i}
				<input bind:value={transitions[i].q1} placeholder="qi" class="text-center rounded mb-2 p-1 w-10">
				<input bind:value={transitions[i].c} placeholder="input" class="text-center rounded mb-2 p-1 w-12">
				<input bind:value={transitions[i].q2} placeholder="qj" class="text-center rounded mb-2 p-1 w-10">
				<br>
			{/each}
		</div>
		
		<button on:click={addTransition} class="bg-indigo-600 mt-4 rounded opacity-90 p-1">Nuevo estado</button>
		<button on:click={minimize} class="bg-indigo-600 mt-4 rounded opacity-90 p-1">Minimizar!</button>
	</div>

</main>

