import { config } from './config'
import { Scheduler } from './game/scheduler'
import { CustomizedCommandClient } from './structures'
import { Client } from 'discord.js'
import Redis from 'ioredis'
import mongoose from 'mongoose'

const client = new Client({
  intents: ['Guilds', 'DirectMessages', 'GuildMessages'],
})

const cts = new CustomizedCommandClient(client)

const start = async () => {
  // MongoDB setup
  await mongoose.connect(config.db)

  // Scheduler setup
  const scheduler = new Scheduler()
  await scheduler.start()

  // CTS setup
  await cts.setup()
  await client.login(config.token)
  await cts.getApplicationCommandsExtension()?.sync()
}

start().then()
