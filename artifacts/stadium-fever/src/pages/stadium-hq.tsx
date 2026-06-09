import { useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  ArrowUpCircle,
  ChevronRight,
  Flame,
  Plus,
  Radio,
  Shield,
  Trophy,
  Zap,
} from "lucide-react";
import { useGameState } from "../lib/game-state";
import { EVENTS, type CountryCard } from "../lib/constants";
import { getCardFrameAsset, getStadiumAsset } from "../lib/assets";
import { useToast } from "../hooks/use-toast";

const FORMATION_ROLES = [
  { slot: "Slot 1", role: "LW" },
  { slot: "Slot 2", role: "ST" },
  { slot: "Slot 3", role: "RW" },
];

export default function StadiumHQ() {
  const {
    pitchPoints,
    stadiumLevel,
    roarPower,
    heat,
    phase,
    equipped,
    claimPoints,
    upgradeStadium,
    setFeverTarget,
  } = useGameState();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [claimAnim, setClaimAnim] = useState(false);
  const [stadiumPulse, setStadiumPulse] = useState(false);

  const handleClaim = () => {
    claimPoints();
    setClaimAnim(true);
    setTimeout(() => setClaimAnim(false), 1300);
    toast({ title: "+450 Pitch Points", description: "Stadium roar converted to output." });
  };

  const handleUpgrade = () => {
    const success = upgradeStadium();
    if (success) {
      setStadiumPulse(true);
      setTimeout(() => setStadiumPulse(false), 1100);
      toast({ title: "Stadium upgraded", description: `Level ${stadiumLevel + 1} unlocked. +80 Roar Power.` });
    } else {
      toast({ title: "Not enough Pitch Points", description: "Requires 500 Pitch Points.", variant: "destructive" });
    }
  };

  const liveEvent = EVENTS.find((event) => event.status === "LIVE");
  const roarPct = Math.min(100, (roarPower / 1000) * 100);
  const equippedCount = equipped.filter(Boolean).length;
  const stadiumAsset = getStadiumAsset(stadiumLevel);

  return (
    <main className="stadium-cinematic">
      <section className={`stadium-scene ${stadiumPulse ? "is-upgrading" : ""}`}>
        <div className="stadium-night" />
        <div className="stadium-hero-image" aria-hidden="true">
          <img className="stadium-hero-asset" src={stadiumAsset} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />
        </div>
        <div className="stadium-haze" />
        <div className="floodlight floodlight-left">
          <span />
          <span />
          <span />
        </div>
        <div className="floodlight floodlight-right">
          <span />
          <span />
          <span />
        </div>

        <div className="stadium-bowl" aria-hidden="true">
          <div className="stadium-roof-arc" />
          <div className="stadium-arc-shadow" />
          <div className="stadium-depth-shadow" />
          <div className="stadium-stands stadium-stands-back" />
          <div className="crowd-ring crowd-ring-back" />
          <div className="stadium-tier stadium-tier-upper" />
          <div className="stadium-stands stadium-stands-mid" />
          <div className="crowd-ring crowd-ring-mid" />
          <div className="stadium-tier stadium-tier-lower" />
          <div className="stadium-stands stadium-stands-front" />
          <div className="crowd-ring crowd-ring-front" />
          <div className="pitch-3d">
            <div className="pitch-line pitch-line-outer" />
            <div className="pitch-line pitch-line-half" />
            <div className="pitch-line pitch-line-circle" />
            <div className="pitch-line pitch-line-box pitch-line-box-left" />
            <div className="pitch-line pitch-line-box pitch-line-box-right" />
            <div className="pitch-output-glow" />
            <div className="tactical-marker tactical-marker-1" />
            <div className="tactical-marker tactical-marker-2" />
            <div className="tactical-marker tactical-marker-3" />
            <div className="formation-dot formation-dot-1" />
            <div className="formation-dot formation-dot-2" />
            <div className="formation-dot formation-dot-3" />
            <div className="formation-dot formation-dot-4" />
          </div>
          <div className="grass-foreground" />
        </div>

        <div className="stadium-vignette" />

        <div className="broadcast-scorebug">
          <div>
            <span className="scorebug-kicker">XIM</span>
            <strong>Eleven Manager</strong>
          </div>
          <div className="scorebug-divider" />
          <StatusPill icon={<Zap className="w-3.5 h-3.5" />} label="Pitch Points" value={pitchPoints.toLocaleString()} />
          <StatusPill icon={<Flame className="w-3.5 h-3.5" />} label="Heat" value={heat.toString()} />
          <StatusPill icon={<Activity className="w-3.5 h-3.5" />} label="Phase" value={phase} />
        </div>

        <aside className="club-card">
          <div className="club-card-header">
            <div>
              <p>XIM Club</p>
              <h1>Neon Home Ground</h1>
            </div>
            <div className="level-badge">
              <span>LVL</span>
              <strong>{stadiumLevel}</strong>
            </div>
          </div>
          <div className="club-output-row">
            <span className="live-dot" />
            <span>Output Stable</span>
            <strong>Match-Day Ready</strong>
          </div>
          <div className="roar-meter">
            <div className="roar-meter-top">
              <span>Roar Power</span>
              <strong>{roarPower}/1000</strong>
            </div>
            <div className="roar-meter-track">
              <div className="roar-meter-fill" style={{ width: `${roarPct}%` }} />
            </div>
          </div>
          <div className="club-card-footer">
            <Shield className="w-4 h-4" />
            <span>Floodlights armed</span>
          </div>
        </aside>

        {liveEvent && (
          <aside className="live-event-card">
            <div className="live-event-top">
              <span className="live-badge">
                <span /> Live Fever Event
              </span>
              <Radio className="w-4 h-4" />
            </div>
            <h2>{liveEvent.name}</h2>
            <p>Deploy 2-4 assets to capture match-day heat.</p>
            <button
              className="btn btn-heat live-event-cta"
              onClick={() => {
                setFeverTarget(liveEvent.name);
                setLocation("/formation");
              }}
            >
              Enter Fever <ChevronRight className="w-4 h-4" />
            </button>
          </aside>
        )}

        <div className="stadium-title-lockup">
          <span>Premium Football HQ</span>
        </div>

        <div className="pitch-cta-wrap">
          {claimAnim && <div className="reward-float">+450 PP</div>}
          <button className={`game-cta ${claimAnim ? "is-claiming" : ""}`} onClick={handleClaim}>
            <Zap className="w-6 h-6" />
            <span>Claim Pitch Points</span>
          </button>
          <p>Stadium roar converts into match output</p>
        </div>
      </section>

      <section className="stadium-hq-dock">
        <div className="formation-bench">
          <div className="bench-header">
            <div>
              <span>Active XI Bench</span>
              <h2>Formation Slots</h2>
            </div>
            <Link href="/locker">
              <button className="btn btn-ghost bench-edit">
                Edit Squad <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <div className="bench-slots">
            {FORMATION_ROLES.map(({ slot, role }, index) => {
              const card = equipped[index];
              return (
                <div key={slot} className={`squad-slot ${card ? "has-card" : "is-empty"}`}>
                  <div className="squad-slot-topline">
                    <span className="squad-slot-role">{slot}</span>
                    <span className="squad-slot-position">{role}</span>
                  </div>
                  {card ? (
                    <BenchMiniCard card={card} />
                  ) : (
                    <Link href="/locker" className="empty-squad-link">
                      <span className="empty-card-shell">
                        <Plus className="w-6 h-6" />
                      </span>
                      <span>Assign Card</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <div className="bench-footer">
            <Trophy className="w-4 h-4" />
            <span>{equippedCount} of 3 nation cards active</span>
          </div>
        </div>

        <div className="upgrade-module">
          <div className="upgrade-module-top">
            <ArrowUpCircle className="w-6 h-6" />
            <div>
              <span>Infrastructure</span>
              <h2>Stadium Upgrade</h2>
            </div>
          </div>
          <div className="upgrade-level-grid">
            <div>
              <span>Stadium Level</span>
              <strong>{stadiumLevel}</strong>
            </div>
            <div>
              <span>Next Upgrade</span>
              <strong>{stadiumLevel + 1}</strong>
            </div>
          </div>
          <div className="upgrade-bonus">
            <span>Bonus</span>
            <strong>+80 Roar Power</strong>
          </div>
          <button className="btn btn-accent upgrade-cta" onClick={handleUpgrade}>
            Upgrade Stadium
            <span>500 PP</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function StatusPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="scorebug-pill">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BenchMiniCard({ card }: { card: CountryCard }) {
  const cardStyle = {
    "--nation-color": card.color,
    "--bench-frame-url": `url("${getCardFrameAsset(card.rarity)}")`,
  } as CSSProperties;

  return (
    <div className="bench-mini-card" style={cardStyle}>
      <div className="bench-mini-shine" />
      <div className="bench-card-top">
        <strong>{card.level.toString().padStart(2, "0")}</strong>
        <span>{card.rarity}</span>
      </div>
      <div className="bench-card-crest">
        <div />
      </div>
      <h3>{card.name}</h3>
      <div className="bench-card-stats">
        <span>ROA {card.stats.roar}</span>
        <span>HET {card.stats.heat}</span>
      </div>
    </div>
  );
}
