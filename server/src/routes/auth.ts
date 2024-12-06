import express from 'express'
import authController from '~/controllers/auth.controller'
import AuthController from '~/controllers/auth.controller'
import { checkJwt } from '~/middleware/authentication'

const authRouter = express.Router()

//Login route
authRouter.post('/login', AuthController.login)
authRouter.patch('/change-password', [checkJwt], authController.changePassword)

export default authRouter
