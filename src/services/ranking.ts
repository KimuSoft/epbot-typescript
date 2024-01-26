import { Room } from '../models/room'
import { User } from '../models/user'
import { SelectMenuComponentOptionData } from 'discord.js'

export const getMoneyRanking = async (
  limit = 20
): Promise<SelectMenuComponentOptionData[]> => {
  const rankingUsers = await User.find({}).sort({ money: -1 }).limit(limit)

  return rankingUsers.map((user, index) => ({
    label: `${index + 1}위: ${user.username}`,
    value: user.id,
    emoji: '💰',
  }))
}

export const getExpensiveLandRanking = async (
  limit = 20
): Promise<SelectMenuComponentOptionData[]> => {
  const rankingRooms = await Room.find({}).sort({ price: -1 }).limit(limit)

  return rankingRooms.map((room, index) => ({
    label: `${index + 1}위: ${room.name}`,
    value: room.id,
    emoji: '🏞️',
  }))
}

export const getExpRanking = async (
  limit = 20
): Promise<SelectMenuComponentOptionData[]> => {
  const rankingUsers = await User.find({}).sort({ exp: -1 }).limit(limit)

  return rankingUsers.map((user, index) => ({
    label: `${index + 1}위: ${user.username}`,
    value: user.id,
    emoji: '🌟',
  }))
}
