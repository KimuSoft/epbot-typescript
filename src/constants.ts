import { FishRarity, StatEffect } from './types/types'

export const ROOM_TIER_EMBED_COLOR = [
  0xffbb00, 0x4bc59f, 0xabf200, 0x9625fa, 0x9aabed, 0xfa753c, 0xeb44a0,
  0x000000,
]

export const DEFAULT_STAT_EFFECTS: StatEffect = {
  maintenance: 0,
  fee: 5,
  feeRange: 0,
  feeMinDown: 0,
  feeMaxUp: 0,
  fishPointChance: 0,
  fakeChance: 0,
  trashSample: 20,
  commonSample: 64,
  rareSample: 12,
  epicSample: 3,
  legendarySample: 0.9,
  mythicSample: 0.1,

  fishPriceCoef: 1,
  expCoef: 1,
}

export const getFishIcon = (rarity: FishRarity) => {
  switch (rarity) {
    case FishRarity.Trash:
      return '🗑️'
    case FishRarity.Common:
      return '🐟'
    case FishRarity.Rare:
      return '🐠'
    case FishRarity.Epic:
      return '🐡'
    case FishRarity.Legendary:
      return '🦈'
    case FishRarity.Mythic:
      return '🐋'
  }
}
