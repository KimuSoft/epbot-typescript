import { getSeasonIcon, getSeasonName } from '../../constants'
import { getRoomInfo } from '../../services/room/info'
import { removeEmojis } from '../../utils/demojify'
import { roomGroup } from './index'
import { Extension } from '@pikokr/command.ts'
import dedent from 'dedent'
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  codeBlock,
} from 'discord.js'

class RoomInfoExtension extends Extension {
  @roomGroup.command({
    name: 'info',
    nameLocalizations: { ko: '정보' },
    description: '이 채널의 낚시터 정보를 보여줘요!',
    dmPermission: false,
  })
  async info(i: ChatInputCommandInteraction) {
    if (!i.channel || i.channel.isDMBased()) return

    const room = await i.channel.epRoom
    const { roomThumbnail, effects } = await getRoomInfo(
      room,
      this.client,
      i.guild || undefined
    )

    const embed = new EmbedBuilder()
      .setTitle(`ℹ️  ' ${removeEmojis(room.name)} ' 낚시터 정보`)
      .setDescription(
        dedent`
        - \`계절\`   ${getSeasonIcon(room.season)} ${getSeasonName(room.season)}
        - \`주인\`   ${
          room.ownerId ? `👑 <@${room.ownerId}>` : '공영 낚시터 **(매입 가능)**'
        }
        - \`수질\`   **2급수**  \`(🧹 ${room.clean.toLocaleString()})\`
        - \`땅값\`   💰 ${room.landPrice.toLocaleString()}
        (\`최소 매입 금액: 💰 ${room.getMinPrices().toLocaleString()}\`)
        - \`수수료\`   💸 **${
          room.fee + effects.maintenance
        }%**  \`(유지 수수료 ${effects.maintenance.toLocaleString()}% 포함)\`
      `
      )
      .addFields([
        {
          name: '🧾 낚시터 시설 효과',
          value: codeBlock(
            'diff',
            '- 유지 수수료 10% 증가\n+ 희귀한 물고기가 낚일지도...?'
          ),
        },
      ])
      .setColor(Colors.Blue)
      .setThumbnail(roomThumbnail)
      .setFooter({
        text: "시설 정보 확인: '/낚시터 시설'  •  물고기 서식 정보: '/낚시터 분석'",
      })
      .setTimestamp()

    await i.reply({ embeds: [embed] })
  }
}

export const setup = async () => {
  return new RoomInfoExtension()
}
