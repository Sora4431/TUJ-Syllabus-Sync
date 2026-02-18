"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [token, setToken] = useState("");
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const getToken = () => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.events",
      callback: (response: any) => {
        setToken(response.access_token);
      },
    }
    );
    client.requestAccessToken();
  };

  const createEvent = async () => {
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          summary: "PoC Test Event",
          start: { dateTime: new Date(Date.now()).toISOString() },
          end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
        }),
      },
    );

    alert("The data is sent to Goole Calender");

  };

  return (

    <div >
      <h1>Google Calendar API PoC</h1>
      {!token ? (
        <button onClick={getToken}>Login</button>
      ) : (
        <button onClick={createEvent}>Sync</button>
      )}
    </div>

  );
}
