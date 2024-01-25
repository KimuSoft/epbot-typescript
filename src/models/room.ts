import { DEFAULT_STAT_EFFECTS } from '../constants'
import { findBuilding } from '../game/building'
import { IRoom, IRoomMethods } from '../types/room'
import { StatEffect } from '../types/types'
import mongoose, { Schema, model } from 'mongoose'

export const roomSchema = new Schema<IRoom, IRoomMethods>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },

    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    exp: { type: Number, required: true },
    fee: { type: Number, required: true },
    clean: { type: Number, required: true },
    landPrice: { type: Number, required: true },

    season: { type: Number, required: true },
    biome: { type: Number, required: true },
    buildings: [{ type: String }],
  },
  { timestamps: true }
)

// 매입에 필요한 최소 금액
roomSchema.virtual('minPrices').get(function (this: IRoom): number {
  return this.landPrice ? this.landPrice * 1.1 : 30000
})

// 시설 효과 불러오기
roomSchema.methods.getEffects = function (this: IRoom): StatEffect {
  const effects: StatEffect = { ...DEFAULT_STAT_EFFECTS }

  for (const buildingId of this.buildings) {
    const building = findBuilding(buildingId)

    if (!building) {
      console.warn(`Building not found: ${buildingId}`)
      continue
    }

    for (const [key, value] of Object.entries(building.effects)) {
      effects[key as keyof StatEffect] += value
    }
  }

  return effects
}

// 설정 가능한 최소 수수료
roomSchema.virtual('minFee').get(function (this: IRoom & IRoomMethods): number {
  const effect = this.getEffects()
  return this.fee - effect.feeRange - effect.feeMinDown
})

// 설정 가능한 최대 수수료
roomSchema.virtual('maxFee').get(function (this: IRoom & IRoomMethods): number {
  const effect = this.getEffects()
  return this.fee + effect.feeRange + effect.feeMaxUp
})

export const Room = model<IRoom>('rooms', roomSchema)
