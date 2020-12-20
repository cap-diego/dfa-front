class Graficador {

    constructor() {
        this.states = [];
        this.transitions;
        this.initialState = null;
        this.nodes = new Set();
        this.finalStates = [];
        this.alphabet = new Set();
        this.options = {
            edges: {
                arrows: {
                    to: true
                }
            }
        };
    }
    remarkInitialState() {
        this.states.forEach(q => {
            if (q.id == this.initialState) {
                q.borderWidth = 5
                q.color = {background: "green"}
                return
            }
        })
    }
    buildStatesFromTransitions() {
        this.transitions.forEach( ({from, to, label}) => {
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


    createGraph(transitions, finalStates, dfaGraphContainer) {
        this.initialState = transitions[0].from
        this.transitions = [...transitions]
        this.finalStates = finalStates
        this.buildStatesFromTransitions()
        this.remarkInitialState()
        let data = {
            edges: this.transitions,
            nodes: this.states
        }
        return new vis.Network(dfaGraphContainer, data, this.options)
    }

    buildAlphabet() {
        this.transitions.forEach( ({label}) => {
            this.alphabet.add(label)
        })
        return this.alphabet;
    }

    getDfa() {
        try {
            let dfa = {
                "states": this.nodes,
                "transitions": this.transitions,
                "initialState": this.initialState,
                "finalStates": this.finalStates,
                "alphabet": this.buildAlphabet()
            }
            return dfa
        } catch(err) {
            throw err
        }

    }
}

export { Graficador };
