<script>
	import { Graficador } from './dfaGraphTools';
	import { APIMinimize}  from './dfaAPITools';
	let transitions = [{}];
	let dfaGraphContainer;
	let dfaGraph;
	let graficador;
	let dfa;
	let dfaMin;
	let dfaMinGraph;
	let dfaMinGraphContainer;
	let loading = false;

	// Watchers
	$: drawDfa(transitions, dfaGraphContainer)

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
	function obtenerDfa() {
		try {
			return graficador.getDfa();
		} catch (err) {
			console.log("Error tratando de obtener el dfa del graficador: "+ err)
		}
	}
	async function minimize() {
		if (!canAddTransition() || loading)
			return
		dfa = obtenerDfa();
		try {
			loading = true;
			dfaMin = await APIMinimize(dfa);
		}catch (err) {
			console.log("Error enviando petición de minimización: " + err)
			return
		}finally {
			loading = false;
		}
		dfaMinGraph = drawDfa(dfaMin.transitions, dfaMinGraphContainer, dfaMin.initialState.toString());
	}

	function drawDfa(transitions, container, initialState) {
		if (!canAddTransition())
			return
		try {
			graficador = new Graficador({ initialState, transitions })
			dfaGraph = graficador.createGraph(container);
		} catch (err) {
			console.log("Error tratando de construir la red: " + err)
		}
	}
</script>


<main class="flex justify-center pt-4 mb-10">
	<div>
		<div class="">
			{#each transitions as {q1, q2}, i}
				<input type="checkbox" bind:checked={transitions[i].fromIsFinal}>Final
				<input maxlength="1" bind:value={transitions[i].from} placeholder="qi" class="text-center rounded mb-2 p-1 w-10 focus:outline-none focus:ring focus:border-blue-300">
				<input maxlength="1" bind:value={transitions[i].label} placeholder="input" class="text-center rounded mb-2 p-1 w-12 focus:outline-none focus:ring focus:border-blue-300">
				<input maxlength="1" bind:value={transitions[i].to} placeholder="qj" class="text-center rounded mb-2 p-1 w-10 focus:outline-none focus:ring focus:border-blue-300">
				<input type="checkbox" bind:checked={transitions[i].toIsFinal}>Final
				<br>
			{/each}
		</div>
		<button on:click={addTransition} class="bg-indigo-600 mt-4 rounded focus:outline-none focus:ring focus:border-blue-300 opacity-90 p-1">Nueva transición</button>
		<button on:click={minimize} class="animate-bounce bg-indigo-600 mt-4 rounded focus:outline-none focus:ring focus:border-blue-300 opacity-90 p-1">
			{#if loading}
			<svg class="animate-spin inline mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" 
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			{/if}
			Minimizar!
		</button>
		<span class="relative block text-right left-8 text-xs text-gray-600">Al menos un estado final</span>		
	</div>
</main>

<div id="dfa-graph-comparison" class="flex justify-between w-full h-1/2 border-2 border-indigo-200 rounded">
	<div bind:this={dfaGraphContainer} class="w-1/2 h-full border-0 border-green-600 rounded"></div>
	<div bind:this={dfaMinGraphContainer} class="w-1/2 h-full border-0 border-green-600 rounded"></div>
</div>
<footer id="footer" class="space-y-4">
	<div class="block">
		<div class="flex justify-center items-center">
			<a href="https://github.com/cap-diego/dfa-minimization-algorithm"><img src="/github-icon.png" width="25" height="25"  alt="github repo"></a> 
			<small class="mx-2">Link al código</small>
		</div>
	</div>
	<div class="block">
		<small class="flex justify-center">Minimizador de AFD</small>
	</div>
</footer>

<style>
#footer {
	position: absolute;
	right: 0;left: 0;bottom:0;
}
</style>