import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const [client_id, setClient_id] = useState();

  useEffect(() => {
    if (!code) return;
    axios
      .post(
        "http://localhost:5000/login",
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        setClient_id(res.data.client_id);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        console.error("Axios error:", err);
        // window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(
          "http://localhost:5000/refresh",
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          console.error("Axios error:", err);
            // window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [refreshToken, expiresIn]);

  return { accessToken, refreshToken, expiresIn, client_id };
}
