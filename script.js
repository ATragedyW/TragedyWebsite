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
// League profile: all Riot requests and credentials stay on the server.
async function loadLeagueProfile() {
    const container = document.getElementById('leagueProfile');
    if (!container) return;
    const element = (tag, className, text) => {
        const node = document.createElement(tag);
        node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const portrait = (url, alt) => {
        const img = element('img', 'league-icon');
        img.src = url; img.alt = alt; img.loading = 'lazy';
        return img;
    };
    try {
        const response = await fetch('/api/league', { signal: AbortSignal.timeout(15000) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'League stats are temporarily unavailable.');
        const header = element('div', 'league-account');
        header.append(portrait(data.icon, 'League profile icon'));
        const identity = element('div', '');
        identity.append(element('h3', '', data.riotId), element('p', 'league-muted', `${data.region} · Level ${data.level}`));
        header.append(identity);
        const ranks = element('div', 'league-ranks');
        for (const queue of ['Solo / Duo', 'Flex']) {
            const rank = data.ranked.find(entry => entry.queue === queue);
            const card = element('div', 'league-rank');
            card.append(element('p', 'eyebrow', queue), element('h4', '', rank ? `${rank.tier} ${rank.division}` : 'Unranked'));
            card.append(element('p', 'league-muted', rank ? `${rank.lp} LP · ${rank.winRate}% win rate` : 'No ranked placement this season'));
            if (rank) card.append(element('p', 'league-muted', `${rank.wins}W / ${rank.losses}L`));
            ranks.append(card);
        }
        const champions = element('div', 'league-champions');
        for (const champion of data.champions) {
            const card = element('div', 'league-champion');
            if (champion.icon) card.append(portrait(champion.icon, champion.name));
            const info = element('div', '');
            info.append(element('h4', '', champion.name), element('p', 'league-muted', `Mastery ${champion.level} · ${Number(champion.points).toLocaleString()} points`));
            card.append(info); champions.append(card);
        }
        if (!data.champions.length) champions.append(element('p', 'league-muted', 'No champion mastery yet.'));
        container.replaceChildren(header, ranks, element('h4', 'league-subheading', 'TOP CHAMPIONS'), champions,
            element('p', 'league-updated', `Updated ${new Date(data.updatedAt).toLocaleString()}`));
    } catch (error) {
        container.replaceChildren(element('h3', '', 'League profile unavailable'), element('p', 'league-muted', error.message === 'Failed to fetch' ? 'Unable to connect. Please try again later.' : error.message));
    }
}
loadLeagueProfile();
setInterval(loadLeagueProfile, 300000);
