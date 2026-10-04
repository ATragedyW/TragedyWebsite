export default async function handler(req, res) {

    const code = req.query.code;

    if (!code) {
        return res.status(400).send("No Spotify authorization code received.");
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const redirectUri =
        "http://127.0.0.1:3000/api/spotify-callback";

    try {

        const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",

                    Authorization:
                        "Basic " +
                        Buffer.from(
                            clientId + ":" + clientSecret
                        ).toString("base64")
                },

                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUri
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error("Spotify token error:", data);

            return res
                .status(500)
                .send("Spotify authorization failed.");
        }

        if (!data.refresh_token) {

            return res
                .status(500)
                .send("Spotify did not return a refresh token.");
        }

        console.log(
            "SPOTIFY REFRESH TOKEN:",
            data.refresh_token
        );

        return res.send(`
            <h1>Spotify Connected!</h1>
            <p>Your refresh token was printed in your VS Code terminal.</p>
            <p>Copy it into SPOTIFY_REFRESH_TOKEN in .env.local.</p>
            <p>Do not share or commit the refresh token.</p>
        `);

    } catch (error) {

        console.error(error);

        return res
            .status(500)
            .send("Spotify server error.");
    }
}