import React, { useState, useRef, useEffect } from "react";

const AudioPlayer = () => {
  const [volume, setVolume] = useState(0.5); // Default volume
  const audioEl = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Updates the volume of the audio element when the volume state is changed
    if (audioEl.current) {
      audioEl.current.volume = volume;
      void audioEl.current.play();
    }
  }, [volume]);

  useEffect(() => {
    if (audioEl.current) {
      void audioEl.current.play();
    }
  }, []);

  return (
    <div className="absolute bottom-10 right-10 flex flex-row justify-center items-center">
        <img className="flex h-8  w-8" src="/icons/audiooff.png" alt="" />
      <input
        className="relative range accent-gold pr-6 z-50	"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      <img className="flex h-8  w-8" src="/icons/audioon.png" alt="" />
      <audio src="/audio/the-march.mp3" ref={audioEl} autoPlay loop />
    </div>
  );
};

export default AudioPlayer;
