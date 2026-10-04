export default function handler(req, res) {

    const clientId = process.env.SPOTIFY_CLIENT_ID;

    console.log("Client ID loaded:", !!clientId);
    console.log("Client ID length:", clientId?.length);

    const redirectUri =
        "http://127.0.0.1:3000/api/spotify-callback";

    const scopes =
        "user-read-currently-playing";

    const spotifyUrl =
        "https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" + clientId +
        "&scope=" + encodeURIComponent(scopes) +
        "&redirect_uri=" + encodeURIComponent(redirectUri);

    res.redirect(spotifyUrl);
}