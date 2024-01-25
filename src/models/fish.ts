import mongoose, { Schema, model } from 'mongoose'

interface IFish {
  id: string
  fishId: string
  roomId: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId

  // 물고기 성능
  length: number
  price: number

  // 데이터 정보
  createdAt: Date
  updatedAt: Date
}

const fishSchema = new Schema<IFish>(
  {
    id: { type: String, required: true },
    fishId: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },

    length: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
)

export const Fish = model<IFish>('fishes', fishSchema)
