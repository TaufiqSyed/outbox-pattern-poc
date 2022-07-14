import { Router } from 'express'
import usersRouter from './controllers/user.controller'

const router = Router()

router.use('/users', usersRouter)

export default router
