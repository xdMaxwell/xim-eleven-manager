import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { INITIAL_CARDS, CountryCard } from "./constants";
import { MatchSummary } from "./match";

type Phase = "Preseason" | "Kickoff" | "Mining Live" | "Fever Live" | "Final Run";

export type Receipt = {
  id: string;
  event: string;
  formation: CountryCard[];
  rewards: { pitchPoints: number; heat?: number; mutation?: string };
  cardImpact: Record<string, { stat: "Heat" | "Form" | "Fatigue"; change: number }>;
  summary?: MatchSummary;
  claimed: boolean;
};

export type PendingMatch = {
  event: string;
  formation: CountryCard[];
};

type GameState = {
  pitchPoints: number;
  roarPower: number;
  heat: number;
  phase: Phase;
  stadiumLevel: number;
  equipped: (CountryCard | null)[];
  ownedCards: CountryCard[];
  packs: { starter: number; fever: number };
  receipts: Receipt[];
  pendingMatch: PendingMatch | null;
  feverTarget: string | null;
};

type GameContextType = GameState & {
  claimPoints: () => void;
  upgradeStadium: () => boolean;
  openPack: (type: "starter" | "fever") => CountryCard | null;
  equipCard: (cardId: string, slotIndex: number) => void;
  unequipCard: (slotIndex: number) => void;
  upgradeCard: (cardId: string) => boolean;
  overchargeCard: (cardId: string) => { result: string; message: string } | null;
  startMatch: (event: string, formation: CountryCard[]) => void;
  clearPendingMatch: () => void;
  setFeverTarget: (event: string | null) => void;
  deployFormation: (event: string, formation: CountryCard[], summary?: MatchSummary) => string;
  claimReceipt: (receiptId: string) => void;
};

const INITIAL_STATE: GameState = {
  pitchPoints: 1250,
  roarPower: 420,
  heat: 12,
  phase: "Preseason",
  stadiumLevel: 1,
  equipped: [null, null, null],
  ownedCards: INITIAL_CARDS,
  packs: { starter: 1, fever: 0 },
  receipts: [],
  pendingMatch: null,
  feverTarget: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const claimPoints = useCallback(() => {
    setState((s) => ({ ...s, pitchPoints: s.pitchPoints + 450 }));
  }, []);

  const upgradeStadium = useCallback(() => {
    let success = false;
    setState((s) => {
      if (s.pitchPoints >= 500) {
        success = true;
        return {
          ...s,
          pitchPoints: s.pitchPoints - 500,
          stadiumLevel: s.stadiumLevel + 1,
          roarPower: s.roarPower + 80,
        };
      }
      return s;
    });
    return success;
  }, []);

  const openPack = useCallback((type: "starter" | "fever") => {
    // simplified mock
    let pulledCard = null;
    setState((s) => {
      if (s.packs[type] > 0) {
        pulledCard = { ...INITIAL_CARDS[Math.floor(Math.random() * INITIAL_CARDS.length)], id: Math.random().toString(), level: 1 };
        return {
          ...s,
          packs: { ...s.packs, [type]: s.packs[type] - 1 },
          ownedCards: [...s.ownedCards, pulledCard],
        };
      }
      return s;
    });
    return pulledCard;
  }, []);

  const equipCard = useCallback((cardId: string, slotIndex: number) => {
    setState((s) => {
      const card = s.ownedCards.find((c) => c.id === cardId);
      if (!card) return s;
      const newEquipped = [...s.equipped];
      newEquipped[slotIndex] = card;
      return { ...s, equipped: newEquipped };
    });
  }, []);

  const unequipCard = useCallback((slotIndex: number) => {
    setState((s) => {
      const newEquipped = [...s.equipped];
      newEquipped[slotIndex] = null;
      return { ...s, equipped: newEquipped };
    });
  }, []);

  const upgradeCard = useCallback((cardId: string) => {
    let success = false;
    setState((s) => {
      if (s.pitchPoints >= 300) {
        success = true;
        return {
          ...s,
          pitchPoints: s.pitchPoints - 300,
          ownedCards: s.ownedCards.map((c) => (c.id === cardId ? { ...c, level: c.level + 1, stats: { ...c.stats, roar: c.stats.roar + 5 } } : c)),
        };
      }
      return s;
    });
    return success;
  }, []);

  const overchargeCard = useCallback((cardId: string) => {
    let resultPayload = null;
    setState((s) => {
      if (s.pitchPoints >= 500) {
        const outcomes = ["Success", "Great Success", "Fail", "Mutation"];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        
        resultPayload = { result: outcome, message: "" };
        
        const newCards = s.ownedCards.map((c) => {
          if (c.id !== cardId) return c;
          const nc = { ...c, stats: { ...c.stats } };
          if (outcome === "Success") {
            nc.stats.heat += 2;
            resultPayload!.message = "+2 Heat";
          } else if (outcome === "Great Success") {
            nc.stats.roar += 3;
            nc.stats.luck += 1;
            resultPayload!.message = "+3 Roar, +1 Luck";
          } else if (outcome === "Fail") {
            nc.stats.form = Math.max(0, nc.stats.form - 1);
            resultPayload!.message = "-1 Form";
          } else if (outcome === "Mutation") {
            nc.mutated = true;
            resultPayload!.message = "Card Mutated!";
          }
          return nc;
        });

        return { ...s, pitchPoints: s.pitchPoints - 500, ownedCards: newCards };
      }
      return s;
    });
    return resultPayload;
  }, []);

  const startMatch = useCallback((event: string, formation: CountryCard[]) => {
    setState((s) => ({ ...s, pendingMatch: { event, formation } }));
  }, []);

  const clearPendingMatch = useCallback(() => {
    setState((s) => ({ ...s, pendingMatch: null }));
  }, []);

  const setFeverTarget = useCallback((event: string | null) => {
    setState((s) => ({ ...s, feverTarget: event }));
  }, []);

  const deployFormation = useCallback((event: string, formation: CountryCard[], summary?: MatchSummary) => {
    const receiptId = Math.random().toString();
    setState((s) => {
      const rewardPoints = summary ? summary.stadiumOutput : Math.floor(Math.random() * 500) + 300;
      const receipt: Receipt = {
        id: receiptId,
        event,
        formation,
        rewards: {
          pitchPoints: rewardPoints,
          heat: summary?.heatGained,
          mutation: summary?.mutation,
        },
        cardImpact: {},
        summary,
        claimed: false,
      };

      formation.forEach(c => {
        receipt.cardImpact[c.id] = {
          stat: "Fatigue",
          change: summary ? summary.fatigue : -1,
        };
      });

      return { ...s, receipts: [receipt, ...s.receipts], pendingMatch: null };
    });
    return receiptId;
  }, []);

  const claimReceipt = useCallback((receiptId: string) => {
    setState((s) => {
      const rec = s.receipts.find(r => r.id === receiptId);
      if (!rec || rec.claimed) return s;

      return {
        ...s,
        pitchPoints: s.pitchPoints + rec.rewards.pitchPoints,
        heat: s.heat + (rec.rewards.heat ?? 0),
        receipts: s.receipts.map(r => r.id === receiptId ? { ...r, claimed: true } : r)
      };
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        claimPoints,
        upgradeStadium,
        openPack,
        equipCard,
        unequipCard,
        upgradeCard,
        overchargeCard,
        startMatch,
        clearPendingMatch,
        setFeverTarget,
        deployFormation,
        claimReceipt,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameState must be used within GameProvider");
  return context;
}
