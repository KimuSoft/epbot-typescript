import { config } from './config'
import { CustomizedCommandClient } from './structures'
import { Client } from 'discord.js'
import mongoose from 'mongoose'

const client = new Client({
  intents: ['Guilds', 'DirectMessages', 'GuildMessages'],
})

const cts = new CustomizedCommandClient(client)

const start = async () => {
  // MongoDB setup
  await mongoose.connect(config.db)

  // CTS setup
  await cts.setup()
  await client.login(config.token)
  await cts.getApplicationCommandsExtension()?.sync()
}

start().then()
