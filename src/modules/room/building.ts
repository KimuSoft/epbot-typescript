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

class BuildingExtension extends Extension {
  @roomGroup.command({
    name: 'buildings',
    nameLocalizations: { ko: '시설' },
    description:
      '이 낚시터의 시설을 조회할 수 있어요! (관리자는 시설 철거도 가능)',
    dmPermission: false,
  })
  async buildings(i: ChatInputCommandInteraction) {
    if (!i.channel || i.channel.isDMBased()) return
  }

  @roomGroup.command({
    name: 'build',
    nameLocalizations: { ko: '시설건설' },
    description: '이 낚시터에 시설을 건설할 수 있어요!',
    dmPermission: false,
  })
  async info(i: ChatInputCommandInteraction) {
    if (!i.channel || i.channel.isDMBased()) return
  }
}

export const setup = async () => {
  return new BuildingExtension()
}
