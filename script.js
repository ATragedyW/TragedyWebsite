// =========================
// SPOTIFY NOW PLAYING
// =========================

async function getCurrentlyPlaying() {

    const nowPlaying =
        document.getElementById("nowPlaying");

    if (!nowPlaying) {
        return;
    }

    try {

        // Ask OUR backend for Tragedy's Spotify status
        const response = await fetch("/api/spotify");


        // =========================
        // API ERROR
        // =========================

        if (!response.ok) {

            console.error(
                "Spotify backend error:",
                response.status
            );

            nowPlaying.innerHTML = `
                <div class="spotify-status">
                    <span class="status-dot"></span>
                    <span>SPOTIFY ERROR</span>
                </div>

                <div class="spotify-content">

                    <div class="song-info">

                        <h3>
                            Unable to get Spotify
                        </h3>

                        <p>
                            Spotify status is currently unavailable.
                        </p>

                    </div>

                </div>
            `;

            clearInterval(progressInterval);

            return;
        }


        // =========================
        // GET DATA FROM BACKEND
        // =========================

        const data = await response.json();


        // =========================
        // NOTHING PLAYING
        // =========================

        if (!data.isPlaying) {

            nowPlaying.innerHTML = `
                <div class="spotify-status">

                    <span class="status-dot"></span>

                    <span>SPOTIFY</span>

                </div>


                <div class="spotify-content">

                    <div class="song-info">

                        <h3>
                            Nothing is playing
                        </h3>

                        <p>
                            Tragedy isn't listening to anything right now.
                        </p>

                    </div>

                </div>
            `;

            clearInterval(progressInterval);

            return;
        }


        // =========================
        // DISPLAY CURRENT SONG
        // =========================

        nowPlaying.innerHTML = `

            <div class="spotify-status">

                <span class="status-dot"></span>

                <span>NOW PLAYING</span>

            </div>


            <div class="spotify-content">

                <img
                    src="${data.albumArt}"
                    alt="Album artwork"
                >


                <div class="song-info">

                    <h3>
                        ${data.title}
                    </h3>


                    <p>
                        ${data.artist}
                    </p>


                    <div class="song-progress">

                        <div class="progress-bar">

                            <div
                                id="progressFill"
                                class="progress-fill">
                            </div>

                        </div>


                        <div class="progress-times">

                            <span id="currentTime">
                                ${formatTime(data.progress)}
                            </span>

                            <span id="duration">
                                ${formatTime(data.duration)}
                            </span>

                        </div>

                    </div>


                    <a
                        class="spotify-link"
                        href="${data.spotifyUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        OPEN IN SPOTIFY →
                    </a>

                </div>

            </div>
        `;


        // Start animated progress bar
        startProgressBar(
            data.progress,
            data.duration
        );

    }

    catch (error) {

        console.error(
            "Unable to contact Spotify backend:",
            error
        );

        nowPlaying.innerHTML = `
            <div class="spotify-status">

                <span class="status-dot"></span>

                <span>SPOTIFY ERROR</span>

            </div>

            <div class="spotify-content">

                <div class="song-info">

                    <h3>
                        Spotify unavailable
                    </h3>

                    <p>
                        Unable to connect to Spotify right now.
                    </p>

                </div>

            </div>
        `;

        clearInterval(progressInterval);
    }
}



// =========================
// PROGRESS BAR
// =========================

let progressInterval;



// =========================
// FORMAT TIME
// =========================

function formatTime(milliseconds) {

    const totalSeconds =
        Math.floor(milliseconds / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return (
        minutes +
        ":" +
        seconds
            .toString()
            .padStart(2, "0")
    );
}



// =========================
// START PROGRESS BAR
// =========================

function startProgressBar(
    startingProgress,
    duration
) {

    clearInterval(progressInterval);

    let progress =
        startingProgress;


    updateProgressBar(
        progress,
        duration
    );


    progressInterval =
        setInterval(() => {

            progress += 1000;


            if (progress >= duration) {

                clearInterval(
                    progressInterval
                );

                getCurrentlyPlaying();

                return;
            }


            updateProgressBar(
                progress,
                duration
            );

        }, 1000);
}



// =========================
// UPDATE PROGRESS BAR
// =========================

function updateProgressBar(
    progress,
    duration
) {

    const progressFill =
        document.getElementById(
            "progressFill"
        );

    const currentTime =
        document.getElementById(
            "currentTime"
        );


    if (
        !progressFill ||
        !currentTime
    ) {
        return;
    }


    const percent =
        Math.min(
            (progress / duration) * 100,
            100
        );


    progressFill.style.width =
        `${percent}%`;


    currentTime.textContent =
        formatTime(progress);
}



// =========================
// START
// =========================

// Load immediately
getCurrentlyPlaying();


// Ask the backend for an update every 10 seconds
setInterval(
    getCurrentlyPlaying,
    10000
);