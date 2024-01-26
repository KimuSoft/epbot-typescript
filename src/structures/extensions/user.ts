import { User } from '../../models/user'
import { UserDoc } from '../../types/user'
import * as Discord from 'discord.js'

declare module 'discord.js' {
  interface User {
    get epUser(): Promise<UserDoc>
  }
}

Object.defineProperty(Discord.User.prototype, 'epUser', {
  async get(this: Discord.User): Promise<UserDoc> {
    let user = await User.findOne({ id: this.id })
    if (!user) user = new User({ id: this.id })

    if (user.username !== this.username) {
      user.username = this.username
      await user.save()
    }

    return user
  },
})
