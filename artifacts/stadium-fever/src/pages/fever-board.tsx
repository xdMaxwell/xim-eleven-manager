import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { EVENTS, CountryCard } from "../lib/constants";
import { useLocation } from "wouter";

export default function FeverBoard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { heat } = useGameState();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Scoreboard Header */}
      <div className="pixel-panel p-6 bg-[#2a0808] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="font-mono text-4xl text-destructive pixel-text-shadow uppercase mb-2">Fever Arena</h1>
          <div className="bg-destructive text-white font-mono text-xs px-2 py-1 inline-block animate-blink">LIVE MATCHES</div>
        </div>
        <div className="bg-black border-4 border-destructive p-4 flex gap-8">
          <div className="text-center">
            <div className="font-mono text-[10px] text-gray-400 mb-1">HEAT</div>
            <div className="font-mono text-3xl text-destructive">{heat}</div>
          </div>
          <div className="w-1 bg-gray-800" />
          <div className="text-center">
            <div className="font-mono text-[10px] text-gray-400 mb-1">REFRESH</div>
            <div className="font-mono text-xl text-white">02:14</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Featured Live Event */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {EVENTS.filter(e => e.status === "LIVE").slice(0, 1).map(event => (
            <div key={event.id} className="pixel-panel p-8 bg-[#0a1526] flex flex-col h-full border-blue-500">
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-mono text-3xl text-secondary uppercase">{event.name}</h2>
              </div>
              <div className="bg-black border-2 border-blue-900 p-6 mb-8 flex-1">
                <p className="font-mono text-white text-lg leading-relaxed">{event.rule}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="font-mono text-xs bg-primary text-black px-2 py-1">PP YIELD</span>
                  <span className="font-mono text-xs bg-destructive text-white px-2 py-1">HEAT YIELD</span>
                  <span className="font-mono text-xs bg-purple-600 text-white px-2 py-1">MUTATION</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(event.id)}
                className="pixel-btn pixel-btn-secondary text-2xl py-4 w-full"
              >
                TACTICAL DEPLOY
              </button>
            </div>
          ))}
        </div>

        {/* Mission List */}
        <div className="pixel-panel p-6 bg-black flex flex-col gap-4">
          <h3 className="font-mono text-xl text-white uppercase border-b-4 border-white pb-2 mb-2">Missions</h3>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-4">
            {EVENTS.slice(1).map(event => {
              const isLive = event.status === "LIVE";
              return (
                <div key={event.id} className={`border-4 p-4 ${isLive ? 'border-secondary bg-[#0a1526] cursor-pointer hover:bg-[#10203a]' : 'border-gray-800 bg-gray-900 opacity-60'}`}
                  onClick={() => isLive && setSelectedEvent(event.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-mono text-lg text-white uppercase truncate">{event.name}</h4>
                    {isLive ? <div className="w-2 h-2 bg-destructive animate-blink" /> : <div className="font-mono text-[8px] text-gray-500">LOCKED</div>}
                  </div>
                  <p className="font-mono text-[10px] text-gray-400 line-clamp-2">{event.rule}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {selectedEvent && (
        <FormationModal 
          event={EVENTS.find(e => e.id === selectedEvent)!} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

function FormationModal({ event, onClose }: { event: { id: string, name: string }, onClose: () => void }) {
  const { equipped, startMatch, roarPower } = useGameState();
  const [, setLocation] = useLocation();
  const [deploying, setDeploying] = useState(false);

  const activeCards = equipped.filter((c): c is CountryCard => c !== null);

  const handleDeploy = () => {
    if (activeCards.length < 2) return;
    setDeploying(true);
    setTimeout(() => {
      startMatch(event.name, activeCards);
      setDeploying(false);
      onClose();
      setLocation("/fever-match");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="pixel-panel bg-black w-full max-w-4xl flex flex-col border-[8px] border-white">
        <div className="p-6 border-b-4 border-white flex justify-between items-center bg-[#0a1526]">
          <h2 className="font-mono text-2xl text-white uppercase">Deploy: {event.name}</h2>
          <button onClick={onClose} className="font-mono text-xl text-white hover:text-destructive">X</button>
        </div>

        {/* Pixel Pitch UI */}
        <div className="p-8 bg-green-900 border-b-4 border-white relative min-h-[300px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.1)_20px,rgba(0,0,0,0.1)_40px)]" />
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/30 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border-[8px] border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 flex gap-6">
            {equipped.map((card, i) => (
              <div key={i}>
                {card ? (
                  <div className="w-24 h-36 bg-black border-4 border-white flex flex-col items-center justify-center p-2 text-center" style={{borderColor: card.color}}>
                    <span className="font-mono text-xs uppercase" style={{color: card.color}}>{card.name}</span>
                    <span className="font-mono text-[10px] text-white mt-2">LVL {card.level}</span>
                  </div>
                ) : (
                  <div className="w-24 h-36 border-4 border-dashed border-white/50 bg-black/50 flex items-center justify-center text-white/50 font-mono text-xs">
                    SLOT {i+1}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="absolute top-4 left-4 bg-black border-2 border-white p-2 text-white font-mono text-[10px]">
            ROAR: {roarPower}
          </div>
        </div>

        <div className="p-6 bg-gray-900 flex justify-between items-center">
          <div className="font-mono text-xs text-gray-400 uppercase">Requires 2+ assets</div>
          <button 
            onClick={handleDeploy} 
            disabled={activeCards.length < 2 || deploying}
            className={`pixel-btn py-3 px-8 text-xl ${deploying ? "bg-gray-700 text-gray-400" : "pixel-btn-primary"}`}
          >
            {deploying ? "SIMULATING..." : "EXECUTE"}
          </button>
        </div>
      </div>
    </div>
  );
}
