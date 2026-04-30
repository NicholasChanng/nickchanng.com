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

      const tokenResponse = await fetch(`${apiUrl}/refresh-token`);
      if (!tokenResponse.ok) {
        throw new Error("Failed to get access token");
      }

      const { accessToken } = await tokenResponse.json();

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
        setTrack({
          name: trackData.name,
          artists: trackData.artists.map(
            (artist: SpotifyArtist) => artist.name
          ),
          album: trackData.album.name,
          albumImage: trackData.album.images[0]?.url || "",
          externalUrl: trackData.external_urls.spotify,
        });
      } else {
        setTrack(null);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Spotify fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsLoading(false);

      if (
        err instanceof Error &&
        (err.message.includes("Rate limited") ||
          err.message.includes("Token expired"))
      ) {
        setError(null);
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchSpotifyData();
  }, [fetchSpotifyData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSpotifyData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSpotifyData]);

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

  const title = isLoading
    ? "Loading…"
    : error
    ? "Unavailable"
    : track?.name ?? "No recent track";
  const artist = isLoading
    ? "Fetching Spotify"
    : error
    ? "Retrying…"
    : track?.artists.join(", ") ?? "—";

  const body = (
    <>
      <div className="spotify-player-turntable">
        <div
          className={`spotify-player-art${
            isLoading || !track ? " is-paused" : ""
          }`}
        >
          {track?.albumImage ? (
            <img src={track.albumImage} alt={`${track.album} album cover`} />
          ) : (
            <div className="spotify-player-art-placeholder" />
          )}
        </div>
        <div className="spotify-player-stylus" aria-hidden="true">
          <span className="spotify-player-stylus-pivot" />
          <span className="spotify-player-stylus-arm" />
          <span className="spotify-player-stylus-head" />
        </div>
      </div>
      <div className="spotify-player-info">
        <div className="spotify-player-title">{title}</div>
        <div className="spotify-player-artist">{artist}</div>
      </div>
    </>
  );

  return (
    <div className="spotify-player">
      <h3 className="spotify-player-heading">Spotify</h3>
      {track ? (
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-player-body"
        >
          {body}
        </a>
      ) : (
        <div className="spotify-player-body">{body}</div>
      )}
    </div>
  );
};

export default SpotifyNowPlaying;
