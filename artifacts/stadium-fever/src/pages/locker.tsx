import { useState } from "react";
import { useGameState } from "../lib/game-state";
import { CardComponent } from "../components/card-component";
import { CountryCard } from "../lib/constants";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Zap, Activity, ArrowUpCircle, XCircle } from "lucide-react";

export default function Locker() {
  const { ownedCards, equipped, equipCard, unequipCard, upgradeCard, overchargeCard } = useGameState();
  const { toast } = useToast();
  
  const [selected, setSelected] = useState<CountryCard | null>(ownedCards[0] || null);

  const isEquipped = selected ? equipped.some(c => c?.id === selected.id) : false;
  const equippedIndex = selected ? equipped.findIndex(c => c?.id === selected.id) : -1;

  const handleEquip = () => {
    if (!selected) return;
    if (isEquipped) {
      unequipCard(equippedIndex);
      toast({ title: "Card Unequipped" });
    } else {
      const emptySlot = equipped.findIndex(c => c === null);
      if (emptySlot === -1) {
        toast({ title: "No empty slots", description: "Unequip a card first.", variant: "destructive" });
      } else {
        equipCard(selected.id, emptySlot);
        toast({ title: "Card Equipped to Slot " + (emptySlot + 1) });
      }
    }
  };

  const handleUpgrade = () => {
    if (!selected) return;
    const success = upgradeCard(selected.id);
    if (success) {
      toast({ title: "Card Upgraded!", description: "+5 Roar Power" });
      // Refresh local selection view
      setSelected(ownedCards.find(c => c.id === selected.id) || null);
    } else {
      toast({ title: "Insufficient Pitch Points", description: "Needs 300 PP", variant: "destructive" });
    }
  };

  const handleOvercharge = () => {
    if (!selected) return;
    const res = overchargeCard(selected.id);
    if (res) {
      toast({ 
        title: `Overcharge: ${res.result}`, 
        description: res.message,
        variant: res.result === "Fail" ? "destructive" : "default"
      });
      setSelected(ownedCards.find(c => c.id === selected.id) || null);
    } else {
      toast({ title: "Insufficient Pitch Points", description: "Needs 500 PP", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
      
      {/* Grid of owned cards */}
      <div className="flex-1 bg-card border border-border rounded-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Collection ({ownedCards.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ownedCards.map(card => {
            const equippedHere = equipped.some(c => c?.id === card.id);
            return (
              <div key={card.id} className="relative">
                <CardComponent 
                  card={card} 
                  size="sm" 
                  selected={selected?.id === card.id}
                  onClick={() => setSelected(card)}
                  className="w-full h-auto aspect-[2/3]"
                />
                {equippedHere && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase z-20 shadow-md">
                    Equipped
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Card Preview & Actions */}
      <div className="w-full lg:w-96 flex flex-col gap-6 flex-shrink-0">
        {selected ? (
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 opacity-20 bg-gradient-to-b from-current to-transparent z-0" style={{ color: selected.color }} />
            
            <div className="relative z-10 mb-6">
               <CardComponent card={selected} size="lg" />
            </div>

            <div className="w-full flex flex-col gap-3 relative z-10">
              <Button 
                onClick={handleEquip}
                className={`w-full font-black uppercase tracking-widest py-6 ${
                  isEquipped 
                    ? "bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive/30 hover:text-destructive" 
                    : "bg-primary hover:bg-primary/80 text-primary-foreground glow-box"
                }`}
              >
                {isEquipped ? <><XCircle className="w-4 h-4 mr-2" /> Unequip</> : <><Zap className="w-4 h-4 mr-2" /> Equip Card</>}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleUpgrade}
                  variant="outline" 
                  className="flex-col h-auto py-3 border-border hover:border-foreground transition-colors"
                >
                  <span className="flex items-center gap-1 font-bold uppercase text-xs mb-1">
                    <ArrowUpCircle className="w-3 h-3" /> Upgrade
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">300 PP</span>
                </Button>
                
                <Button 
                  onClick={handleOvercharge}
                  variant="outline" 
                  className="flex-col h-auto py-3 border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-colors"
                >
                  <span className="flex items-center gap-1 font-bold uppercase text-xs mb-1">
                    <Activity className="w-3 h-3" /> Overcharge
                  </span>
                  <span className="font-mono text-xs opacity-70">500 PP</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground font-mono uppercase tracking-widest">
            Select a card
          </div>
        )}
      </div>

    </div>
  );
}
