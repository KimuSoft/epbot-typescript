// 낚시터 매입
import { RoomDoc } from '../../types/room'
import { UserDoc } from '../../types/user'

export enum BuyRoomError {
  // 최소 매입 금액 미달
  MINIMUM_PRICE_NOT_MET = 1,

  // 돈 부족
  NOT_ENOUGH_MONEY,

  // 매입 불가능한 낚시터 (공영 낚시터)
  NOT_BUYABLE_ROOM,
}

export const buyRoom = async (room: RoomDoc, user: UserDoc, value: number) => {
  const minPrice = room.getMinPrices()
  const originOwner = await room.getOwner()

  if (user.money < value) return { error: BuyRoomError.NOT_ENOUGH_MONEY }
  // if (room.isPublic) return {error: BuyRoomError.NOT_BUYABLE_ROOM}

  if (value < minPrice) return { error: BuyRoomError.MINIMUM_PRICE_NOT_MET }

  await room.updateOne({ ownerId: user.id })
  user.money -= minPrice
  await user.save()

  return { error: null }
}
