import { DEFAULT_STAT_EFFECTS, SELL_FEE } from '../constants'
import { findBuilding } from '../game/building'
import {
  Biome,
  IRoom,
  IRoomMethods,
  RoomDoc,
  RoomModel,
  Season,
} from '../types/room'
import { StatEffect } from '../types/types'
import { UserDoc } from '../types/user'
import { User } from './user'
import { sample } from 'lodash'
import mongoose, { Schema, model } from 'mongoose'

export const roomSchema = new Schema<IRoom, IRoomMethods>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    ownerId: { type: mongoose.Schema.Types.ObjectId },
    exp: { type: Number, required: true, default: 0 },
    fame: { type: Number, required: true, default: 0 },
    fee: { type: Number, required: true, default: 5 },
    clean: { type: Number, required: true, default: 0 },
    landPrice: { type: Number, required: true, default: 0 },

    season: {
      type: Number,
      required: true,
      default: () =>
        sample([Season.Spring, Season.Summer, Season.Autumn, Season.Winter])!,
    },
    biome: {
      type: Number,
      required: true,
      default: Biome.Sea,
    },
    buildings: [{ type: String }],
  },
  { timestamps: true }
)

// 매입에 필요한 최소 금액
roomSchema.methods.getMinPrices = function (this: RoomDoc): number {
  // 주인이 있을 경우 땅값의 5%를 추가함
  return this.landPrice
    ? this.landPrice * (1 + (this.ownerId ? SELL_FEE : 0))
    : 30000
}

// 시설 효과 불러오기
roomSchema.methods.getEffects = function (this: RoomDoc): StatEffect {
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

// 낚시터 소유자 불러오기
roomSchema.methods.getOwner = async function (
  this: RoomDoc
): Promise<UserDoc | null> {
  return this.ownerId ? await User.findById(this.ownerId) : null
}

// 설정 가능한 최소 수수료
roomSchema.virtual('minFee').get(function (this: RoomDoc): number {
  const effect = this.getEffects()
  return this.fee - effect.feeRange - effect.feeMinDown
})

// 설정 가능한 최대 수수료
roomSchema.virtual('maxFee').get(function (this: RoomDoc): number {
  const effect = this.getEffects()
  return this.fee + effect.feeRange + effect.feeMaxUp
})

export const Room = model<IRoom, RoomModel>('rooms', roomSchema)
