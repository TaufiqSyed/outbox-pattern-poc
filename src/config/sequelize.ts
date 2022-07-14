import { Sequelize } from 'sequelize-typescript'
import { Outbox } from '../models/outbox.model'
import { User } from '../models/user.model'

const sequelize = new Sequelize('outbox_pattern_poc', 'root', 'admin', {
  dialect: 'mysql',
})

sequelize.addModels([User, Outbox])

export default sequelize
