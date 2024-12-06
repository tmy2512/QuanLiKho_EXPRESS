import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import STATUS from '~/constants/statusCode'
import { appDataSource } from '~/constants/appDataSource'
import { Users } from '~/models/entities/Users'
import { PermissionDetails } from '~/models/entities/PermissionDetails'

dotenv.config()
//use datasource
const permissionDetailRepo = appDataSource.getRepository(PermissionDetails)

function checkJwt(req: Request, res: Response, next: NextFunction) {
  //get the jwt token from request head
  const token = req.headers['authorization'] || ''
  const secretJwt = process.env.JWT_SECRET as string

  let JwtPayload: string | jwt.JwtPayload

  try {
    //verify token
    JwtPayload = jwt.verify(token, secretJwt)
    res.locals.JwtPayload = JwtPayload
  } catch (error) {
    //if token is invalid, respond 401
    res.status(STATUS.UNAUTHORIZED).send({
      error: 'Đã hết phiên đăng nhập'
    })
    return
  }
  JwtPayload = {
    exp: Math.floor(Date.now() / 1000) + 3600 //expired in 1h
  }
  //send new token from every request
  const newToken = jwt.sign(JwtPayload, secretJwt)
  res.setHeader('token', newToken)

  //next middleware or controller
  next()
}

async function checkRole(req: Request, res: Response, next: NextFunction) {
  //get the userID from previous middleware
  const id = +res.locals.JwtPayload.userId
  const permissionId = req.query.permissionId

  //Get user role from the database
  try {
    //get permissions of user
    const existingPermissions = await permissionDetailRepo.find({
      where: {
        idUsers: id
      }
    })
    const idPermissions = existingPermissions.map((permission) => permission.idPermission)
    if (permissionId) {
      const hasAccept = idPermissions.find((permission) => permission === +permissionId)

      if (!hasAccept) {
        return res.status(STATUS.FORBIDDEN).send({
          error: 'Không có quyền truy cập'
        })
      }
    } else
      return res.status(STATUS.FORBIDDEN).send({
        error: 'Không có quyền truy cập'
      })
  } catch (id) {
    res.status(STATUS.UNAUTHORIZED).send({
      error: 'Chưa đăng nhập'
    })
  }

  next()
}

export { checkJwt, checkRole }
