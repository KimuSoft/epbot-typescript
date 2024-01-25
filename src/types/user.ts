import { RoomDoc } from './room'
import { HydratedDocument } from 'mongoose'

export interface IUser {
  id: string
  name: string
  money: number
  exp: number

  // 유저 경고 횟수
  warning: number

  createdAt: Date
  updatedAt: Date
}

export interface IUserMethods {
  getUserOwnedRooms(): Promise<RoomDoc[]>
}

export type UserDoc = HydratedDocument<IUser, {}, IUserMethods>
