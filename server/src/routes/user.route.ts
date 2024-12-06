import express from 'express'

import userController from '~/controllers/user.controller'
import { checkJwt, checkRole } from '~/middleware/authentication'

const userRouter = express.Router()

userRouter.get('/', [checkJwt, checkRole], userController.getAllUser)
userRouter.get('/:id', [checkJwt], userController.getUserById)
userRouter.post('/create-user', [checkJwt, checkRole], userController.createUser)
userRouter.patch('/:id', [checkJwt, checkRole], userController.editUserById)
userRouter.delete('/:id', [checkJwt, checkRole], userController.softDeleteUserById)

export default userRouter
