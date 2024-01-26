import { syncFish } from '../services/fish'
import { Extension, listener } from '@pikokr/command.ts'
import { ChatInputCommandInteraction, Interaction, codeBlock } from 'discord.js'

class EventExtension extends Extension {
  @listener({ event: 'ready' })
  async ready() {
    this.logger.info('이프 켜졌당 >ㅅ<')
    this.logger.info(`Logged in as ${this.client.user?.tag}`)

    // 관리자 목록 로드
    this.logger.info('Loading owners...')
    await this.commandClient.fetchOwners()

    // 물고기 정보 동기화
    this.logger.info('Syncing fish...')
    await syncFish()

    this.logger.info('Ready!')
  }

  @listener({ event: 'applicationCommandInvokeError', emitter: 'cts' })
  async errorHandler(err: Error, i: Interaction) {
    console.error(err)

    if (!i.isChatInputCommand()) return

    const errMsg =
      '**펑!** 오류가 발생했어요! 개발자에게 문의해주세요.' +
      codeBlock('cs', '🚫 ' + err.message)

    if (i.deferred || i.replied) {
      await i.editReply({ content: errMsg })
    } else {
      await i.reply({ content: errMsg })
    }
  }

  @listener({ event: 'interactionCreate' })
  async interactionCreate(i: ChatInputCommandInteraction) {
    if (!i.isCommand()) return

    // 명령어 사용 시 로깅
    this.logger.info(`${i.user.tag} used '/${i.commandName}'`)
  }
}

export const setup = async () => {
  return new EventExtension()
}
