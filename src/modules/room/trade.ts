import { BuyRoomError, buyRoom } from '../../services/room/trade'
import { removeEmojis } from '../../utils/demojify'
import { roomGroup } from './index'
import { Extension, option } from '@pikokr/command.ts'
import dedent from 'dedent'
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
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
      description: '매입할 금액을 입력해주세요!',
      type: ApplicationCommandOptionType.Integer,
    })
    value: number
  ) {
    if (!i.channel || i.channel.isDMBased()) return
    await i.deferReply()

    const room = await i.channel.epRoom
    const user = await i.user.epUser

    const { error } = await buyRoom(room, user, 1000000)

    if (error) {
      switch (error) {
        case BuyRoomError.NOT_ENOUGH_MONEY:
          return i.editReply(
            '돈이 부족해요!\n' +
              inlineCode(
                `❗ 현재 보유금은 💰 ${user.money.toLocaleString()}원이고, ${(
                  value - user.money
                ).toLocaleString()}원이 더 필요해요!`
              )
          )
        case BuyRoomError.MINIMUM_PRICE_NOT_MET:
          return i.editReply('최소 매입 금액을 충족하지 못해요!')
        case BuyRoomError.NOT_BUYABLE_ROOM:
          return i.editReply('이 낚시터는 매입할 수 없어요!')
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(`ℹ️  ' ${removeEmojis(room.name)} ' 낚시터를 매입했어요!`)
      .setDescription(
        dedent`
          - \`매입자\`  👑 <@${user.id}>
          - \`매입가\`   💰 ${room.landPrice.toLocaleString()}
          - \`매입수수료\`   💸 ${room.fee.toLocaleString()}%
        `
      )

    await i.editReply({ embeds: [embed] })
  }
}

export const setup = async () => {
  return new TradeExtension()
}
