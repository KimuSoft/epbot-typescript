import { moveSeason } from '../services/room'
import { Job, scheduleJob } from 'node-schedule'
import { Logger } from 'tslog'

export class Scheduler {
  logger = new Logger({
    name: 'Scheduler',
  })
  midNightScheduleJob?: Job

  async start() {
    this.midNightScheduleJob = scheduleJob('0 0 0 * * *', this.midNightSchedule)
  }

  // 매일 0시에 이뤄지는 작업
  async midNightSchedule() {
    this.logger.info('Midnight schedule started!')

    this.logger.info('Moving season...')
    await moveSeason()

    this.logger.info('Midnight schedule ended!')
  }
}
