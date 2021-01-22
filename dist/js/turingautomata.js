/*
TuringAutomata
T = [
        Σ  := Eingabealphabet,
        S  := Endlichen Zustandsmenge,
        Γ  := Arbeitsalphabet (auch Bandalphabet),
        δ  := Zustandsüberführung (auch Turingprogramm),
        S0 := Startzustand,
        #  :=  symbol,
        fa := akzeptierender Zustand,
        fr := verwerfender Zustand
    ]

Anweisung = [
    s  := Zustand von T
    a  := Erwartes Symbol
    s' := Wenn erwartes Symbol, dann neuer Zustand
    b  := Überschreibt erwartes Symbol (a) mit neuem Symbol (b) 
    m  := Führt bewegung aus l:links, r:rechts, -:verbleibt
] 
<current state> <current symbol> <new symbol> <direction> <new state>
*/

class TuringAutomata {
    constructor() {
        this.inputalphabet = ['B', 'E', 'P', 'S', 'T', 'V', 'X'];
        this.tapealphabet = ['B', 'E', 'P', 'S', 'T', 'V', 'X', 'blank', 't', 'p'];
        this.turingprogram = [
            [0, 'B', 1, 'blank', 'R'],
            [1, 'P', 2, 'p', 'R'],
            [1, 'T', 2, 't', 'R'],
            [2, 'B', 3, 'blank', 'R'],
            [3, 'P', 6, 'blank', 'R'],
            [3, 'T', 4, 'blank', 'R'],
            [4, 'S', 4, 'blank', 'R'],
            [4, 'X', 5, 'blank', 'R'],
            [5, 'S', 8, 'blank', 'R'],
            [5, 'X', 6, 'blank', 'R'],
            [6, 'T', 6, 'blank', 'R'],
            [6, 'V', 7, 'blank', 'R'],
            [7, 'P', 5, 'blank', 'R'],
            [7, 'V', 8, 'blank', 'R'],
            [8, 'E', 9, 'blank', 'R'],
            [9, 'P', 10, 'p', 'L'],
            [9, 'T', 10, 't', 'L'],
            [10, 'blank', 10, 'blank', 'L'],
            [10, 'p', 11, 'blank', 'R'],
            [10, 't', 12, 'blank', 'R'],
            [11, 'blank', 11, 'blank', 'R'],
            [11, 'p', 13, 'blank', 'R'],
            [12, 'blank', 12, 'blank', 'R'],
            [12, 't', 13, 'blank', 'R'],
            [13, 'E', 'a', 'blank', 'R'],
            ['a', 'blank', 'a', 'blank', 'R']
        ];

        // Step generation
        this.steps = [];

        // Simulation
        this.currentstep = 0;
        this.timer = null;

        // SVG-Document
        this.svg = null;

        window.addEventListener("load", element => {
            let container = document.getElementById("svg");
            this.svg = container.contentDocument;
        });

        // HTML-Elements
        this.controls = document.getElementById('acontrols');
        this.table = document.getElementById('sequenztable');
        this.info = document.getElementById('status');

        // User Interface -------------------------------------------------------
        document.getElementById('first').addEventListener('click', event => {
            this.first();
        });
        document.getElementById('previous').addEventListener('click', event => {
            this.previous();
        });
        document.getElementById('next').addEventListener('click', event => {
            this.next();
        });
        document.getElementById('last').addEventListener('click', event => {
            this.last();
        });

        // Autosimulation ------------------------------------------------------
        document.getElementById('autosim').addEventListener('click', event => {
            this.switchAutoplay();
        });
        document.getElementById('aspeed').addEventListener('change', slider => {
            this.unsetClock();
            this.setClock(slider.target.value);
        });
        document.getElementById('aspeed').addEventListener('input', slider => {
            document.getElementById('aspeeddisplay').innerText = (slider.target.value) + 's';
        });
    }

    run(input) {
        this.generateSteps(input);
        this.first();
    }

    exit() {
        this.currentstep = 0;
        this.disableAutoplay();
        this.resetHighlight();
        document.getElementById('aspeed').value = 5;
        document.getElementById('aspeeddisplay').innerText = '5s';
        this.table.innerHTML = '';
    }

    first() {
        this.currentstep = 0;
        this.table.innerHTML = this.getStepsAsTable();
        this.setHiglights();
    }

    next() {
        if (this.currentstep < this.steps.length - 1) {
            this.currentstep += 1;
            this.table.innerHTML = this.getStepsAsTable();
            this.setHiglights();
        } else {
            this.currentstep = this.steps.length - 1;
            this.disableAutoplay();
        }
    }

    previous() {
        if (this.currentstep > 0) {
            this.currentstep -= 1;
            this.table.innerHTML = this.getStepsAsTable();
            this.setHiglights();
        } else {
            this.currentstep = 0;
        }
    }

    last() {
        this.currentstep = this.steps.length - 1;
        this.table.innerHTML = this.getStepsAsTable();
        this.disableAutoplay();
        this.setHiglights();
    }

    setHiglights() {
        this.resetHighlight();
        setTimeout(() => {  this.highlightState(); }, 300);
        setTimeout(() => {  this.highlightTransition(); }, 300);        
    }

    highlightState() {
        let state = this.steps[this.currentstep][2];
        let status = this.steps[this.currentstep][4];
        let path = this.svg.getElementById('s'+state);
        let text = this.svg.getElementById('s'+state+'-text');

        if(status !== 'abgelehnt') {
            if(state === 0 || state === 'a') {
                this.svg.getElementById('s'+state+'-inner').classList.add('state-selected');
                this.svg.getElementById('s'+state+'-outer').classList.add('state-selected');
            } else {
                path.classList.add('state-selected');
            }
            text.classList.add('state-text-selected');
        } else {
            if(state === 0 || state === 'a') {
                this.svg.getElementById('s'+state+'-inner').classList.add('state-failed');
                this.svg.getElementById('s'+state+'-outer').classList.add('state-failed');
            } else {
                path.classList.add('state-failed');
            }
            text.classList.add('state-text-failed');
        }
    }

    highlightTransition() {
        let currentstate = this.steps[this.currentstep][2];
        let nextstate = this.steps[this.currentstep][4];

        let path = this.svg.getElementById('t-'+currentstate+'-'+nextstate);
        let text = this.svg.getElementById('t-'+currentstate+'-'+nextstate+'-text');

        console.log(path);
        console.log(text);

        if(this.steps[this.currentstep][4] !== 'abgelehnt') {
            try {
                path.classList.add('transition-selected');
                text.classList.add('transition-text-selected');
            } catch (e){}
        } else {
            try {
                path.classList.add('transition-failed');
                text.classList.add('transition-text-failed');
            } catch(e){}
        }
    }

    resetHighlight() {
        this.svg.querySelectorAll(".state").forEach(state => {
            state.classList.remove('state-selected');
            state.classList.remove('state-failed');
        });

        this.svg.querySelectorAll(".state-text").forEach(statetext => {
            statetext.classList.remove('state-text-selected');
            statetext.classList.remove('state-text-failed');
        });

        this.svg.querySelectorAll(".transition").forEach(transition => {
            transition.classList.remove('transition-selected');
            transition.classList.remove('transition-failed');
        });

        this.svg.querySelectorAll(".transition-text").forEach(transitiontext => {
            transitiontext.classList.remove('transition-text-selected');
            transitiontext.classList.remove('transition-text-failed');
        });
    }

    // generates all steps, unless there is an error
    generateSteps(input) {
        let tape = input.split('');
        let tapeposition = 0;
        let state = 0;
        let finished = false;
        const acceptstate = 'a';

        this.steps = []; // reset steps

        while (!finished) {
            let found = false;
            this.turingprogram.forEach(element => {
                if(state === element[0] && tape[tapeposition] === element[1]) {
                    // push step: tape, tapeposition, current state, current symbol, next state
                    this.steps.push([tape.toString(), tapeposition, element[0], element[1], element[2]]);

                    // update automaton
                    tape[tapeposition] = element[3];
                    state = element[2];
                    tapeposition += (element[4] === 'R') ? 1 : -1;

                    found = true;
                    if(element[2] === acceptstate && this.isTapeBlank(tape)) {
                        finished = true;
                        tape[tape.length-1] = 'blank';
                        this.steps.push([tape.toString(), tapeposition+1, acceptstate, element[3], 'akzeptiert']);
                    }
                }
            });
            if(!found) {
                this.steps.push([tape.toString(), tapeposition, state, tape[tapeposition], 'abgelehnt']);
                finished = true;
            }
        }
    }

    isTapeBlank(tape) {
        let notblanks = 0;
        tape.forEach(symbol => {
            if(symbol !== 'blank') notblanks++;
        });
        return (notblanks===0);
    }

    // Returns current steps as formatted HTML
    getStepsAsTable() {
        let table = '';
        for(let i=0; i<=this.currentstep; i++) {
            table += '<tr><td>'+this.steps[i][0]+'</td><td>'+this.steps[i][1]+'</td><td>'+this.steps[i][2]+'</td><td>'+this.steps[i][3]+'</td><td>'+this.steps[i][4]+'</td></tr>';
        }
        if(this.currentstep === this.steps.length-1) {
            if(this.steps[this.steps.length-1][4] !== 'abgelehnt') {
                table += '<tr><td colspan="5" class="ok">Eingabe ist gültig!</td></tr>';
                this.info.classList.add('ok');
                this.info.innerText = 'Eingabe ist gültig!';
            } else {
                table += '<tr><td colspan="5" class="error">Eingabe ist ungültig!</td></tr>';
                this.info.classList.add('error');
                this.info.innerText = 'Eingabe ist ungültig!';
            }
        } else {
            this.info.classList.remove('ok');
            this.info.classList.remove('error');
            this.info.innerText = 'Simulation wird ausgeführt...';
        }
        return table;
    }

    switchAutoplay() {
        if (this.timer === null) { // start autoplay
            this.enableAutoplay();

        } else { // stop autoplay
            this.disableAutoplay();
        }
    }

    enableAutoplay() {
        this.setClock(document.getElementById('aspeed').value);
        document.getElementById('autosim').innerText = 'Stop';
    }

    disableAutoplay() {
        this.unsetClock();
        document.getElementById('autosim').innerText = 'Start';
    }

    setClock(seconds) {
        this.timer = setInterval(() => this.next(), seconds * 1000);
        document.getElementById('aspeeddisplay').innerText = (seconds) + 's';
    }

    unsetClock() {
        clearInterval(this.timer);
        this.timer = null;
    }
}