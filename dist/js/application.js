class Application {
    constructor() {
        this.inputGenerator = new InputGenerator();
        this.automata = new TuringAutomata();
    }

    initialisation() {
        // String
        document.getElementById('validstring').addEventListener('click', event => {
            document.getElementById('inputstring').value = this.inputGenerator.getValidString();
        });
        document.getElementById('invalidstring').addEventListener('click', event => {
            document.getElementById('inputstring').value = this.inputGenerator.getInvalidString();
        });

        // Switch between Input and Simulation
        document.getElementById('simstart').addEventListener('click', event => {
            document.getElementById('input-container').classList.add('hidden');
            document.getElementById('simcontainer').classList.remove('hidden');
            document.getElementById('simstring').value = document.getElementById('inputstring').value;
            this.automata.run(document.getElementById('inputstring').value);

        });
        document.getElementById('exit').addEventListener('click', event => {
            document.getElementById('simcontainer').classList.add('hidden');
            document.getElementById('input-container').classList.remove('hidden');
            document.getElementById('simstring').value = '';
            this.automata.exit();
        });

        // Simulation
        document.getElementById('aspeed').addEventListener('input', slider => {
            document.getElementById('aspeeddisplay').innerText = (slider.target.value) + 's';
        });

        // Turingprogramm Table
         document.getElementById('turingprogramm').innerHTML = this.createTuringprogrammTable(this.automata);
    }

    createTuringprogrammTable(automata) {
        let table = '';
        let doublecheck = '';

        // for each state and symbol in the tape alphabet
        for(let i = 0; i <= 13; i++) { // states
            automata.turingprogramm.forEach(element => {
                if(i === 0 && element[0] === i) {
                    table += '<tr><td>s</td><td>'+element[1]+'</td><td>'+element[2]+'</td><td>'+element[3]+'</td><td>'+element[4]+'</td>';
                } else if(element[0] === i) {
                    table += '<tr><td>'+element[0]+'</td><td>'+element[1]+'</td><td>'+element[2]+'</td><td>'+element[3]+'</td><td>'+element[4]+'</td>';
                }
            });
            automata.tapealphabet.forEach(symbol => { // symbols
                automata.turingprogramm.forEach(element => {
                    if(i === 0 && element[0] === i && element[1] !== symbol && doublecheck !== i+symbol+'abgelehnt') {
                        doublecheck = i+symbol+'abgelehnt';
                        table += '<tr><td>s</td><td>'+symbol+'</td><td>abgelehnt</td><td>'+symbol+'</td><td>R</td>';
                    } else if(element[0] === i && element[1] !== symbol && doublecheck !== i+symbol+'abgelehnt') {
                        doublecheck = i+symbol+'abgelehnt';
                        table += '<tr><td>'+i+'</td><td>'+symbol+'</td><td>abgelehnt</td><td>'+symbol+'</td><td>R</td>';
                    }
                })
            });
        }

        automata.tapealphabet.forEach(symbol => {
            table += '<tr><td>a</td><td>'+symbol+'</td><td>abgelehnt</td><td>'+symbol+'</td><td>R</td>';
        });
        automata.tapealphabet.forEach(symbol => {
            table += '<tr><td>abgelehnt</td><td>'+symbol+'</td><td>abgelehnt</td><td>'+symbol+'</td><td>R</td>';
        });

        // state 14 := accept, 15 := reject

        return table; 
    }
}
application = new Application();
application.initialisation();