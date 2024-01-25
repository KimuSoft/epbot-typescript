import { StatEffect } from './types'
import { HydratedDocument, ObjectId } from 'mongoose'

export enum Season {
  Spring = 1,
  Summer,
  Autumn,
  Winter,
}

export enum Biome {
  Desert,
  Sea,
  River,
  Lake,
  Valley,
  Swamp,
  Foreshore,
}

export interface IRoom {
  id: string
  name: string

  // 낚시터 경영 정보
  ownerId: ObjectId
  exp: number
  fee: number
  clean: number
  landPrice: number
  buildings: string[]

  // 낚시터 상태
  season: Season
  biome: Biome

  // 데이터 생성일
  createdAt: Date
  updatedAt: Date

  // Virtual Fields
  minPrices: number
}

export interface IRoomMethods {
  getEffects(): StatEffect
}

export type RoomDoc = HydratedDocument<IRoom, {}, IRoomMethods>
