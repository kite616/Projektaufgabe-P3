/*
TuringAutomata
T = [
        Σ  := Eingabealphabet,
        S  := Endlichen Zustandsmenge,
        Γ  := Arbeitsalphabet (auch Bandalphabet),
        δ  := Zustandsüberführung (auch Turingprogramm),
        S0 := Startzustand,
        #  := Blanksymbol,
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
        this.turingprogramm = [
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
            [9, 'P', 2, 'p', 'L'], 
            [9, 'T', 2, 't', 'L'],
            [10, 'blank', 10, 'blank', 'L'], 
            [10, 'p', 11, 'blank', 'R'], 
            [10, 't', 12, 'blank', 'R'],
            [11, 'blank', 11, 'blank', 'R'], 
            [11, 'p', 12, 'blank', 'R'],
            [12, 'blank', 12, 'blank', 'R'],
            [12, 't', 13, 'blank', 'R'],
            [13, 'E', 'a', 'blank', 'R']
        ];

        // Step generation
        this.string = inputstring;
        this.stack = [];
        this.currentstate = 0;
        this.steps = [];

        // Simulation
        this.currentstep = 0;
        this.timer = null;

        // HTML-Elements
        this.controls = document.getElementById('acontrols');
        this.tablesection = document.getElementById('sequenztable');
        this.table = document.getElementById('aseqtable');
        this.info = document.getElementById('status');

        // User Interface -------------------------------------------------------
        // document.getElementById('afirst').addEventListener('click', event => {
        //     this.first();
        // });
        // document.getElementById('aprev').addEventListener('click', event => {
        //     this.previous();
        // });
        // document.getElementById('anext').addEventListener('click', event => {
        //     this.next();
        // });
        // document.getElementById('alast').addEventListener('click', event => {
        //     this.last();
        // });

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

    }

    exit() {

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
        this.highlightState();
        this.highlightTransition();
    }

    highlightState() {

    }

    highlightTransition() {
        
    }

    resetHighlight() {
        document.querySelectorAll(".state").forEach(state => {
            state.classList.remove('state-selected');
            state.classList.remove('state-failed');
        });

        document.querySelectorAll(".state-text").forEach(state => {
            state.classList.remove('state-text-selected');
            state.classList.remove('state-text-failed');
        });

        document.querySelectorAll(".transition").forEach(transition => {
            transition.classList.remove('transition-selected');
            transition.classList.remove('transition-failed');
        });

        document.querySelectorAll(".transition-text").forEach(transitiontext => {
            transitiontext.classList.remove('transition-text-selected');
            transitiontext.classList.remove('transition-text-failed');
        });
    }

    // generates all steps, unless there is an error
    generateSteps() {
        
    }

    // Returns current steps as formatted HTML
    getStepsAsTable() {

    }

    switchAutoplay() {
        if (this.timer === null) { // start autoplay
            this.enableAutoplay();

        } else { // stop autoplay
            this.disableAutoplay();
        }
    }

    enableAutoplay() {
        this.setClock(5);
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