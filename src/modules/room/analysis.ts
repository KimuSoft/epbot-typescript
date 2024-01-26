import { getRoomAnalysis } from '../../services/room/analysis'
import { roomGroup } from './index'
import { Extension } from '@pikokr/command.ts'
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  codeBlock,
  inlineCode,
} from 'discord.js'

class RoomInfoExtension extends Extension {
  @roomGroup.command({
    name: 'analysis',
    nameLocalizations: { ko: '분석' },
    description: '이 낚시터의 물고기 분포를 보여줘요!',
    dmPermission: false,
  })
  async info(i: ChatInputCommandInteraction) {
    if (!i.channel || i.channel.isDMBased()) return

    const room = await i.channel.epRoom
    const { graph, effects, allFish, percentage } = await getRoomAnalysis(room)

    const analysisStrs = [
      ...(Math.floor(effects.trashSample)
        ? [`[쓰레기] ${effects.trashSample}개 (${percentage.trash}%)`]
        : []),
      ...(Math.floor(effects.commonSample)
        ? [`[일반] ${effects.commonSample}마리 (${percentage.common}%)`]
        : []),
      ...(Math.floor(effects.rareSample)
        ? [`[희귀] ${effects.rareSample}마리 (${percentage.rare}%)`]
        : []),
      ...(Math.floor(effects.epicSample)
        ? [`[매우 희귀] ${effects.epicSample}마리 (${percentage.epic}%)`]
        : []),
      ...(Math.floor(effects.legendarySample)
        ? [`[전설] ${effects.legendarySample}마리 (${percentage.legendary}%)`]
        : []),
      ...(Math.floor(effects.mythicSample)
        ? [`[환상] ${effects.mythicSample}마리 (${percentage.mythic}%)`]
        : []),
    ]

    const embed = new EmbedBuilder()
      .setTitle(`📊  이프물고기관리청 조사 결과`)
      .setDescription(inlineCode(graph))
      .addFields([
        {
          name: `🐟 여기서 ${allFish}마리의 물고기를 낚으면?`,
          value: codeBlock('css', analysisStrs.join('\n')),
        },
      ])
      .setColor(Colors.Blue)
      .setTimestamp()

    await i.reply({ embeds: [embed] })
  }
}

export const setup = async () => {
  return new RoomInfoExtension()
}
