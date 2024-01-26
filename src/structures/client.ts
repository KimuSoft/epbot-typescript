import { config } from '../config'
import './extensions/channel'
import './extensions/user'
import {
  CommandClient,
  Extension,
  applicationCommand,
  ownerOnly,
} from '@pikokr/command.ts'
import { ApplicationCommandType, ChatInputCommandInteraction } from 'discord.js'
import { Client as DokdoClient } from 'dokdo'
import path from 'path'

class DevModule extends Extension {
  @ownerOnly
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: 'reload',
    nameLocalizations: { ko: '다시시작' },
    description: 'reload modules',
  })
  async reload(i: ChatInputCommandInteraction) {
    await i.deferReply()
    const result = await this.commandClient.registry.reloadModules()
    await i.editReply(
      `Succeed: ${result.filter((x) => x.result).length} Error: ${
        result.filter((x) => !x.result).length
      }`
    )
  }
}

export class CustomizedCommandClient extends CommandClient {
  dokdo: DokdoClient | null = null

  async setup() {
    await this.enableApplicationCommandsExtension({ guilds: config.guilds })
    await this.registry.registerModule(new DevModule())

    await this.registry.loadAllModulesInDirectory(
      path.join(__dirname, '..', 'modules'),
      /^((?!index\.[tj]s).)*$/
    )
  }

  async onReady() {
    this.dokdo = new DokdoClient(this.discord, {
      owners: [],
      isOwner: (user) => this.owners.has(user.id),
      prefix: `${this.discord.user} `,
    })

    this.discord.on('messageCreate', (message) => {
      this.dokdo?.run(message)
    })
  }
}
