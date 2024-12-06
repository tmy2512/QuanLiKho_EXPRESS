import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { Users } from '~/models/entities/Users'
import { Warehouses } from '~/models/entities/Warehouses'

//use datasource
const whRepo = appDataSource.getRepository(Warehouses)
const userRepository = appDataSource.getRepository(Users)

class WarehouseController {
  //[POST /warehouses]
  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    const { name, address, totalFloors, totalSlots, idCreated, provinceCode } = req.body

    let warehouse = new Warehouses()
    warehouse.name = name
    warehouse.address = address
    warehouse.totalFloors = totalFloors
    warehouse.totalSlots = totalSlots
    warehouse.idCreated = idCreated
    warehouse.provinceCode = provinceCode
    warehouse.disabled = 0

    //validate type of params
    const errors = await validate(warehouse)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save, if fails, the username is already in use
    try {
      warehouse = await whRepo.save(warehouse)
      res.status(STATUS.CREATED).send(warehouse)
    } catch (error) {
      res.status(STATUS.CONFLICT).send({
        error: 'Trùng tên kho'
      })
      return
    }
  }
  //[GET /warehouses]
  async getAllWarehouses(req: Request, res: Response, next: NextFunction) {
    //get all warehouses from DB
    const warehouses = await whRepo.find({
      select: ['idWarehouse', 'name', 'address', 'totalFloors', 'totalSlots', 'disabled']
    })
    res.status(STATUS.SUCCESS).send(warehouses)
  }

  //[GET /warehouses/empty-slots/:id]
  async getWarehouseSlots(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id
    //get warehouse by id from DB
    try {
      const warehouse = await whRepo.findOneOrFail({
        select: ['idWarehouse', 'totalFloors', 'totalSlots', 'goods'],
        where: {
          idWarehouse: id
        },
        relations: ['goods']
      })
      //if ok
      res.status(STATUS.SUCCESS).send(warehouse)
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy kho'
      })
    }
  }

  //[GET /warehouses/:id]
  async getWarehouseById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id

    //get warehouse by id from DB
    try {
      const warehouse = await whRepo.findOneByOrFail({
        idWarehouse: id
      })
      const createdManager = await userRepository.findOneOrFail({
        select: ['username'],
        where: {
          idUsers: warehouse.idCreated
        }
      })
      let updatedManager: Users = new Users()
      if (warehouse.idUpdated) {
        updatedManager = await userRepository.findOneOrFail({
          select: ['username'],
          where: {
            idUsers: warehouse.idUpdated
          }
        })
      }

      //if ok
      res.status(STATUS.SUCCESS).send({
        ...warehouse,
        usernameCreated: createdManager.username,
        usernameUpdated: updatedManager.username
      })
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy kho'
      })
    }
  }

  //[GET /warehouses/:id]
  async getWarehouseByProvinceCode(req: Request, res: Response, next: NextFunction) {
    //get provinceCode from query string
    const provinceCode = req.params.provinceCode

    //get warehouse by id from DB
    try {
      const warehouses = await whRepo.find({
        where: {
          provinceCode
        }
      })
      //if ok
      res.status(STATUS.SUCCESS).send(warehouses)
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy kho'
      })
    }
  }

  //[GET /warehouses/:id]
  async editWarehouseById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id
    //get params from body request
    const { name, address, totalFloors, totalSlots, idUpdated, provinceCode } = req.body

    //validate type
    const warehouse = new Warehouses()
    warehouse.name = name
    warehouse.address = address
    warehouse.totalFloors = totalFloors
    warehouse.totalSlots = totalSlots
    warehouse.provinceCode = provinceCode
    warehouse.idUpdated = idUpdated
    const errors = await validate(warehouse)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Dữ liệu không đúng định dạng'
      })
      return
    }

    try {
      whRepo.update(
        {
          idWarehouse: id
        },
        {
          name,
          address,
          totalFloors,
          totalSlots,
          idUpdated,
          updatedAt: new Date()
        }
      )
      //if ok
      res.status(STATUS.NO_CONTENT).send()
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send('Không thể cập nhật thông tin kho')
    }
  }

  //[DELETE /:id]
  async softDeleteWarehouseById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id

    let warehouse: Warehouses
    try {
      warehouse = await whRepo.findOneOrFail({
        select: ['disabled'],
        where: {
          idWarehouse: id
        }
      })
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy kho'
      })
      return
    }

    const isDisabled = warehouse.disabled

    try {
      await whRepo.update(
        {
          idWarehouse: id
        },
        {
          // updatedAt: new Date(),
          disabled: isDisabled ? 0 : 1
        }
      )
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy kho'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}

export default new WarehouseController()
