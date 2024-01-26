import { StatEffect } from './types'
import { IUser, IUserMethods, UserDoc } from './user'
import { HydratedDocument, Model, ObjectId } from 'mongoose'

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
  ownerId?: ObjectId
  exp: number
  fame: number
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
}

export interface IRoomMethods {
  getEffects(): StatEffect
  // 매입 최소 입찰 금액
  getMinPrices(): number
  // 낚시터 소유자
  getOwner(): Promise<UserDoc | null>
}

export type RoomModel = Model<IRoom, {}, IRoomMethods>

export type RoomDoc = HydratedDocument<IRoom, IRoomMethods>
