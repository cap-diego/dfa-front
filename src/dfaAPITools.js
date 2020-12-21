let API_URL = __app.env.isProd? __app.env.ENDPOINT : "http://localhost:8080";

function dfaToApiSchema(dfa) {
    return {
        "states": toNumbers(Array.from(dfa.states)),
        "initialState": toNumber(dfa.initialState),
        "finalStates": toNumbers(Array.from(dfa.finalStates)),
        "alphabet": toNumbers(Array.from(dfa.alphabet)),
        "delta": convertTransitionsToApiSchema(dfa.transitions)
    }
}
function toNumbers(arr) {
    return arr.map(el => toNumber(el))
}
function toStrs(arr) {
    return arr.map(el => el.toString())
}
function toNumber(str) {
    let number = Number(str);
    if (!isNaN(number))
        return number
    try {
        return str.charCodeAt(0);
    } catch(err) {
        console.log("Error al convertir a num: " + err)
    }
}

function convertTransitionsToApiSchema(transitions) {
    let Delta = {}
    transitions.forEach(transition => {
        let key = toNumber(transition.from).toString();
        let val = toNumber(transition.to);
        if (Delta[key]) {
            let input = toNumber(transition.label).toString();
            Delta[key][input] = val;
        } else {
            Delta[key] = {}
            let input = toNumber(transition.label).toString();
            Delta[key][input] = val;
        }
    });
    return Delta;
}
function dfaFromSchemaToObj(data) {
    return {
        "transitions": convertTransitionsFromApiSchema(data.delta, data.initialState, data.finalStates, data.states),
        "initialState": data.initialState.toString(),
        "finalStates": toStrs(data.finalStates),
        "states": toStrs(data.states),
        ...data}
}

function convertTransitionsFromApiSchema(transitions, initialState, finalStates, states) {
    let convertedTransitions = []
    for (let [from, v] of Object.entries(transitions)) {
        for (let [label, to] of Object.entries(v)) {
            convertedTransitions.push({ from: from.toString(), label, to: to.toString(), fromIsFinal: from in finalStates, toIsFinal: to in finalStates});
        }
    }
    return mergeEdgesWithSameEndpoints(convertedTransitions, states)
    // return convertedTransitions;
}

function APIMinimize(dfa) {
    let dfaSchema = dfaToApiSchema(dfa);
    let dfaJson = JSON.stringify(dfaSchema);
    let req = fetch(`${API_URL}/minimize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dfaJson
    });
    return req.then(response => {
        if (response.ok)
            return response.json().then(data => dfaFromSchemaToObj(data))
        throw Error("Error en la petición: " + response.statusText + " code: \nRevise los campos\n" + response.status)
    })    
    .catch(err => {
        throw Error(err)
    })
}

function mergeEdgesWithSameEndpoints(transitions, states) {
    let mergedTransitions = [...transitions];
    states.forEach(state => {
        let prev = "";
        let nuevaTransicion = null;
        mergedTransitions = mergedTransitions.filter(({from, to, label}) => {
            if (from === to && to === state.toString()) {
                prev = prev.concat(", ", label)
                nuevaTransicion = {from: from, to: to, label: prev}
            } else 
                return {from, to, label}
        })
        if (nuevaTransicion)
            mergedTransitions = [nuevaTransicion, ...mergedTransitions]
    });
    return mergedTransitions;
}

export { APIMinimize };