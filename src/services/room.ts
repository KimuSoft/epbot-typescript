// 모든 채널의 Season을 하나씩 옮김
import { Room } from '../models/room'

export const moveSeason = async () => {
  await Room.updateMany({}, { $inc: { season: 1 } })
  await Room.updateMany({ season: { $gt: 4 } }, { $set: { season: 1 } })
}
