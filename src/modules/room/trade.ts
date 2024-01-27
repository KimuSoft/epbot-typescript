import { SELL_FEE } from '../../constants'
import { TradeRoomError, buyRoom, sellRoom } from '../../services/room/trade'
import { removeEmojis } from '../../utils/demojify'
import { roomGroup } from './index'
import { Extension, listener, option } from '@pikokr/command.ts'
import dedent from 'dedent'
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  Interaction,
  inlineCode,
} from 'discord.js'

class TradeExtension extends Extension {
  @roomGroup.command({
    name: 'buy',
    nameLocalizations: { ko: '매입' },
    description: '이 채널의 낚시터를 매입할 수 있어요!',
    dmPermission: false,
  })
  async buy(
    i: ChatInputCommandInteraction,
    @option({
      name: 'value',
      name_localizations: { ko: '금액' },
      description: '매입할 금액을 입력해주세요! (미입력 시 최소매입금액)',
      type: ApplicationCommandOptionType.Integer,
    })
    value_?: number
  ) {
    if (!i.channel || i.channel.isDMBased()) return
    await i.deferReply()

    const room = await i.channel.epRoom
    const user = await i.user.epUser

    const { error, lack, minPrice, value } = await buyRoom(room, user, value_)

    if (error) {
      switch (error) {
        case TradeRoomError.ALREADY_OWNED_ROOM:
          return i.editReply(
            '이미 이 낚시터의 주인이에요!\n' +
              inlineCode(
                `❔ 낚시터의 땅값을 바꾸고 싶다면 '/낚시터 땅값변경' 명령어를 사용해 보세요.`
              )
          )

        case TradeRoomError.NOT_ENOUGH_MONEY:
          return i.editReply(
            '돈이 부족해요!\n' +
              inlineCode(
                `❗ 현재 보유금은 💰 ${user.money.toLocaleString()}원이고, 💰 ${lack.toLocaleString()}원이 더 필요해요!`
              )
          )
        case TradeRoomError.MINIMUM_PRICE_NOT_MET:
          return i.editReply(
            '최소 매입 금액을 충족하지 못해요!\n' +
              inlineCode(
                `❗ 이 낚시터를 매입하기 위해서는 최소 💰 ${minPrice.toLocaleString()}원이 필요해요!`
              )
          )
        case TradeRoomError.NOT_BUYABLE_ROOM:
          return i.editReply('이 낚시터는 매입할 수 없어요!')
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(`ℹ️  ' ${removeEmojis(room.name)} ' 낚시터를 매입했어요!`)
      .setDescription(
        dedent`
          - \`매입자\`  👑 <@${user.id}>
          - \`매입가\`   💰 ${value.toLocaleString()}
          - \`매입수수료\`   💸 5%
          - \`남은 돈\`   💰 ${(user.money - value).toLocaleString()}원
        `
      )
      .setColor(Colors.Blue)
      .setTimestamp()

    await i.editReply({ embeds: [embed] })
  }

  @roomGroup.command({
    name: 'sell',
    nameLocalizations: { ko: '매각' },
    description: '낚시터를 매각할 수 있어요!',
    dmPermission: false,
  })
  async sell(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.String,
      name: 'search_room',
      name_localizations: { ko: '검색' },
      description:
        '매각할 낚시터를 검색할 수 있어요! (미입력 시 이 낚시터를 매각해요!)',
      autocomplete: true,
    })
    roomId?: string
  ) {
    const epUser = await i.user.epUser
    const { error, room, fee, landPrice } = await sellRoom(
      roomId || i.channelId,
      epUser
    )

    if (error) {
      switch (error) {
        case TradeRoomError.NOT_EXIST_ROOM:
          return i.reply('존재하지 않는 낚시터에요!')
        case TradeRoomError.NOT_OWNED_ROOM:
          return i.reply('이 낚시터의 주인이 아니에요!')
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `ℹ️  ' ${removeEmojis(room?.name || '')} ' 낚시터를 매각했어요!`
      )
      .setDescription(
        dedent`
          - \`매각자\`  👑 <@${epUser.id}> 
          - \`매각가\`   💰 ${landPrice?.toLocaleString()} \`(수수료 💰 ${fee} 포함)\`
          - \`매각수수료\`   💸 ${SELL_FEE}%
          - \`보유금\`   💰 ${(
            epUser.money + (landPrice || 0)
          ).toLocaleString()}원
        `
      )
      .setColor(Colors.Blue)
      .setTimestamp()

    await i.reply({ embeds: [embed] })
  }

  @listener({ event: 'interactionCreate' })
  async interactionCreate(i: Interaction) {
    if (!i.isAutocomplete()) return

    const focused = i.options.getFocused(true)
    if (focused.name !== 'search_room') return

    const epUser = await i.user.epUser
    const rooms = await epUser.getUserOwnedRooms()

    const options = rooms.map((room) => ({
      name: `${room.name} (💰 ${room.landPrice.toLocaleString()}원)`,
      value: room.id,
    }))

    await i.respond(options)
  }
}

export const setup = async () => {
  return new TradeExtension()
}
