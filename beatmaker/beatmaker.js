// ========================================
// TRAGEDY // BEATMAKER
// Web Audio API Drum Machine
// ========================================

const STEPS = 16;

// ========================================
// AUDIO ENGINE
// ========================================

const AudioContext =
    window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();


// MASTER VOLUME

const masterGain = audioContext.createGain();

masterGain.gain.value = 0.8;

masterGain.connect(audioContext.destination);


// ========================================
// KICK
// ========================================

function playKick() {

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    // Start high and rapidly drop in pitch
    oscillator.frequency.setValueAtTime(
        150,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        45,
        audioContext.currentTime + 0.12
    );


    // Volume envelope

    gain.gain.setValueAtTime(
        1,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
    );


    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.5
    );
}


// ========================================
// CREATE NOISE BUFFER
// Used by snare / clap / hats
// ========================================

function createNoiseBuffer() {

    const bufferSize =
        audioContext.sampleRate * 1;

    const buffer =
        audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate
        );

    const data =
        buffer.getChannelData(0);


    for (let i = 0; i < bufferSize; i++) {

        data[i] =
            Math.random() * 2 - 1;

    }

    return buffer;
}


const noiseBuffer = createNoiseBuffer();


// ========================================
// SNARE
// ========================================

function playSnare() {

    const now = audioContext.currentTime;


    // NOISE

    const noise =
        audioContext.createBufferSource();

    noise.buffer = noiseBuffer;


    const noiseFilter =
        audioContext.createBiquadFilter();

    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1000;


    const noiseGain =
        audioContext.createGain();

    noiseGain.gain.setValueAtTime(
        0.8,
        now
    );

    noiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.2
    );


    noise.connect(noiseFilter);

    noiseFilter.connect(noiseGain);

    noiseGain.connect(masterGain);


    // SNARE BODY

    const oscillator =
        audioContext.createOscillator();

    oscillator.type = "triangle";

    oscillator.frequency.value = 180;


    const oscillatorGain =
        audioContext.createGain();

    oscillatorGain.gain.setValueAtTime(
        0.6,
        now
    );

    oscillatorGain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.1
    );


    oscillator.connect(oscillatorGain);

    oscillatorGain.connect(masterGain);


    noise.start(now);
    noise.stop(now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
}


// ========================================
// HI-HAT
// ========================================

function playHiHat(open = false) {

    const now = audioContext.currentTime;

    const noise =
        audioContext.createBufferSource();

    noise.buffer = noiseBuffer;


    const filter =
        audioContext.createBiquadFilter();

    filter.type = "highpass";

    filter.frequency.value = 7000;


    const gain =
        audioContext.createGain();


    const duration =
        open ? 0.5 : 0.06;


    gain.gain.setValueAtTime(
        0.35,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );


    noise.connect(filter);

    filter.connect(gain);

    gain.connect(masterGain);


    noise.start(now);

    noise.stop(
        now + duration
    );
}


// ========================================
// CLAP
// ========================================

function playClap() {

    const now = audioContext.currentTime;


    // Multiple tiny bursts create a clap effect

    const bursts = [
        0,
        0.025,
        0.05
    ];


    bursts.forEach(offset => {

        const noise =
            audioContext.createBufferSource();

        noise.buffer = noiseBuffer;


        const filter =
            audioContext.createBiquadFilter();

        filter.type = "bandpass";

        filter.frequency.value = 1400;

        filter.Q.value = 0.7;


        const gain =
            audioContext.createGain();


        gain.gain.setValueAtTime(
            0.7,
            now + offset
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + offset + 0.08
        );


        noise.connect(filter);

        filter.connect(gain);

        gain.connect(masterGain);


        noise.start(
            now + offset
        );

        noise.stop(
            now + offset + 0.1
        );

    });

}


// ========================================
// SOUND ROUTER
// ========================================

function playSound(sound) {

    switch (sound) {

        case "kick":
            playKick();
            break;

        case "snare":
            playSnare();
            break;

        case "clap":
            playClap();
            break;

        case "hihat":
            playHiHat(false);
            break;

        case "openhat":
            playHiHat(true);
            break;

    }

}


// ========================================
// CREATE SEQUENCER GRID
// ========================================

const tracks =
    document.querySelectorAll(".track");


tracks.forEach(track => {

    const stepsContainer =
        track.querySelector(".steps");

    const sound =
        track.dataset.sound;


    for (let i = 0; i < STEPS; i++) {

        const step =
            document.createElement("div");

        step.classList.add("step");

        step.dataset.step = i;


        step.addEventListener(
            "click",
            async () => {

                // Browsers require user interaction
                // before audio can start.

                if (
                    audioContext.state ===
                    "suspended"
                ) {

                    await audioContext.resume();

                }


                step.classList.toggle(
                    "active"
                );


                // Preview drum

                if (
                    step.classList.contains(
                        "active"
                    )
                ) {

                    playSound(sound);

                }

            }
        );


        stepsContainer.appendChild(step);

    }

});


// ========================================
// SEQUENCER
// ========================================

let currentStep = 0;

let interval = null;

let playing = false;


// ========================================
// RUN STEP
// ========================================

function runStep() {

    document
        .querySelectorAll(".step")
        .forEach(step => {

            step.classList.remove(
                "playing"
            );

        });


    tracks.forEach(track => {

        const sound =
            track.dataset.sound;

        const steps =
            track.querySelectorAll(
                ".step"
            );

        const step =
            steps[currentStep];


        step.classList.add(
            "playing"
        );


        if (
            step.classList.contains(
                "active"
            )
        ) {

            playSound(sound);

        }

    });


    currentStep++;


    if (currentStep >= STEPS) {

        currentStep = 0;

    }

}


// ========================================
// BPM
// ========================================

function getStepTime() {

    const bpmInput =
        document.getElementById("bpm");

    let bpm =
        Number(bpmInput.value);


    bpm = Math.max(
        40,
        Math.min(240, bpm)
    );


    // Quarter note divided into
    // four sixteenth notes

    return (60 / bpm / 4) * 1000;

}


// ========================================
// PLAY
// ========================================

const playButton =
    document.getElementById(
        "playButton"
    );


playButton.addEventListener(
    "click",
    async () => {

        if (playing) return;


        if (
            audioContext.state ===
            "suspended"
        ) {

            await audioContext.resume();

        }


        playing = true;

        currentStep = 0;


        runStep();


        interval = setInterval(
            runStep,
            getStepTime()
        );

    }
);


// ========================================
// STOP
// ========================================

const stopButton =
    document.getElementById(
        "stopButton"
    );


stopButton.addEventListener(
    "click",
    () => {

        playing = false;

        clearInterval(interval);

        interval = null;

        currentStep = 0;


        document
            .querySelectorAll(".step")
            .forEach(step => {

                step.classList.remove(
                    "playing"
                );

            });

    }
);


// ========================================
// LIVE BPM CHANGES
// ========================================

const bpmInput =
    document.getElementById("bpm");


bpmInput.addEventListener(
    "change",
    () => {

        if (!playing) return;


        clearInterval(interval);


        interval = setInterval(
            runStep,
            getStepTime()
        );

    }
);


// ========================================
// MASTER VOLUME
// ========================================

const masterVolume =
    document.getElementById(
        "masterVolume"
    );


masterVolume.addEventListener(
    "input",
    () => {

        masterGain.gain.setTargetAtTime(
            Number(masterVolume.value),
            audioContext.currentTime,
            0.01
        );

    }
);


// ========================================
// CLEAR PATTERN
// ========================================

const clearButton =
    document.getElementById(
        "clearButton"
    );


clearButton.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(".step")
            .forEach(step => {

                step.classList.remove(
                    "active"
                );

            });

    }
);