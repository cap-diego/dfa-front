
// Example of body
// {
//     "States":[0,1],
//     "Alphabet":[0,1],
//     "InitialState":1,
//     "FinalStates":[0],
//     "Delta":{
//         "0":{"0":1,"1":0},
//         "1":{"0":1,"1":0}
//         }

let baseUrl = `http://localhost:8080/minimize`

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
        "transitions": convertTransitionsFromApiSchema(data.delta, data.initialState, data.finalStates),
        "initialState": data.initialState.toString(),
        "finalStates": toStrs(data.finalStates),
        "states": toStrs(data.states),
        ...data}
}

function convertTransitionsFromApiSchema(transitions, initialState, finalStates) {
    let convertedTransitions = []
    for (let [from, v] of Object.entries(transitions)) {
        for (let [label, to] of Object.entries(v)) {
            convertedTransitions.push({ from: from.toString(), label, to: to.toString(), fromIsFinal: from in finalStates, toIsFinal: to in finalStates});
        }
    }
    return convertedTransitions;
}

function APIMinimize(dfa) {
    let dfaSchema = dfaToApiSchema(dfa);
    let dfaJson = JSON.stringify(dfaSchema);
    let req = fetch(baseUrl, {
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
export { APIMinimize };