class Graficador {

    constructor({initialState, states, transitions, alphabet, finalStates}) {
        this.states = states || [];
        this.delta = transitions;
        this.initialState = initialState;
        this.nodes = new Set();
        this.finalStates = finalStates || new Set();
        this.alphabet = alphabet || new Set();
        this.options = {
            edges: {
                arrows: {
                    to: true
                }
            }
        };
    }
    remarkInitialState() {
        this.remarkNodeWithStyle(this.initialState, 5, "green")
    }
    remarkFinalStates() {
        this.delta.forEach( ({from, to, fromIsFinal, toIsFinal}) => {
            if (fromIsFinal)
                this.remarkNodeWithStyle(from, 2, "gray")
            if (toIsFinal) 
                this.remarkNodeWithStyle(to, 2, "grey")
        })
    }
    remarkNodeWithStyle(node, borderWidth, colour) {
        let stateToRemark = this.states.find( state => state.id === node)
        if (stateToRemark) {
            stateToRemark.borderWidth = borderWidth;
            stateToRemark.color = { background: colour }
        }
    }
    buildStatesFromTransitions() {
        this.delta.forEach( ({from, to, label}) => {
            let oldSize = this.nodes.size
            this.nodes.add(from)
            let newSize = this.nodes.size
            if (newSize > oldSize)
                this.states.push({id: from, label:from})
            oldSize = newSize
            this.nodes.add(to)
            newSize = this.nodes.size
            if (newSize > oldSize)
                this.states.push({id: to, label:to})
        })
    }

    createGraph(dfaGraphContainer) {
        console.log(this.delta)
        if (!this.initialState) this.initialState = this.delta[0].from
        this.delta = [...this.delta]
        this.buildStatesFromTransitions()
        this.remarkInitialState()
        this.buildAlphabet()
        this.buildFinalStates()
        this.remarkFinalStates()
        let data = {
            edges: this.delta,
            nodes: this.states
        }
        return new vis.Network(dfaGraphContainer, data, this.options)
    }

    buildAlphabet() {
        if (this.alphabet.size > 0 ) return
        this.delta.forEach( ({label}) => {
            this.alphabet.add(label)
        })
    }
    buildFinalStates() {
        if (this.delta.size > 0) return
        this.delta.forEach( ({ fromIsFinal, toIsFinal, from, to }) => {
            if (fromIsFinal)
                this.finalStates.add(from)
            if (toIsFinal)
                this.finalStates.add(to)
        })
    }
    getDfa() {
        try {
            let dfa = {
                "states": this.nodes,
                "transitions": this.delta,
                "initialState": this.initialState,
                "finalStates": this.finalStates,
                "alphabet": this.alphabet,
            }
            return dfa
        } catch(err) {
            throw err
        }

    }
}

export { Graficador };
