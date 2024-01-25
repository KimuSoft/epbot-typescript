type Config = {
  token: string
  db: string
  guilds: string[]
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config: Config = require('../config.json')
