import { User } from '../models/user.model'
import { OutboxCreationAttributes, UserCreationAttributes } from '../types'
import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import sequelize from '../config/sequelize'
import { Outbox } from '../models/outbox.model'

const router = express.Router()

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(await User.findAll()).status(200)
    } catch (err) {
      res.send('Failed to fetch users').status(500)
    }
  })
)

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: UserCreationAttributes = req.body
      const userExists: boolean =
        (await User.findOne({ where: { email: user.email } })) != null
      if (userExists) {
        res.status(400).send('Account with this email already exists')
        return
      }
      console.log(user)
      await sequelize.transaction(async (t) => {
        const newUser = await User.create(user, { transaction: t })
        const newOutboxCreationAttributes: OutboxCreationAttributes = {
          message: `Created user with id ${newUser.id}`,
        }
        await Outbox.create(newOutboxCreationAttributes)
        res.status(201).send(`Created user with id ${newUser.id}`)
      })
    } catch (err) {
      res.status(400).send('Failed to create user')
    }
  })
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      if (user == null) {
        res.status(400).send('No user exists with the provided id')
      } else {
        res.send(user)
      }
    } catch (err) {
      res.status(201).send('No user exists with the provided id')
    }
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const numDeletes: number = await User.destroy({ where: { id: id } })
      if (numDeletes == 0) {
        res.status(400).send('No user exists with the provided id')
      } else {
        res.sendStatus(201)
      }
    } catch (err) {
      res.sendStatus(400)
    }
  })
)

export default router
