import { getBiomeName } from '../../constants'
import { Biome } from '../../types/room'
import { roomGroup } from './index'
import { Extension, option } from '@pikokr/command.ts'
import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from 'discord.js'

const biomeCategories: APIApplicationCommandOptionChoice<number>[] = [
  { name: getBiomeName(Biome.Sea), value: Biome.Sea },
  { name: getBiomeName(Biome.River), value: Biome.River },
  { name: getBiomeName(Biome.Lake), value: Biome.Lake },
  { name: getBiomeName(Biome.Valley), value: Biome.Valley },
  { name: getBiomeName(Biome.Swamp), value: Biome.Swamp },
  { name: getBiomeName(Biome.Foreshore), value: Biome.Foreshore },
  { name: getBiomeName(Biome.Desert), value: Biome.Desert },
]

class ChangeBiomeExtension extends Extension {
  @roomGroup.command({
    name: 'change_biome',
    nameLocalizations: { ko: '지형변경' },
    description: '낚시터의 지형을 변경할 수 있어!',
    dmPermission: false,
  })
  async buy(
    i: ChatInputCommandInteraction,
    @option({
      name: 'biome',
      name_localizations: { ko: '지형' },
      description: '어떤 지형으로 변경할 건가요?',
      type: ApplicationCommandOptionType.Integer,
      choices: biomeCategories,
      required: true,
    })
    biome: Biome
  ) {
    if (!i.channel || i.channel.isDMBased()) return
    await i.deferReply()

    const room = await i.channel.epRoom
    const originBiome = room.biome

    if (originBiome === biome) {
      return i.editReply('이미 이 낚시터의 지형이에요!')
    }

    room.biome = biome
    await room.save()

    const embed = new EmbedBuilder()
      .setTitle(`🏞️  ' ${room.name} ' 낚시터 지형 변경`)
      .setDescription(
        [
          `- \`지형\`   ${getBiomeName(originBiome)} → ${getBiomeName(biome)}`,
          `- \`지형 조성 비용\`   💰 ${(99999).toLocaleString()}`,
        ].join('\n')
      )
      .setColor(Colors.Blue)
      .setTimestamp()

    await i.editReply({ embeds: [embed] })
  }
}

export const setup = async () => {
  return new ChangeBiomeExtension()
}
