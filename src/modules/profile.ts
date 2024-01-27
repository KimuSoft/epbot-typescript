import * as profileServices from '../services/profile'
import { Extension, applicationCommand, option } from '@pikokr/command.ts'
import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from 'discord.js'

class ProfileExtension extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'profile',
    nameLocalizations: { ko: '프로필' },
    description: '해당 유저의 프로필을 볼 수 있어요!',
  })
  async ranking(
    i: ChatInputCommandInteraction,
    @option({
      name: 'user',
      name_localizations: { ko: '사용자' },
      description: '누구의 프로필이 궁금하신가요?',
      type: ApplicationCommandOptionType.User,
    })
    userId: string
  ) {
    const profile = await profileServices.getProfile(userId || i.user.id)
    if (!profile) return i.reply('누구인지 모르겠는데요...?')

    const profileMsgs = [
      `- \`💰 소지금\`   ${profile.money.toLocaleString()}원`,
      `- \`💲 총 자산\`   ${profile.totalPrice.toLocaleString()}원`,
      `- \`⭐ 레벨\`   Lv. ${
        profile.level
      } \`(✨ ${profile.exp.toLocaleString()} EXP)\``,
      ...(profile.roomCount
        ? [`- \`🎣 매입한 낚시터\`   ${profile.roomCount}곳`]
        : []),
      ...(profile.highestRoom
        ? [`- \`🏠 가장 높은 땅값\`   💰 ${profile.highestRoom.name}`]
        : []),
    ]

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${profile.username}님의 프로필`,
        iconURL: i.user.displayAvatarURL(),
      })
      .setDescription(profileMsgs.join('\n'))
      .setColor(Colors.Blue)
      .setTimestamp()

    await i.reply({ embeds: [embed] })
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'money',
    nameLocalizations: { ko: '돈' },
    description: '자신의 보유금 정보를 확인할 수 있어요!',
  })
  async money(i: ChatInputCommandInteraction) {
    const epUser = await i.user.epUser

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${epUser.username}님의 보유금`,
        iconURL: i.user.displayAvatarURL(),
      })
      .setColor(Colors.Gold)
      .setDescription(`💰 **${epUser.money.toLocaleString()}**`)
      .setFooter({ text: '물고기를 낚아 더 많은 이프머니를 모아봐요!' })
      .setTimestamp()

    await i.reply({ embeds: [embed] })
  }
}

export function setup() {
  return new ProfileExtension()
}
