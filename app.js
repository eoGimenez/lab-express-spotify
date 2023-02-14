require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      //console.log('The received data from the API: ', data.body.artists);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      data.body.artists.styles = "artist.css";
      res.render("artist-search", data.body.artists);
    })
    .catch((err) => next(err));
});
app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
  let artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((artist) => {
      //console.log(artist.body)
      artist.body.styles = "album.css"
      res.render("albums", artist.body);
    })
    .catch((err) => next(err));
});
app.get("/tracks/:trackId", (req, res, next) => {
  let track = req.params.trackId;
  //console.log(track)
  spotifyApi
    .getAlbumTracks(track, { limit: 7 })
    .then((album) => {
      //console.log(album.body);
      album.body.styles ="track.css"
      res.render("tracks", album.body);
    })
    .catch((err) => next(err));
});

const middlewareError = (err, req, res, next) => {
    console.log("error: ", err);
    res.send(`Ha habido un error: ${err}`)
};

app.use(middlewareError);

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
