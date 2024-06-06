const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
const client_Id = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URL;

app.post('/login', (req, res) => {
    const code = req.body.code;
    if (!code) {
        return res.status(400).send("Missing authorization code");
    }

    const spotifyApi = new SpotifyWebApi({
        redirectUri: redirectUri,
        clientId: client_Id,
        clientSecret: clientSecret,
    });

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
                client_id: process.env.CLIENT_ID,
            });
        })
        .catch(err => {
            console.error("Spotify API error:", err);
            res.status(400).send("Invalid authorization code or Spotify API error");
        });
});

app.post('/refresh', (req, res) => {
    const refresh_token = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: redirectUri,
        clientId: client_Id,
        clientSecret: clientSecret,
        refreshToken: refresh_token,
    })

    spotifyApi.refreshAccessToken().then((data) => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    }).catch((err) => {
        res.sendStatus(400);
        console.log('could not refresh access token', err);
    });
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.params.artist, req.query.track) || " No lyrics found "
    res.json({ lyrics: lyrics })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
