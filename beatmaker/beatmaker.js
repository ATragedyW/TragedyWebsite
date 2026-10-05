// ========================================
// TRAGEDY // BEATMAKER
// Web Audio API Drum Machine
// ========================================

const STEPS = 16;
const AudioContext =
    window.AudioContext || window.webkitAudioContext;

let audioContext = null;
let masterGain = null;
let noiseBuffer = null;

async function initAudio() {

    if (!audioContext) {

        audioContext = new AudioContext();

        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.8;
        masterGain.connect(audioContext.destination);

        // Create noise buffer AFTER AudioContext exists
        noiseBuffer = createNoiseBuffer();
    }

    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }

    return audioContext;
}

// ========================================
// KICK
// ========================================

function playKick(variant = "deep") {

    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    let startFrequency = 150;
    let endFrequency = 45;
    let duration = 0.5;
    let oscillatorType = "sine";

    switch (variant) {

        case "punchy":
            startFrequency = 220;
            endFrequency = 55;
            duration = 0.25;
            break;

        case "house":
            startFrequency = 180;
            endFrequency = 50;
            duration = 0.35;
            break;

        case "808":
            startFrequency = 120;
            endFrequency = 35;
            duration = 1.2;
            break;

        case "distorted":
            startFrequency = 190;
            endFrequency = 40;
            duration = 0.45;
            oscillatorType = "triangle";
            break;

        case "deep":
        default:
            startFrequency = 150;
            endFrequency = 40;
            duration = 0.6;
            break;
    }

    oscillator.type = oscillatorType;

    oscillator.frequency.setValueAtTime(
        startFrequency,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        endFrequency,
        now + 0.12
    );

    gain.gain.setValueAtTime(
        variant === "distorted" ? 1.4 : 1,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(now);
    oscillator.stop(now + duration);
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


// ========================================
// SNARE
// ========================================

function playSnare(variant = "crisp") {
    console.log("SNARE VARIANT", variant);
    
    const now = audioContext.currentTime;

    // =========================
    // NOISE LAYER
    // =========================

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = audioContext.createBiquadFilter();
    const noiseGain = audioContext.createGain();

    // =========================
    // BODY LAYER
    // =========================

    const body = audioContext.createOscillator();
    const bodyGain = audioContext.createGain();

    body.type = "triangle";

    let noiseDuration = 0.2;
    let bodyDuration = 0.12;


    // =========================
    // CRISP
    // =========================

    if (variant === "crisp") {

        filter.type = "highpass";
        filter.frequency.value = 1800;

        noiseGain.gain.setValueAtTime(0.9, now);
        noiseGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.16
        );

        body.frequency.value = 190;

        bodyGain.gain.setValueAtTime(0.45, now);
        bodyGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.1
        );

        noiseDuration = 0.16;
        bodyDuration = 0.1;
    }


    // =========================
    // TRAP
    // Short, bright, snappy
    // =========================

    else if (variant === "trap") {

        filter.type = "bandpass";
        filter.frequency.value = 3500;
        filter.Q.value = 1.5;

        noiseGain.gain.setValueAtTime(1.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.07
        );

        body.type = "square";
        body.frequency.value = 260;

        bodyGain.gain.setValueAtTime(0.18, now);
        bodyGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.04
        );

        noiseDuration = 0.07;
        bodyDuration = 0.04;
    }


    // =========================
    // ACOUSTIC
    // Longer + lower
    // =========================

    else if (variant === "acoustic") {

        filter.type = "bandpass";
        filter.frequency.value = 1200;
        filter.Q.value = 0.7;

        noiseGain.gain.setValueAtTime(0.8, now);
        noiseGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.38
        );

        body.frequency.value = 150;

        bodyGain.gain.setValueAtTime(0.8, now);
        bodyGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.22
        );

        noiseDuration = 0.38;
        bodyDuration = 0.22;
    }


    // =========================
    // TIGHT
    // Extremely short
    // =========================

    else if (variant === "tight") {

        filter.type = "highpass";
        filter.frequency.value = 5000;

        noiseGain.gain.setValueAtTime(1, now);
        noiseGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.035
        );

        body.type = "square";
        body.frequency.value = 320;

        bodyGain.gain.setValueAtTime(0.25, now);
        bodyGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.025
        );

        noiseDuration = 0.035;
        bodyDuration = 0.025;
    }


    // =========================
    // HEAVY
    // Low, long, boomy
    // =========================

    else if (variant === "heavy") {

        filter.type = "lowpass";
        filter.frequency.value = 1400;

        noiseGain.gain.setValueAtTime(0.7, now);
        noiseGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.45
        );

        body.type = "sine";

        body.frequency.setValueAtTime(
            180,
            now
        );

        body.frequency.exponentialRampToValueAtTime(
            80,
            now + 0.18
        );

        bodyGain.gain.setValueAtTime(1.2, now);
        bodyGain.gain.exponentialRampToValueAtTime(
            0.001,
            now + 0.4
        );

        noiseDuration = 0.45;
        bodyDuration = 0.4;
    }


    // =========================
    // ROUTING
    // =========================

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    body.connect(bodyGain);
    bodyGain.connect(masterGain);


    // =========================
    // PLAY
    // =========================

    noise.start(now);
    noise.stop(now + noiseDuration);

    body.start(now);
    body.stop(now + bodyDuration);
}


// ========================================
// HI-HAT
// ========================================

function playHiHat(open = false, variant = "classic") {

    const now = audioContext.currentTime;

    let frequency = 7000;
    let volume = 0.35;
    let duration = open ? 0.5 : 0.06;

    switch (variant) {

        case "trap":
            frequency = 9500;
            volume = 0.3;
            duration = open ? 0.35 : 0.025;
            break;

        case "lofi":
            frequency = 4500;
            volume = 0.28;
            duration = open ? 0.45 : 0.09;
            break;

        case "metallic":
            frequency = 11000;
            volume = 0.4;
            duration = open ? 0.6 : 0.045;
            break;

        case "soft":
            frequency = 5500;
            volume = 0.18;
            duration = open ? 0.4 : 0.08;
            break;

        case "long":
            frequency = 7000;
            volume = 0.35;
            duration = 0.9;
            break;

        case "bright":
            frequency = 11000;
            volume = 0.4;
            duration = open ? 0.65 : 0.05;
            break;

        case "dark":
            frequency = 4000;
            volume = 0.3;
            duration = open ? 0.75 : 0.08;
            break;
    }


    const noise = audioContext.createBufferSource();

    noise.buffer = noiseBuffer;


    const filter = audioContext.createBiquadFilter();

    filter.type = "highpass";
    filter.frequency.value = frequency;


    const gain = audioContext.createGain();

    gain.gain.setValueAtTime(
        volume,
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
    noise.stop(now + duration);
}

// ========================================
// CLAP
// ========================================

function playClap(variant = "classic") {

    const now = audioContext.currentTime;

    let bursts = [0, 0.025, 0.05];
    let frequency = 1400;
    let q = 0.7;
    let volume = 0.7;
    let decay = 0.08;

    switch (variant) {

        case "wide":
            bursts = [0, 0.025, 0.05, 0.085];
            frequency = 1200;
            q = 0.5;
            volume = 0.75;
            decay = 0.16;
            break;

        case "short":
            bursts = [0, 0.015];
            frequency = 1800;
            q = 1;
            volume = 0.8;
            decay = 0.035;
            break;

        case "bright":
            bursts = [0, 0.02, 0.04];
            frequency = 2800;
            q = 1.4;
            volume = 0.75;
            decay = 0.07;
            break;
    }

    bursts.forEach(offset => {

        const noise = audioContext.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = audioContext.createBiquadFilter();

        filter.type = "bandpass";
        filter.frequency.value = frequency;
        filter.Q.value = q;

        const gain = audioContext.createGain();

        gain.gain.setValueAtTime(
            volume,
            now + offset
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + offset + decay
        );

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(now + offset);
        noise.stop(now + offset + decay + 0.02);
    });
}


// ========================================
// SOUND ROUTER
// ========================================

function playSound(sound) {

    const selector = document.querySelector(
        `.sound-select[data-sound="${sound}"]`
    );

    const variant = selector ? selector.value : "classic";

    switch (sound) {

        case "kick":
            playKick(variant);
            break;

        case "snare":
            playSnare(variant);
            break;

        case "clap":
            playClap(variant);
            break;

        case "hihat":
            playHiHat(false, variant);
            break;

        case "openhat":
            playHiHat(true, variant);
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
                await initAudio();


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


        await initAudio();


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
    async () => {

        await initAudio();

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

// ========================================
// TRAGEDY // SAVED BEATS
// ========================================


// Use the SAME values as signup/login/account

const SUPABASE_URL = "https://gckhdwlyvsystwirgvmf.supabase.co";
const SUPABASE_KEY = "sb_publishable__gaBR077T17LOA3z6lpy0Q_GWPNrHmH";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// ELEMENTS
// ========================================

const beatNameInput =
    document.getElementById("beatName");

const saveBeatButton =
    document.getElementById("saveBeatButton");

const loadBeatsButton =
    document.getElementById("loadBeatsButton");

const beatMessage =
    document.getElementById("beatMessage");


// ========================================
// GET CURRENT PATTERN
// ========================================

function getCurrentPattern() {

    const pattern = {};

    tracks.forEach(track => {

        const sound =
            track.dataset.sound;

        const steps =
            track.querySelectorAll(".step");


        pattern[sound] =
            Array.from(steps).map(step =>
                step.classList.contains("active")
            );

    });


    return pattern;
}


// ========================================
// GET DRUM VARIANTS
// ========================================

function getDrumVariants() {

    const variants = {};

    document
        .querySelectorAll(".sound-select")
        .forEach(selector => {

            variants[selector.dataset.sound] =
                selector.value;

        });


    return variants;
}


// ========================================
// SAVE BEAT
// ========================================

saveBeatButton.addEventListener(
    "click",
    async () => {

        clearBeatMessage();


        // ------------------------------
        // Beat name
        // ------------------------------

        const beatName =
            beatNameInput.value.trim();


        if (!beatName) {

            showBeatError(
                "ENTER A BEAT NAME"
            );

            return;
        }


        // ------------------------------
        // Check login
        // ------------------------------

        const {
            data: { session },
            error: sessionError
        } = await supabaseClient.auth.getSession();


        if (sessionError) {

            console.error(
                "Session error:",
                sessionError
            );

            showBeatError(
                "UNABLE TO CHECK ACCOUNT"
            );

            return;
        }


        if (!session) {

            showBeatError(
                "LOG IN TO SAVE BEATS"
            );

            return;
        }


        // ------------------------------
        // Build beat
        // ------------------------------

        const pattern =
            getCurrentPattern();

        const drumVariants =
            getDrumVariants();

        const bpm =
            Number(bpmInput.value);


        // ------------------------------
        // Loading
        // ------------------------------

        saveBeatButton.disabled = true;

        saveBeatButton.textContent =
            "SAVING...";


        // ------------------------------
        // Supabase insert
        // ------------------------------

        const { data, error } =
            await supabaseClient
                .from("saved_beats")
                .insert({

                    user_id:
                        session.user.id,

                    name:
                        beatName,

                    bpm:
                        bpm,

                    pattern:
                        pattern,

                    drum_variants:
                        drumVariants

                })
                .select()
                .single();


        saveBeatButton.disabled = false;

        saveBeatButton.textContent =
            "SAVE BEAT";


        // ------------------------------
        // Error
        // ------------------------------

        if (error) {

            console.error(
                "Save beat error:",
                error
            );

            showBeatError(
                "COULD NOT SAVE BEAT"
            );

            return;
        }


        // ------------------------------
        // Success
        // ------------------------------

        console.log(
            "Beat saved:",
            data
        );


        showBeatSuccess(
            `"${beatName}" SAVED`
        );


        beatNameInput.value = "";

    }
);


// ========================================
// MESSAGES
// ========================================

function clearBeatMessage() {

    beatMessage.textContent = "";

}


function showBeatError(message) {

    beatMessage.textContent = message;

    beatMessage.classList.remove("success");
    beatMessage.classList.add("error");

}


function showBeatSuccess(message) {

    beatMessage.textContent = message;

    beatMessage.classList.remove("error");
    beatMessage.classList.add("success");

}
// ========================================
// LOAD SAVED BEATS
// ========================================

const savedBeatsPanel =
    document.getElementById("savedBeatsPanel");

const savedBeatsList =
    document.getElementById("savedBeatsList");

const closeBeatsButton =
    document.getElementById("closeBeatsButton");


// ========================================
// OPEN LIBRARY
// ========================================

loadBeatsButton.addEventListener(
    "click",
    async () => {

        clearBeatMessage();

        const {
            data: { session },
            error: sessionError
        } = await supabaseClient.auth.getSession();


        if (sessionError) {

            console.error(sessionError);

            showBeatError(
                "UNABLE TO CHECK ACCOUNT"
            );

            return;
        }


        if (!session) {

            showBeatError(
                "LOG IN TO LOAD BEATS"
            );

            return;
        }


        savedBeatsPanel.hidden = false;

        savedBeatsList.innerHTML =
            `<p class="beats-loading">LOADING...</p>`;


        const { data: beats, error } =
            await supabaseClient
                .from("saved_beats")
                .select("*")
                .order(
                    "created_at",
                    { ascending: false }
                );


        if (error) {

            console.error(
                "Load beats error:",
                error
            );

            savedBeatsList.innerHTML =
                `<p class="beats-loading">
                    COULD NOT LOAD BEATS
                </p>`;

            return;
        }


        renderSavedBeats(beats);

    }
);


// ========================================
// RENDER LIBRARY
// ========================================

function renderSavedBeats(beats) {

    savedBeatsList.innerHTML = "";


    if (!beats || beats.length === 0) {

        savedBeatsList.innerHTML =
            `<p class="beats-loading">
                NO SAVED BEATS YET
            </p>`;

        return;
    }


    beats.forEach(beat => {

        const item =
            document.createElement("div");

        item.className =
            "saved-beat-item";


        const info =
            document.createElement("div");

        info.className =
            "saved-beat-info";


        const name =
            document.createElement("h3");

        name.textContent =
            beat.name;


        const details =
            document.createElement("p");

        details.textContent =
            `${beat.bpm} BPM`;


        info.appendChild(name);
        info.appendChild(details);


        const actions =
            document.createElement("div");

        actions.className =
            "saved-beat-actions";


        // LOAD BUTTON

        const loadButton =
            document.createElement("button");

        loadButton.textContent =
            "LOAD";

        loadButton.addEventListener(
            "click",
            () => {

                loadBeatIntoSequencer(beat);

            }
        );


        // DELETE BUTTON

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "DELETE";

        deleteButton.className =
            "delete-beat";


        deleteButton.addEventListener(
            "click",
            async () => {

                await deleteSavedBeat(
                    beat.id,
                    beat.name
                );

            }
        );


        actions.appendChild(loadButton);
        actions.appendChild(deleteButton);


        item.appendChild(info);
        item.appendChild(actions);


        savedBeatsList.appendChild(item);

    });

}


// ========================================
// LOAD BEAT INTO SEQUENCER
// ========================================

function loadBeatIntoSequencer(beat) {

    // Stop current playback

    if (playing) {

        playing = false;

        clearInterval(interval);

        interval = null;

        currentStep = 0;

    }


    // ------------------------------
    // BPM
    // ------------------------------

    bpmInput.value =
        beat.bpm;


    // ------------------------------
    // PATTERN
    // ------------------------------

    tracks.forEach(track => {

        const sound =
            track.dataset.sound;

        const savedPattern =
            beat.pattern?.[sound];

        const steps =
            track.querySelectorAll(".step");


        steps.forEach(
            (step, index) => {

                step.classList.remove(
                    "active",
                    "playing"
                );


                if (
                    savedPattern &&
                    savedPattern[index]
                ) {

                    step.classList.add(
                        "active"
                    );

                }

            }
        );

    });


    // ------------------------------
    // DRUM VARIANTS
    // ------------------------------

    if (beat.drum_variants) {

        document
            .querySelectorAll(".sound-select")
            .forEach(selector => {

                const sound =
                    selector.dataset.sound;

                const variant =
                    beat.drum_variants[sound];


                if (variant) {

                    selector.value =
                        variant;

                }

            });

    }


    // ------------------------------
    // FINISH
    // ------------------------------

    savedBeatsPanel.hidden = true;


    showBeatSuccess(
        `"${beat.name}" LOADED`
    );

}


// ========================================
// DELETE SAVED BEAT
// ========================================

async function deleteSavedBeat(
    beatId,
    beatName
) {

    const confirmed =
        confirm(
            `Delete "${beatName}"?`
        );


    if (!confirmed) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("saved_beats")
            .delete()
            .eq(
                "id",
                beatId
            );


    if (error) {

        console.error(
            "Delete beat error:",
            error
        );

        showBeatError(
            "COULD NOT DELETE BEAT"
        );

        return;
    }


    showBeatSuccess(
        `"${beatName}" DELETED`
    );


    // Reload library

    loadBeatsButton.click();

}


// ========================================
// CLOSE LIBRARY
// ========================================

closeBeatsButton.addEventListener(
    "click",
    () => {

        savedBeatsPanel.hidden = true;

    }
);