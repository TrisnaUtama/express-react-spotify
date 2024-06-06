import { useState, useEffect } from "react";
import useAuth from "../hooks/(auth)/useAuth";
import Logo from "../assets/logo.png";
import SpotifyWebApi from "spotify-web-api-node";
import TrackList from "./TrackList";
import PlayBackPlayer from "./PlaybackPlayer";
import axios from "axios";

export default function Dashboard({ code }) {
  const { accessToken, client_id } = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchBulk, setSearchBulk] = useState([]);
  const [spotifyApi, setSpotifyApi] = useState(new SpotifyWebApi());

  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);

  function handleChooseTrack(track) {
    setPlayingTrack(track);
  }

  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:5000/lyrics", {
        params: {
          track: playingTrack.name,
          artist: playingTrack.artists[0].name,
        },
      })
      .then((res) => {
        if (res.data && res.data.lyrics) {
          console.log(res.data.lyrics);
          setLyrics(res.data.lyrics);
        } else {
          console.error("Unexpected response format:", res);
        }
      })
      .catch((error) => {
        console.error("Error fetching lyrics:", error);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (client_id) {
      const spotifyInstance = new SpotifyWebApi({
        clientId: client_id,
      });
      setSpotifyApi(spotifyInstance);
    }
  }, [client_id]);

  useEffect(() => {
    if (accessToken && spotifyApi) {
      spotifyApi.setAccessToken(accessToken);
    }
  }, [accessToken, spotifyApi]);

  useEffect(() => {
    if (!search) return setSearchBulk([]);
    if (!accessToken || !spotifyApi) return;

    let cancel = false;
    spotifyApi
      .searchTracks(search)
      .then((data) => {
        if (cancel) return;
        setSearchBulk(data.body.tracks.items);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      cancel = true;
    };
  }, [accessToken, search, spotifyApi]);

  return (
    <div className="h-screen w-screen bg-[#151515] flex flex-col">
      <div className="grid grid-cols-3 p-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-sans rounded-lg col-span-2 h-10 bg-[#333] p-2 text-white font-normal placeholder:text-white"
          placeholder="find your jamz"
        />
        <div className="flex justify-end">
          <img src={Logo} alt="user" className="rounded w-10" />
        </div>
      </div>

      <div className="flex-grow text-white overflow-y-auto p-5">
        {showLyrics ? (
          <div className="text-white p-5">
            <h2 className="text-xl font-bold mb-2 text-center">Lyrics</h2>
            <p className="text-center">{lyrics}</p>
          </div>
        ) : (
          searchBulk.map((data) => (
            <div key={data.uri}>
              <TrackList track={data} chooseTrack={handleChooseTrack} />
            </div>
          ))
        )}
      </div>
      <div className="mt-auto p-5">
        <PlayBackPlayer
          accessToken={accessToken}
          trackUri={playingTrack?.uri}
          lyrics={lyrics}
          showLyrics={showLyrics}
          toggleLyrics={() => setShowLyrics(!showLyrics)}
        />
      </div>
    </div>
  );
}
