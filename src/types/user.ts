import { RoomDoc } from './room'
import { HydratedDocument, Model } from 'mongoose'

export interface IUser {
  id: string
  username: string
  money: number
  exp: number

  // 유저 경고 횟수
  warning: number

  createdAt: Date
  updatedAt: Date
}

export interface IUserMethods {
  getUserOwnedRooms(): Promise<RoomDoc[]>
  getLevels(): number
}

export type UserModel = Model<IUser, {}, IUserMethods>

export type UserDoc = HydratedDocument<IUser, IUserMethods>
