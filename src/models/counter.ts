import mongoose, { Schema, model } from 'mongoose'

interface ICounter {
  userId: mongoose.Schema.Types.ObjectId
}

const counterSchema = new Schema<ICounter>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
})

export const Counter = model<ICounter>('counters', counterSchema)
