export default function TrackList({ track, chooseTrack }) {

  function ConvertMSintoMinuteSecond(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function handlePlay() {
    chooseTrack(track);
  }
  return (
    <div
      key={track.id}
      className="flex p-2"
      onClick={handlePlay}
      style={{ cursor: "pointer" }}>
      <img
        src={track.album.images[2].url}
        className="rounded-lg"
        alt="album-images"
      />
      <div className="ms-3 grid-rows-3">
        <div className="font-bold">{track.name}</div>
        <div className="text-sm">{track.artists[0].name}</div>
        <div className="text-sm">
          {ConvertMSintoMinuteSecond(track.duration_ms)}
        </div>
      </div>
    </div>
  );
}
