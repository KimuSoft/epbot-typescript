// 낚시터 매입
import { SELL_FEE } from '../../constants'
import { Room } from '../../models/room'
import { RoomDoc } from '../../types/room'
import { UserDoc } from '../../types/user'

export enum TradeRoomError {
  // 최소 매입 금액 미달
  MINIMUM_PRICE_NOT_MET = 1,

  // 돈 부족
  NOT_ENOUGH_MONEY,

  // 매입 불가능한 낚시터 (공영 낚시터)
  NOT_BUYABLE_ROOM,

  // 존재하지 않는 낚시터
  NOT_EXIST_ROOM,

  // 자신의 땅이 아님 (권한 부족)
  NOT_OWNED_ROOM,

  // 이미 자신이 주인임
  ALREADY_OWNED_ROOM,
}

export const buyRoom = async (room: RoomDoc, user: UserDoc, value?: number) => {
  const minPrice = room.getMinPrices()
  const originOwner = await room.getOwner()
  if (!value) value = minPrice

  const resultData = {
    error: null as TradeRoomError | null,
    originOwner: originOwner,
    minPrice: minPrice,
    value: value,
    lack: value - user.money,
  }

  // 이미 자신이 주인임
  if (originOwner?._id.toString() === user._id.toString()) {
    return { ...resultData, error: TradeRoomError.ALREADY_OWNED_ROOM }
  }

  if (user.money < value)
    return { ...resultData, error: TradeRoomError.NOT_ENOUGH_MONEY }

  // if (room.isPublic) return {error: BuyRoomError.NOT_BUYABLE_ROOM}

  if (value < minPrice)
    return { ...resultData, error: TradeRoomError.MINIMUM_PRICE_NOT_MET }

  // 기존 주인이 있을 경우 돈을 돌려 줌 (강제매각이므로 5%의 수수료를 받음)
  if (originOwner) {
    originOwner.money += Math.floor(value)
    await originOwner.save()
  }

  room.landPrice = value
  room.ownerId = user._id
  await room.save()

  user.money -= minPrice
  await user.save()

  return resultData
}

export const sellRoom = async (roomId: string, user: UserDoc) => {
  const room = await Room.findOne({ id: roomId })
  if (!room) return { error: TradeRoomError.NOT_EXIST_ROOM }

  // 낚시터 주인인지 확인
  if (user._id.toString() !== room.ownerId?.toString()) {
    return { error: TradeRoomError.NOT_OWNED_ROOM }
  }

  const fee = room.landPrice * SELL_FEE
  const landPrice = room.landPrice - fee

  // 돈을 돌려줌
  user.money += landPrice
  await user.save()

  // 낚시터 주인과 땅값을 리셋함
  room.ownerId = undefined
  room.landPrice = 0
  await room.save()

  return {
    error: null,
    room,
    landPrice,
    fee,
  }
}
