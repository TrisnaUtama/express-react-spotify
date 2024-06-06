const AUTH_URL = () => {
  const clientId = import.meta.env.VITE_REACT_APP_CLIENT_ID;

  return (
    `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}&` +
    `response_type=code&redirect_uri=http://localhost:5173/&` +
    `scope=streaming%20user-read-email%20user-read-private%20user-library-read%20` +
    `user-library-modify%20user-read-playback-state%20user-modify-playback-state`
  );
};

export default function Login() {
  const authUrl = AUTH_URL();

  return (
    <div className="h-screen flex justify-center items-center bg-[#151515]">
      <a className="btn bg-green-400 rounded p-2 font-semibold" href={authUrl}>
        Login To Spotify Account
      </a>
    </div>
  );
}
