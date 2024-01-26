import { config } from '../config'
import Redis from 'ioredis'

export const redis = new Redis(config.redis)
