// ========================================
// TRAGEDY // CHANGELOG DATA
// Add new updates to the TOP of this list.
// ========================================

const changelog = [

    {
        version: "1.3.0",
        date: "OCT 04 2026",
        title: "BEATMAKER",
        changes: [
            ["+", "Added Tragedy Beatmaker"],
            ["+", "Added 16-step drum sequencer"],
            ["+", "Added BPM and volume controls"],
            ["+", "Added Web Audio drum synthesis"]
        ]
    },

    {
        version: "1.2.0",
        date: "OCT 03 2026",
        title: "SPOTIFY",
        changes: [
            ["+", "Added Spotify Now Playing"],
            ["+", "Added Spotify API integration"],
            ["~", "Improved homepage layout"]
        ]
    },

    {
        version: "1.0.0",
        date: "OCT 03 2026",
        title: "THE BEGINNING",
        changes: [
            ["+", "Tragedy goes live"]
        ]
    }

];


// ========================================
// BUILD CHANGELOG
// You normally don't need to edit below here.
// ========================================

const changelogContainer =
    document.getElementById("changelogEntries");


function getChangeClass(symbol) {

    switch (symbol) {

        case "+":
            return "added";

        case "~":
            return "changed";

        case "-":
            return "removed";

        case "!":
            return "fixed";

        default:
            return "";
    }
}


changelog.forEach(release => {

    // Create release article

    const article =
        document.createElement("article");

    article.classList.add("release");


    // Release header

    const header =
        document.createElement("div");

    header.classList.add("release-header");


    const info =
        document.createElement("div");


    const version =
        document.createElement("span");

    version.classList.add("version");

    version.textContent =
        `v${release.version}`;


    const title =
        document.createElement("h2");

    title.textContent =
        release.title;


    const date =
        document.createElement("time");

    date.textContent =
        release.date;


    info.appendChild(version);
    info.appendChild(title);

    header.appendChild(info);
    header.appendChild(date);


    // Changes

    const changes =
        document.createElement("div");

    changes.classList.add("changes");


    release.changes.forEach(change => {

        const symbol = change[0];
        const description = change[1];


        const paragraph =
            document.createElement("p");


        const symbolElement =
            document.createElement("span");

        symbolElement.textContent =
            symbol;

        symbolElement.classList.add(
            getChangeClass(symbol)
        );


        paragraph.appendChild(
            symbolElement
        );

        paragraph.append(
            description
        );


        changes.appendChild(
            paragraph
        );

    });


    article.appendChild(header);

    article.appendChild(changes);


    changelogContainer.appendChild(
        article
    );

});