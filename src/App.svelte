<script>
	import { Graficador } from './dfaGraphTools'
	let transitions = [{}];
	let dfaGraphContainer;
	let dfaGraph;
	function addTransition(ev) {
		if (!canAddTransition())
			return
		transitions.push({});
		transitions = [...transitions];
	}
	function canAddTransition() {
		return !transitions.some(({from, label, to}) => {
			if (!from || !to || !label)
				return true
		})
	}
	function minimize() {
		if (canAddTransition()) {
			try {
				let graficador = new Graficador()
				dfaGraph = graficador.createGraph(transitions, dfaGraphContainer);
				let dfa = graficador.getDfa();
				console.log({dfa})
			} catch (err) {
				console.log("Error tratando de construir la red: " + err)
			}

		}
	}
	
</script>

<main class="flex justify-center">
	<div>
		<div class="">
			{#each transitions as {q1, q2}, i}
				<input type="checkbox" bind:checked={transitions[i].fromIsFinal}>Final
				<input maxlength="1" bind:value={transitions[i].from} placeholder="qi" class="text-center rounded mb-2 p-1 w-10">
				<input maxlength="1" bind:value={transitions[i].label} placeholder="input" class="text-center rounded mb-2 p-1 w-12">
				<input maxlength="1" bind:value={transitions[i].to} placeholder="qj" class="text-center rounded mb-2 p-1 w-10">
				<input type="checkbox" bind:checked={transitions[i].toIsFinal}>Final
				<br>
			{/each}
		</div>
		
		<button on:click={addTransition} class="bg-indigo-600 mt-4 rounded opacity-90 p-1">Nueva transición</button>
		<button on:click={minimize} class="bg-indigo-600 mt-4 rounded opacity-90 p-1">Minimizar!</button>
	</div>
</main>
<div id="dfa-graph-comparison" class="flex justify-between w-full h-full border-2 border-indigo-200 rounded">
	<div bind:this={dfaGraphContainer} class="w-1/2 h-full border-0 border-green-600 rounded"></div>
	<!-- <div bind:this={dfaMinGraphContainer} class="w-3/4 h-full border-0 border-green-600 rounded"></div> -->
</div>
