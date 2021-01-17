class InputGenerator {
    constructor() {
        this.embeddedReberGrammar = [
            [1, 'T', 2],
            [1, 'P', 4],
            [2, 'S', 2],
            [2, 'X', 3],
            [3, 'S', 6],
            [3, 'X', 4],
            [4, 'T', 4],
            [4, 'V', 5],
            [5, 'P', 3],
            [5, 'V', 6]
            // State 6 exits the embedded reber grammar
        ];
    }

    // Return a valid inputstring
    getValidString() {
        const upperStart = 'BTB';
        const upperEnd = 'ETE';
        const lowerStart = 'BPB';
        const lowerEnd = 'EPE';
        let grammar = '';

        const isUpper = this.getRandomBoolean(); // true: upper, false: lower

        // start
        grammar += isUpper ? upperStart : lowerStart;

        // embedded
        let state = 1;
        while (state !== 6) {
            let possibleTransitions = this.getTransitions(state);
            let newTransition = possibleTransitions[Math.floor(Math.random() * possibleTransitions.length)];
            let possibleStates = this.getNextStates(state, newTransition[1]);
            let newState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
            
            grammar += newTransition[1];
            state = newState[2];
        }

        // end
        grammar += isUpper ? upperEnd : lowerEnd;

        return grammar;
    }

    // Return an invalid inputstring
    getInvalidString() {
        let inputstrng = this.getValidString();
        let position = Math.floor(Math.random() * inputstrng.length);

        inputstrng = inputstrng.slice(0, inputstrng.length - 1);
        inputstrng = inputstrng.substring(0, position) + inputstrng.substring(position + 1);

        return inputstrng;
    }

    getTransitions(inputState) {
        let transitions = [];
        this.embeddedReberGrammar.forEach(state => {
            if (state[0] === inputState) transitions.push(state);
        });
        return transitions;
    }

    getNextStates(inputState, transition) {
        let states = [];
        this.embeddedReberGrammar.forEach(state => {
            if (state[0] === inputState && state[1] === transition) states.push(state);
        });
        return states;
    }

    // Return either true or false
    getRandomBoolean() {
        return Math.random() < 0.5;
    }
}