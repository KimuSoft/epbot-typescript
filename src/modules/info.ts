import { Extension, applicationCommand, listener } from '@pikokr/command.ts'
import dedent from 'dedent'
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  inlineCode,
} from 'discord.js'

class InfoExtension extends Extension {
  @applicationCommand({
    name: 'ping',
    nameLocalizations: {
      ko: '핑',
    },
    type: ApplicationCommandType.ChatInput,
    description: '이프의 현재 반응속도를 알려줘요!',
  })
  async ping(i: ChatInputCommandInteraction) {
    const before = Date.now()
    const ping = i.client.ws.ping

    await i.reply(
      dedent`퐁! 🏓
      - 지연 시간: \`⏲️ ${ping}ms\`
      - 실제 지연: \`계산 중...\``
    )

    const after = Date.now()

    await i.editReply(
      dedent`퐁! 🏓
      - 지연 시간: \`⏲️ ${ping}ms\`
      - 실제 지연: \`⏲️ ${after - before}ms\``
    )
  }

  @applicationCommand({
    name: 'info',
    nameLocalizations: {
      ko: '정보',
    },
    type: ApplicationCommandType.ChatInput,
    description: '현재 이프의 정보를 알려줘요!',
  })
  async information(i: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('커여운 낚시 장인 이프!')
      .setColor(Colors.Blue)
      .setThumbnail(i.client.user.displayAvatarURL())
      .setDescription(
        dedent`
        - [이프 오픈소스 저장소](https://github.com/KimuSoft/epbot-origin)에 참여해 주세요!
        - [키뮤스토리 공식 디스코드](https://discord.gg/XQuexpQ)에 들러주세요!
        `
      )
      .addFields([
        {
          name: '개발ㆍ운영 - 키뮤소프트',
          value:
            '**메인 개발**: 키뮤(kimu\\_latilus), 코로(hollume), 파링(pariring), 먀스(mas05\\_), 코이(koi3125)\n**참여자**: starcea, kurur.ing, rho_theta',
        },
      ])
      .setFooter({ text: `현재 이프 버전: ${process.env.npm_package_version}` })
      .setTimestamp()

    await i.reply({ embeds: [embed] })
  }
}

export const setup = async () => {
  return new InfoExtension()
}
