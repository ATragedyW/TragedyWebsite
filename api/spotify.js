export default async function handler(req, res) {

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    try {

        // Get a fresh Spotify access token
        const tokenResponse = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",

                    Authorization:
                        "Basic " +
                        Buffer.from(
                            clientId + ":" + clientSecret
                        ).toString("base64")
                },

                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                })
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Token error:", tokenData);

            return res.status(500).json({
                error: "Unable to refresh Spotify token"
            });
        }


        // Ask Spotify what you're currently playing
        const spotifyResponse = await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization:
                        `Bearer ${tokenData.access_token}`
                }
            }
        );


        // Nothing is currently playing
        if (spotifyResponse.status === 204) {

            return res.status(200).json({
                isPlaying: false
            });
        }


        if (!spotifyResponse.ok) {

            return res.status(spotifyResponse.status).json({
                error: "Unable to get currently playing song"
            });
        }


        const data = await spotifyResponse.json();
        const track = data.item;


        // Only send safe song information to the browser
        return res.status(200).json({

            isPlaying: data.is_playing,

            title: track.name,

            artist: track.artists
                .map(artist => artist.name)
                .join(", "),

            albumArt:
                track.album.images[0]?.url || "",

            progress:
                data.progress_ms,

            duration:
                track.duration_ms,

            spotifyUrl:
                track.external_urls.spotify
        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Spotify server error"
        });
    }
}