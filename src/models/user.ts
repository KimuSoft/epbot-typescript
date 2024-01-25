import { RoomDoc } from '../types/room'
import { IUser, IUserMethods } from '../types/user'
import { Room } from './room'
import { Schema, model } from 'mongoose'

const userSchema = new Schema<IUser, IUserMethods>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    money: { type: Number, required: true },
    exp: { type: Number, required: true },

    // 유저 경고 횟수
    warning: { type: Number, required: true },
  },
  { timestamps: true }
)

userSchema.methods.getUserOwnedRooms = async function (
  this: RoomDoc
): Promise<RoomDoc[]> {
  return Room.find({ ownerId: this._id })
}

export const User = model<IUser>('users', userSchema)
