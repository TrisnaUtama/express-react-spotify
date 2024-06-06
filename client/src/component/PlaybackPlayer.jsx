import  { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

export default function PlaybackPlayer({
  accessToken,
  trackUri,
  toggleLyrics,
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;

  return (
    <>
      <div style={{ position: "relative" }}>
        <SpotifyPlayer
          token={accessToken}
          showSaveIcon
          callback={(state) => {
            if (!state.isPlaying) setPlay(false);
          }}
          play={play}
          uris={trackUri ? [trackUri] : []}
          styles={{
            bgColor: "#333",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#1cb954",
            savedColor: "#fff",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
        />
        <button
          onClick={toggleLyrics} 
          style={{ position: "absolute", top: 27, right: 20, color: "#fff" }}>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </div>
    </>
  );
}
