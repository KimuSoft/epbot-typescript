import { User } from '../models/user'

export const getProfile = async (userId: string) => {
  const user = await User.findOne({ id: userId })
  if (!user) return null

  const rooms = await user.getUserOwnedRooms()
  const totalPrice = rooms.reduce((acc, cur) => acc + cur.landPrice, 0)
  const highestRoom = rooms.sort((a, b) => b.landPrice - a.landPrice)[0]

  return {
    username: user.username,
    money: user.money,
    exp: user.exp,
    level: user.getLevels(),
    rooms,
    totalPrice,
    highestRoom,
    roomCount: rooms.length,
  }
}
