class Graficador {

    constructor() {
        this.states = [];
        this.transitions;
        this.initialState = null;
        this.nodes = new Set();
        this.finalStates = new Set();
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
        this.remarkNodeWithStyle(this.initialState, 5, "green")
    }
    remarkFinalStates() {
        this.transitions.forEach( ({from, to, fromIsFinal, toIsFinal}) => {
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


    createGraph(transitions, dfaGraphContainer) {
        this.initialState = transitions[0].from
        this.transitions = [...transitions]
        this.buildStatesFromTransitions()
        this.remarkInitialState()
        this.buildAlphabet()
        this.buildFinalStates()
        this.remarkFinalStates()
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
    buildFinalStates() {
        this.transitions.forEach( ({ fromIsFinal, toIsFinal, from, to }) => {
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
                "transitions": this.transitions,
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
