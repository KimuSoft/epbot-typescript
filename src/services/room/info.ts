import { User as EpUser } from '../../models/user'
import { RoomDoc } from '../../types/room'
import { UserDoc } from '../../types/user'
import { Client, Guild, User } from 'discord.js'

export const getRoomInfo = async (
  room: RoomDoc,
  client: Client,
  guild?: Guild
) => {
  let roomOwnerEpUser: UserDoc | null = null
  let roomOwner: User | null = null
  if (room.ownerId) {
    roomOwnerEpUser = await EpUser.findOne({ _id: room.ownerId })
    if (!roomOwnerEpUser) throw new Error('Room owner not found')

    roomOwner = room.ownerId
      ? await client.users.fetch(roomOwnerEpUser.id)
      : null
  }

  const roomThumbnail = roomOwner
    ? roomOwner.displayAvatarURL()
    : guild?.iconURL() || null

  const effects = room.getEffects()

  return {
    room,
    roomOwner,
    roomOwnerEpUser,
    roomThumbnail,
    effects,
  }
}
