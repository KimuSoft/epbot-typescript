import { Biome } from '../types/room'
import { FishRarity } from '../types/types'
import { Schema, model } from 'mongoose'

interface IFishData {
  id: string
  name: string
  avgPrice: number
  avgLength: number
  appearedSeasons: string[]
  rarity: FishRarity
  biomes: Biome[]
}

const fishData = new Schema<IFishData>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  avgPrice: { type: Number, required: true },
  avgLength: { type: Number, required: true },
  appearedSeasons: { type: [String], required: true },
  rarity: { type: Number, required: true },
  biomes: { type: [Number], required: true },
})

export const FishData = model<IFishData>('fishData', fishData)
