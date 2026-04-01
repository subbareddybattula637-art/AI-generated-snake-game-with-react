import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-glitch font-sans overflow-x-hidden scanlines relative selection:bg-magenta-glitch selection:text-black">
      <div className="static-noise"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col screen-tear">
        <header className="flex items-center justify-center gap-6 mb-12 border-b-4 border-magenta-glitch pb-6">
          <Terminal className="text-magenta-glitch" size={48} />
          <h1 className="text-4xl md:text-5xl font-digital text-cyan-glitch glitch" data-text="SYS.TERMINAL // OMEGA">
            SYS.TERMINAL // OMEGA
          </h1>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-16 lg:gap-24">
          <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1">
            <MusicPlayer />
          </div>
          
          <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
            <SnakeGame />
          </div>
        </main>
        
        <footer className="mt-16 text-center text-magenta-glitch text-2xl">
          <p className="glitch" data-text="END_OF_LINE // 0x000000">END_OF_LINE // 0x000000</p>
        </footer>
      </div>
    </div>
  );
}
