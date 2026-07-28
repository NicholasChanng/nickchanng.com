import React, { useState, useEffect, useRef, useCallback } from "react";

interface SpotifyTrack {
  name: string;
  artists: string[];
  album: string;
  albumImage: string;
  externalUrl: string;
  isPlaying?: boolean;
  playedAt?: string;
}

interface SpotifyNowPlayingProps {
  apiUrl?: string;
}

const POLL_MS = 30000;
const MAX_RETRY_MS = 120000;

const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = ({
  apiUrl = import.meta.env.VITE_API_URL ??
    "https://nickchanng-com-backend.onrender.com",
}) => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const failuresRef = useRef(0);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/now-playing`);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      // Backend returns null when there is nothing to show
      const data: SpotifyTrack | null = await response.json();

      failuresRef.current = 0;
      setTrack(data && data.name ? data : null);
      setHasError(false);
    } catch (err) {
      console.error("Spotify fetch error:", err);
      failuresRef.current += 1;
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Poll on a normal cadence, backing off while the backend is unhappy.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const run = async () => {
      await fetchNowPlaying();
      if (cancelled) return;

      const delay =
        failuresRef.current > 0
          ? Math.min(POLL_MS * 2 ** (failuresRef.current - 1), MAX_RETRY_MS)
          : POLL_MS;

      timer = setTimeout(run, delay);
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fetchNowPlaying]);

  const title = isLoading
    ? "Loading…"
    : hasError
    ? "Unavailable"
    : track?.name ?? "No recent track";
  const artist = isLoading
    ? "Fetching Spotify"
    : hasError
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
