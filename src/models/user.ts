import { RoomDoc } from '../types/room'
import { IUser, IUserMethods, UserDoc, UserModel } from '../types/user'
import { Room } from './room'
import { Schema, model } from 'mongoose'

const userSchema = new Schema<IUser, IUserMethods>(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    money: { type: Number, required: true, default: 0 },
    exp: { type: Number, required: true, default: 0 },

    // 유저 경고 횟수
    warning: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

userSchema.methods.getUserOwnedRooms = async function (
  this: UserDoc
): Promise<UserDoc[]> {
  return Room.find({ ownerId: this._id })
}

userSchema.methods.getLevels = function (this: UserDoc): number {
  return Math.floor((this.exp / 15) ** 0.5 + 1)
}

export const User = model<IUser, UserModel>('users', userSchema)
