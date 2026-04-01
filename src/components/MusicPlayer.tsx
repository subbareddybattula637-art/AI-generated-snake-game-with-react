import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Cpu } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'DATA_STREAM_01.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'MEMORY_LEAK_02.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'KERNEL_PANIC_03.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="bg-black border-glitch-cyan p-6 w-full max-w-sm">
      <div className="flex items-center gap-4 mb-6 border-b-4 border-dashed border-cyan-glitch pb-4">
        <Cpu className="text-magenta-glitch animate-pulse" size={32} />
        <h2 className="text-2xl font-digital text-cyan-glitch glitch" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
      </div>
      
      <div className="mb-8 bg-gray-900 p-4 border-2 border-magenta-glitch relative">
        <div className="absolute -top-3 -left-2 bg-black px-2 text-magenta-glitch text-sm">CURRENT_STREAM</div>
        <div className="text-2xl text-cyan-glitch truncate glitch mt-2" data-text={TRACKS[currentTrack].title}>
          {TRACKS[currentTrack].title}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <button onClick={prevTrack} className="p-3 text-cyan-glitch bg-black border-2 border-cyan-glitch hover:bg-cyan-glitch hover:text-black transition-none">
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlay} className="p-4 bg-magenta-glitch text-black border-4 border-cyan-glitch hover:bg-cyan-glitch hover:border-magenta-glitch transition-none">
          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="p-3 text-cyan-glitch bg-black border-2 border-cyan-glitch hover:bg-cyan-glitch hover:text-black transition-none">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 bg-gray-900 p-3 border-2 border-cyan-glitch">
        <button onClick={() => setIsMuted(!isMuted)} className="text-magenta-glitch hover:text-cyan-glitch">
          {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-full accent-magenta-glitch h-4 bg-black appearance-none cursor-pointer border border-cyan-glitch"
        />
      </div>

      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onEnded={nextTrack}
      />
    </div>
  );
}
