import { validate } from 'class-validator'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { PermissionDetails } from '~/models/entities/PermissionDetails'
import { Permissions } from '~/models/entities/Permissions'
import { Users } from '~/models/entities/Users'

dotenv.config()

//use datasource
const userRepository = appDataSource.getRepository(Users)
const entityManager = appDataSource.createEntityManager()

class UserController {
  //[GET /users]
  async getAllUser(req: Request, res: Response, next: NextFunction) {
    //get all users from DB
    const users = await userRepository.find({
      select: ['idUsers', 'username', 'name', 'email', 'disabled']
    })

    res.status(STATUS.SUCCESS).send(users)
  }

  //[GET /users/:id]
  async getUserById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id

    //get user by id from DB
    try {
      const user = await userRepository.findOneOrFail({
        select: [
          'idUsers',
          'name',
          'gender',
          'username',
          'phone',
          'email',
          'startDate',
          'disabled',
          'idCreated',
          'idUpdated',
          'createdAt',
          'updatedAt'
        ],
        where: {
          idUsers: id
        }
      })
      const createdManager = await userRepository.findOneOrFail({
        select: ['username'],
        where: {
          idUsers: user.idCreated
        }
      })
      let updatedManager = new Users()
      if (user.idUpdated) {
        updatedManager = await userRepository.findOneOrFail({
          select: ['username'],
          where: {
            idUsers: user.idUpdated
          }
        })
      }
      //get permissions of user
      const existingPermissions = await entityManager.find(PermissionDetails, {
        where: {
          idUsers: id
        }
      })
      const idPermissions = existingPermissions.map((permission) => permission.idPermission)
      res.send({
        ...user,
        usernameCreated: createdManager.username,
        usernameUpdated: updatedManager.username,
        idPermissions: idPermissions
      })
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy người dùng'
      })
    }
  }

  //[POST /users/create-user]
  async createUser(req: Request, res: Response, next: NextFunction) {
    //get params from request body
    const { name, email, gender, phone, startDate, username, password, idCreated, idPermissions } = req.body

    const user = new Users()
    user.name = name
    user.email = email
    user.gender = gender
    user.phone = phone
    user.startDate = startDate
    user.username = username
    user.password = password
    user.idCreated = idCreated

    //validate type of params
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //hash password
    user.hashPassword()

    //try to save, if fails, the username is already in use
    try {
      await userRepository.save(user)
    } catch (error) {
      res.status(STATUS.CONFLICT).send({
        error: 'Username, email hoặc SĐT đã được sử dụng trước đó'
      })
      return
    }

    //get new user from DB
    let newUser: Users
    try {
      newUser = await userRepository.findOneOrFail({
        select: ['idUsers', 'name', 'gender', 'username', 'phone', 'email', 'startDate', 'disabled'],
        where: {
          idUsers: user.idUsers
        }
      })
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send('Không tìm thấy người dùng')
      return
    }

    //push permissions with user into permission detail
    try {
      const permissions = await entityManager.find(Permissions, {
        where: {
          idPermissions: In(idPermissions)
        }
      })
      const userPermissions = permissions.map((permissionId) => {
        const permission_detail = new PermissionDetails()
        permission_detail.idUsers = user.idUsers
        permission_detail.idPermission = permissionId.idPermissions

        return permission_detail
      })

      await entityManager.save(userPermissions)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send('Quyền không hợp lệ')
      return
    }
    res.status(STATUS.CREATED).send(newUser)
  }

  //[PATCH /:id]
  async editUserById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id
    //get params from body request
    const {
      name,
      email,
      gender,
      phone,
      startDate,
      username,
      disabled,
      idUpdated,
      idPermissions
    }: {
      name: string
      email: string
      gender: 'M' | 'F' | 'O'
      phone: string
      startDate: string
      username: string
      disabled: number
      idUpdated?: number
      idPermissions: number[]
    } = req.body

    //get fields need to be updated
    const updatedFields = ['name', 'email', 'gender', 'phone', 'startDate', 'username', 'disabled', 'idUpdated'].filter(
      (field) => req.body[field] !== undefined
    )

    let user: Users
    if (updatedFields.length > 0) {
      //get user by id from DB
      try {
        user = await userRepository.findOneOrFail({
          where: {
            idUsers: id
          }
        })
      } catch (error) {
        res.status(STATUS.NOT_FOUND).send({
          error: 'Không tìm thấy người dùng'
        })
        return
      }

      //validate type
      user.name = name
      user.email = email
      user.gender = gender
      user.phone = phone
      user.startDate = startDate
      user.username = username
      user.disabled = disabled
      if (idUpdated) user.idUpdated = idUpdated
      const errors = await validate(user)
      if (errors.length > 0) {
        res.status(STATUS.BAD_REQUEST).send({
          error: 'Dữ liệu không đúng định dạng'
        })
        return
      }

      await userRepository.update(
        {
          idUsers: id
        },
        {
          name,
          email,
          gender,
          phone,
          startDate,
          username,
          disabled,
          idUpdated,
          updatedAt: new Date()
        }
      )
    }

    //try to update permission
    //get existing permission of user
    try {
      const existingPermissions = await entityManager.find(PermissionDetails, {
        where: {
          idUsers: id
        }
      })

      //check differences
      const isChanged = !existingPermissions.every((permission) => {
        idPermissions.indexOf(permission.idPermission) >= 0
      })

      if (isChanged) {
        //remove old permissions of user
        await entityManager.delete(PermissionDetails, {
          idUsers: id
        })
        //add new permissions of user
        const userPermissions = idPermissions.map((permissionId: number) => {
          const permission_detail = new PermissionDetails()
          permission_detail.idUsers = id
          permission_detail.idPermission = permissionId

          return permission_detail
        })

        await entityManager.save(userPermissions)
      }
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Cập nhật quyền thất bại'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send({
      // error: 'Cập nhật người dùng thành công'
    })
  }

  //[DELETE /:id]
  async softDeleteUserById(req: Request, res: Response, next: NextFunction) {
    const id: number = +req.params.id

    let user: Users
    try {
      user = await userRepository.findOneOrFail({
        select: ['disabled'],
        where: {
          idUsers: id
        }
      })
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy người dùng'
      })
      return
    }

    const isDisabled = user.disabled

    try {
      await userRepository.update(
        {
          idUsers: id
        },
        {
          // updatedAt: new Date(),
          disabled: isDisabled ? 0 : 1
        }
      )
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy người dùng'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send({
      // error: isDisabled ? 'Đã kích hoạt lại người dùng thành công' : 'Đã vô hiệu hoá người dùng thành công'
    })
  }
}

export default new UserController()
