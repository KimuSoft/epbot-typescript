import { Room } from '../../models/room'
import { Biome, RoomDoc } from '../../types/room'
import * as Discord from 'discord.js'
import { sample } from 'lodash'

declare module 'discord.js' {
  interface TextBasedChannels {
    get epRoom(): Promise<RoomDoc>
  }

  interface GuildTextBasedChannels {
    get epRoom(): Promise<RoomDoc>
  }

  interface TextChannel {
    get epRoom(): Promise<RoomDoc>
  }

  interface DMChannel {
    get epRoom(): Promise<RoomDoc>
  }

  interface NewsChannel {
    get epRoom(): Promise<RoomDoc>
  }

  interface StageChannel {
    get epRoom(): Promise<RoomDoc>
  }

  interface PrivateThreadChannel {
    get epRoom(): Promise<RoomDoc>
  }

  interface PublicThreadChannel {
    get epRoom(): Promise<RoomDoc>
  }

  interface VoiceChannel {
    get epRoom(): Promise<RoomDoc>
  }
}

const epRoomAttributes = {
  async get(this: Discord.TextChannel) {
    let room = await Room.findOne({ id: this.id })
    if (!room) {
      room = new Room({ id: this.id })

      if (/바[다닷]|해변|🌊/.test(this.name)) room.biome = Biome.Sea
      else if (/강|/.test(this.name)) room.biome = Biome.River
      else if (/호[수숫]/.test(this.name)) room.biome = Biome.Lake
      else if (/계곡/.test(this.name)) room.biome = Biome.Valley
      else if (/늪|습지/.test(this.name)) room.biome = Biome.Swamp
      else if (/[갯뻘]/.test(this.name)) room.biome = Biome.Foreshore
      else if (/메마[른르]|사막/.test(this.name)) room.biome = Biome.Desert
      else room.biome = sample([Biome.Sea, Biome.River, Biome.Lake])!
    }

    if (room.name !== this.name) {
      room.name = this.name
      await room.save()
    }

    return room
  },
}

Object.defineProperty(Discord.TextChannel.prototype, 'epRoom', epRoomAttributes)
Object.defineProperty(Discord.DMChannel.prototype, 'epRoom', epRoomAttributes)
Object.defineProperty(Discord.NewsChannel.prototype, 'epRoom', epRoomAttributes)
Object.defineProperty(
  Discord.StageChannel.prototype,
  'epRoom',
  epRoomAttributes
)
Object.defineProperty(
  Discord.ThreadChannel.prototype,
  'epRoom',
  epRoomAttributes
)
Object.defineProperty(
  Discord.VoiceChannel.prototype,
  'epRoom',
  epRoomAttributes
)
