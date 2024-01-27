import { Extension, applicationCommand, option } from '@pikokr/command.ts'
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionsBitField,
  inlineCode,
} from 'discord.js'

class EtcExtension extends Extension {
  @applicationCommand({
    name: 'delete',
    nameLocalizations: {
      ko: '지워',
    },
    type: ApplicationCommandType.ChatInput,
    description: '최신 메시지를 개수만큼 지워요!',
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
    if (!i.channel || i.channel.isDMBased() || !i.guild?.members.me) return

    // 권한 체크 (이프가 메시지 관리하기 이상의 권한을 가지고 있어야 함)
    if (
      !i.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return i.reply({
        content:
          '이프한테 그럴 권한이 없잖아요!\n' +
          inlineCode('❗ 이프에게 메시지 관리하기 권한을 주세요'),
        ephemeral: true,
      })
    }

    // 권한 체크 (유저가 메시지 관리하기 이상의 권한을 가지고 있어야 함)
    if (!i.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages)) {
      return i.reply({
        content: '이프한테 그런 잡일을 시키기 위한 권한이 부족해요!',
        ephemeral: true,
      })
    }

    if (count > 100) {
      return i.reply({
        content: '과로시키지 말아주세요!',
        ephemeral: true,
      })
    }

    if (count < 0) {
      return i.reply({
        content: '?!',
        ephemeral: true,
      })
    }

    const messages = await i.channel.messages.fetch({ limit: count })
    await i.channel.bulkDelete(messages)

    const embed = new EmbedBuilder()
      .setTitle(`🧽 쓱싹쓱싹... ${count}개의 메시지를 삭제했어요!`)
      .setColor(Colors.Blue)
      .setFooter({
        iconURL: this.client.user?.displayAvatarURL(),
        text: '...근데 저는 낚시하는 봇인데요???',
      })
    await i.reply({ embeds: [embed], ephemeral: true })
  }
}

export const setup = async () => {
  return new EtcExtension()
}
