import { Extension, applicationCommand, option } from '@pikokr/command.ts'
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
} from 'discord.js'

class DexExtension extends Extension {
  @applicationCommand({
    name: 'dex',
    nameLocalizations: {
      ko: '도감',
    },
    type: ApplicationCommandType.ChatInput,
    description: '낚았던 물고기를 검색할 수 있어요!',
    dmPermission: false,
  })
  async information(
    i: ChatInputCommandInteraction,
    @option({
      name: 'count',
      name_localizations: { ko: '개수' },
      description: '지울 메시지 개수 (기본값: 5)',
      type: ApplicationCommandOptionType.Integer,
    })
    count = 5
  ) {
    return i.reply({
      content: '준비중입니다!',
      ephemeral: true,
    })
  }
}

export const setup = async () => {
  return new DexExtension()
}
