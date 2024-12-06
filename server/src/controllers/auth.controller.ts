import { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'

import { appDataSource } from '~/constants/appDataSource'
import { Users } from '~/models/entities/Users'
import * as jwt from 'jsonwebtoken'
import { validate } from 'class-validator'
import STATUS from '~/constants/statusCode'
import { PermissionDetails } from '~/models/entities/PermissionDetails'

dotenv.config()
//use datasource
const userRepository = appDataSource.getRepository(Users)
const entityManager = appDataSource.createEntityManager()

class AuthController {
  //[POST /login]
  async login(req: Request, res: Response, next: NextFunction) {
    //Check empty
    const { username, password } = req.body
    if (!(username && password)) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Tài khoản hoặc mật khẩu rỗng'
      })
    }

    //Get user from DB
    let user: Users
    try {
      user = await userRepository.findOneOrFail({
        select: ['username', 'password', 'idUsers', 'name'],
        where: {
          username,
          disabled: 0
        }
      })
    } catch (error) {
      res.status(STATUS.UNAUTHORIZED).send({
        error: 'Tài khoản hoặc mật khẩu không đúng'
      })
      return
    }

    // //Check if encrypted password match
    if (!user.verifyPassword(password)) {
      res.status(STATUS.UNAUTHORIZED).send({
        error: 'Tài khoản hoặc mật khẩu không đúng'
      })
      return
    }

    const secretJwt = process.env.JWT_SECRET as string

    //Sign JWT, expired in 1h
    const token = jwt.sign({ userId: user.idUsers, username: user.username }, secretJwt, {
      expiresIn: '1h'
    })

    //get permissions of user
    const existingPermissions = await entityManager.find(PermissionDetails, {
      where: {
        idUsers: user.idUsers
      }
    })
    const idPermissions = existingPermissions.map((permission) => permission.idPermission)

    //if OK
    res.send({
      userId: user.idUsers,
      username,
      idPermissions,
      token,
      name: user.name
    })
  }

  //[PATCH /change-password]
  async changePassword(req: Request, res: Response, next: NextFunction) {
    //get id from jwt
    if (res.locals.jwtPayload?.userId === undefined) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Không tìm thấy ID người dùng'
      })
      return
    }
    const id = res.locals.jwtPayload.userId

    //get params from body request
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Mật khẩu không trùng khớp'
      })
    }

    //get user from DB
    const userRepository = appDataSource.getRepository(Users)
    let user: Users
    try {
      user = await userRepository.findOneOrFail({
        select: ['password'],
        where: {
          idUsers: id,
          disabled: 0
        }
      })
    } catch (error) {
      res.status(STATUS.UNAUTHORIZED).send({
        error: 'Không tìm thấy tài khoản'
      })
      return
    }

    //check if old password matches
    if (!user.verifyPassword(oldPassword)) {
      res.status(STATUS.UNAUTHORIZED).send({
        error: 'Mật khẩu không đúng'
      })
      return
    }

    //validate type
    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Mật khẩu sai định dạng'
      })
      return
    }

    //hash new password
    user.hashPassword()
    try {
      userRepository.update(
        {
          idUsers: id
        },
        {
          password: user.password
        }
      )
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Đổi mật khẩu thất bại'
      })
      return
    }

    res.status(STATUS.CREATED).send({
      message: 'Đổi mật khẩu thành công'
    })
  }
}

export default new AuthController()
