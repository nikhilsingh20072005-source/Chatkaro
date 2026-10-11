import React, { useEffect, useRef, useState } from "react";

const VoiceMessage = ({
  src,
  duration = 0,
  isOwnMessage = false,
}) => {
  const audioRef = useRef(null);

  const [playing, setPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [audioDuration, setAudioDuration] =
    useState(duration || 0);

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata =
      () => {
        if (audio.duration) {
          setAudioDuration(
            audio.duration
          );
        }
      };

    const handleTimeUpdate =
      () => {
        setCurrentTime(
          audio.currentTime
        );
      };

    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, []);

  if (!src) {
    return null;
  }

  const togglePlay = async () => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch (error) {
      console.error(
        "VOICE PLAY ERROR:",
        error
      );
    }
  };

  const handleSeek = (
    event
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    const value =
      Number(event.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (seconds) => {
    if (
      !seconds ||
      Number.isNaN(seconds)
    ) {
      return "0:00";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  return (
    <div
      className={`voice-message ${
        isOwnMessage
          ? "voice-message-own"
          : "voice-message-other"
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
      />

      <button
        type="button"
        className="voice-play-button"
        onClick={togglePlay}
        aria-label={
          playing
            ? "Pause voice message"
            : "Play voice message"
        }
      >
        {playing ? "⏸" : "▶"}
      </button>

      <div className="voice-message-content">
        <input
          type="range"
          min="0"
          max={audioDuration || 0}
          step="0.1"
          value={Math.min(
            currentTime,
            audioDuration || 0
          )}
          onChange={handleSeek}
          disabled={
            !audioDuration
          }
          aria-label="Voice progress"
        />

        <div className="voice-message-time">
          <span>
            {formatTime(
              currentTime
            )}
          </span>

          <span>
            {formatTime(
              audioDuration
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;