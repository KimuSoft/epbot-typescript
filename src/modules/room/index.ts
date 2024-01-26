import { SubCommandGroup } from '@pikokr/command.ts'

export const roomGroup = new SubCommandGroup({
  name: 'place',
  name_localizations: {
    ko: '낚시터',
  },
  description: '낚시터 관련 명령어',
})
