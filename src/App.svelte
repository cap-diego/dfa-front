<script>
	let transitions = [{}];
	let states = [];
	let nodes = new Set();
	let initialState = null;
	let finalStates = [];
	let alphabet = [];
	let dfaGraphContainer;
	let dfaMinGraphContainer;
	let dfaGraph;
	function addTransition(ev) {
		if (!canAddTransition())
			return
		transitions.push({})
		transitions = [...transitions]
		
	}
	function canAddTransition() {
		let canAdd = true
		transitions.forEach(({from, label, to}) => {
			if (!from || !to || !label) 
				canAdd = false
		})
		return canAdd
	}
	function minimize() {
		if (canAddTransition) {
			try {
				initialState = transitions[0].from
				buildStatesFromTransitions()
				remarkInitialState()
				let data = {
					edges: transitions,
					nodes: states
				}
				dfaGraph = new vis.Network(dfaGraphContainer, data, options);
			} catch (err) {
				console.log("Error tratando de construir la red: " + err)
			}

		}
	}
	function remarkInitialState() {
		states.forEach(q => {
			if (q.id == initialState) {
				q.borderWidth = 5
				q.color = {background: "green"}
				return
			}
		})
	}
	function buildStatesFromTransitions() {
		transitions.forEach( ({from, to, label}) => {
			let oldSize = nodes.size
			nodes.add(from)
			let newSize = nodes.size
			if (newSize > oldSize)
				states.push({id: from, label:from})
			oldSize = newSize
			nodes.add(to)
			newSize = nodes.size
			if (newSize > oldSize)
				states.push({id: to, label:to})
		})
	}
    const options = {
		edges: {
			arrows: {
				to: true
			}
		}
	};
	
</script>

<main class="flex justify-center">
	<div>
		<div class="">
			{#each transitions as {q1, q2}, i}
				<input bind:value={transitions[i].from} placeholder="qi" class="text-center rounded mb-2 p-1 w-10">
				<input bind:value={transitions[i].label} placeholder="input" class="text-center rounded mb-2 p-1 w-12">
				<input bind:value={transitions[i].to} placeholder="qj" class="text-center rounded mb-2 p-1 w-10">
				<br>
			{/each}
		</div>
		
		<button on:click={addTransition} class="bg-indigo-600 mt-4 rounded opacity-90 p-1">Nueva transición</button>
		<button on:click={minimize} class="bg-indigo-600 mt-4 rounded opacity-90 p-1">Minimizar!</button>
	</div>
</main>
<div id="dfa-graph-comparison" class="flex justify-between w-full h-full border-2 border-indigo-200 rounded">
	<div bind:this={dfaGraphContainer} class="w-3/4 h-full border-0 border-green-600 rounded"></div>
	<div bind:this={dfaMinGraphContainer} class="w-3/4 h-full border-0 border-green-600 rounded"></div>
</div>
