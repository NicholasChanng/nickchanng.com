import React, { useState, useEffect, useCallback } from "react";

interface SpotifyTrack {
  name: string;
  artists: string[];
  album: string;
  albumImage: string;
  externalUrl: string;
}

interface SpotifyArtist {
  name: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface SpotifyNowPlayingProps {
  apiUrl?: string;
}

const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = ({
  apiUrl = "https://nickchanng-com-backend.onrender.com",
}) => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotifyData = useCallback(async () => {
    try {
      setError(null);

      // Step 1: Get access token
      const tokenResponse = await fetch(`${apiUrl}/refresh-token`);
      if (!tokenResponse.ok) {
        throw new Error("Failed to get access token");
      }

      const { accessToken } = await tokenResponse.json();

      // Step 2: Fetch recently played tracks
      const spotifyResponse = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!spotifyResponse.ok) {
        if (spotifyResponse.status === 401) {
          throw new Error("Token expired, will retry");
        }
        if (spotifyResponse.status === 429) {
          throw new Error("Rate limited, will retry later");
        }
        throw new Error(`Spotify API error: ${spotifyResponse.status}`);
      }

      const data = await spotifyResponse.json();

      if (data.items && data.items.length > 0) {
        const trackData = data.items[0].track;
        const newTrack: SpotifyTrack = {
          name: trackData.name,
          artists: trackData.artists.map(
            (artist: SpotifyArtist) => artist.name
          ),
          album: trackData.album.name,
          albumImage: trackData.album.images[0]?.url || "",
          externalUrl: trackData.external_urls.spotify,
        };

        setTrack(newTrack);
      } else {
        setTrack(null);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Spotify fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsLoading(false);

      // Don't show error for rate limiting or token issues (will retry)
      if (
        err instanceof Error &&
        (err.message.includes("Rate limited") ||
          err.message.includes("Token expired"))
      ) {
        setError(null);
      }
    }
  }, [apiUrl]);

  // Initial fetch
  useEffect(() => {
    fetchSpotifyData();
  }, [fetchSpotifyData]);

  // Polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSpotifyData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSpotifyData]);

  // Retry on error after 5 seconds
  useEffect(() => {
    if (
      error &&
      !error.includes("Rate limited") &&
      !error.includes("Token expired")
    ) {
      const timeout = setTimeout(() => {
        fetchSpotifyData();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [error, fetchSpotifyData]);

  if (isLoading) {
    return (
      <section className="spotify-section">
        <h2 className="section-title spotify-title">
          Last Played on Spotify <LiveCircleIcon />
        </h2>
        <div className="spotify-song-card">
          <div className="spotify-song-info">
            <div className="spotify-song-title">Loading...</div>
            <div className="spotify-song-artists">Fetching your music</div>
            <div className="spotify-song-album">Please wait</div>
          </div>
          <div className="spotify-album-art">
            <div className="spotify-album-placeholder"></div>
          </div>
        </div>
      </section>
    );
  }

  if (
    error &&
    !error.includes("Rate limited") &&
    !error.includes("Token expired")
  ) {
    return (
      <section className="spotify-section">
        <h2 className="section-title spotify-title">
          Last Played on Spotify <LiveCircleIcon />
        </h2>
        <div className="spotify-song-card error">
          <div className="spotify-song-info">
            <div className="spotify-song-title">Unable to load</div>
            <div className="spotify-song-artists">Spotify data unavailable</div>
            <div className="spotify-song-album">Retrying...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!track) {
    return (
      <section className="spotify-section">
        <h2 className="section-title spotify-title">
          Last Played on Spotify <LiveCircleIcon />
        </h2>
        <div className="spotify-song-card">
          <div className="spotify-song-info">
            <div className="spotify-song-title">No recent tracks</div>
            <div className="spotify-song-artists">
              Start listening to see your music
            </div>
            <div className="spotify-song-album">Updates every 30 seconds</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="spotify-section">
      <h2 className="section-title spotify-title">
        Last Played on Spotify <LiveCircleIcon />
      </h2>
      <div className="spotify-song-card">
        <div className="spotify-song-info">
          <div className="spotify-song-title">{track.name}</div>
          <div className="spotify-song-artists">{track.artists.join(", ")}</div>
          <div className="spotify-song-album">{track.album}</div>
        </div>
        <div className="spotify-album-art">
          <a
            href={track.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-link"
          >
            <img src={track.albumImage} alt={`${track.album} album cover`} />
          </a>
        </div>
      </div>
    </section>
  );
};

// Live indicator component (reused from main App)
const LiveCircleIcon = () => (
  <span className="live-indicator">
    <span className="live-dot" /> Live
  </span>
);

export default SpotifyNowPlaying;
