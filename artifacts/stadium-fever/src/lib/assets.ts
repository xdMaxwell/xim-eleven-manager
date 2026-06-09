import type { Rarity } from "./constants";

export const ximAssets = {
  brandSystem: "/assets/xim/brand/xim-brand-system.png",
  stadium: {
    level1: "/assets/xim/stadium/stadium-level-1.png",
    level2: "/assets/xim/stadium/stadium-level-2.png",
    level3: "/assets/xim/stadium/stadium-level-3.png",
  },
  packs: {
    starter: "/assets/xim/packs/starter-pack.png",
    fever: "/assets/xim/packs/fever-pack.png",
  },
  cards: {
    Common: "/assets/xim/cards/card-common.png",
    Rare: "/assets/xim/cards/card-rare.png",
    Epic: "/assets/xim/cards/card-epic.png",
    Mythic: "/assets/xim/cards/card-mythic.png",
  } satisfies Record<Rarity, string>,
} as const;

export function getStadiumAsset(stadiumLevel: number) {
  if (stadiumLevel >= 3) return ximAssets.stadium.level3;
  if (stadiumLevel === 2) return ximAssets.stadium.level2;
  return ximAssets.stadium.level1;
}

export function getCardFrameAsset(rarity: Rarity) {
  return ximAssets.cards[rarity];
}
