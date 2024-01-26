import * as rankingServices from '../services/ranking'
import { Extension, applicationCommand, option } from '@pikokr/command.ts'
import {
  APIApplicationCommandOptionChoice,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'

enum RankingCategory {
  Money = 'money',
  ExpensiveLand = 'expensive_land',
  Exp = 'exp',
}

const rankingCategories: APIApplicationCommandOptionChoice<string>[] = [
  { name: '🪙 이프머니가 많은 순위 TOP 20', value: RankingCategory.Money },
  {
    name: '🏞️ 가장 땅값이 높은 낚시터 TOP 20',
    value: RankingCategory.ExpensiveLand,
  },
  { name: '🌟 가장 명성이 높은 낚시터 TOP 20', value: RankingCategory.Exp },
]

class RankingExtension extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'ranking',
    nameLocalizations: { ko: '순위' },
    description: '이프와 관련된 여러 가지 순위을 확인할 수 있어요!',
  })
  async ranking(
    i: ChatInputCommandInteraction,
    @option({
      name: 'category',
      name_localizations: { ko: '주제' },
      description: '어떤 순위가 궁금하신가요?',
      type: ApplicationCommandOptionType.String,
      choices: rankingCategories,
      required: true,
    })
    category: RankingCategory
  ) {
    await i.deferReply()

    const categoryName =
      rankingCategories.find((c) => c.value === category)?.name ??
      '알 수 없는 카테고리'

    const select = new StringSelectMenuBuilder()
      .setCustomId('ignore')
      .setPlaceholder(categoryName)

    switch (category) {
      case RankingCategory.Money: {
        select.addOptions(await rankingServices.getMoneyRanking(20))
        break
      }

      case RankingCategory.ExpensiveLand: {
        select.addOptions(await rankingServices.getExpensiveLandRanking(20))
        break
      }

      case RankingCategory.Exp: {
        select.addOptions(await rankingServices.getExpRanking(20))
        break
      }
    }

    await i.editReply({
      embeds: [new EmbedBuilder().setTitle(categoryName).setTimestamp()],
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          select
        ),
      ],
    })
  }
}

export function setup() {
  return new RankingExtension()
}
