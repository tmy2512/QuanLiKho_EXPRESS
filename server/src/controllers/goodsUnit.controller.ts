import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { GoodsUnits } from '~/models/entities/GoodsUnits'

//use datasource
const goodsUnitRepo = appDataSource.getRepository(GoodsUnits)

class GoodsUnitController {
  //[POST /goodsUnits]
  async createGoodsUnit(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body

    let goodsUnit = new GoodsUnits()
    goodsUnit.name = name

    //validate type of params
    const errors = await validate(goodsUnit)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save, if fails, the username is already in use
    try {
      goodsUnit = await goodsUnitRepo.save(goodsUnit)
      res.status(STATUS.CREATED).send(goodsUnit)
    } catch (error) {
      res.status(STATUS.CONFLICT).send({
        error: 'Trùng tên đơn vị tính'
      })
      return
    }
  }
  //[GET /goodsUnits]
  async getAllGoodsUnits(req: Request, res: Response, next: NextFunction) {
    //get all goodsUnits from DB
    const goodsUnits = await goodsUnitRepo.find({
      withDeleted: true
    })
    res.status(STATUS.SUCCESS).send(goodsUnits)
  }

  //[GET /goodsUnits/:id]
  async getGoodsUnitById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id

    //get goodsUnit by id from DB
    try {
      const goodsUnit = await goodsUnitRepo.findOneOrFail({
        where: {
          idGoodsUnits: id
        },
        withDeleted: true
      })

      //if ok
      res.status(STATUS.SUCCESS).send(goodsUnit)
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy đơn vị tính'
      })
    }
  }

  //[GET /goodsUnits/:id]
  async editGoodsUnitById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id
    //get params from body request
    const { name } = req.body

    //validate type
    const goodsUnit = new GoodsUnits()
    goodsUnit.name = name
    const errors = await validate(goodsUnit)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Dữ liệu không đúng định dạng'
      })
      return
    }

    try {
      await goodsUnitRepo.update(
        {
          idGoodsUnits: id
        },
        {
          name
        }
      )
      //if ok
      res.status(STATUS.NO_CONTENT).send()
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send('Không thể cập nhật đơn vị tính')
    }
  }

  //[DELETE /:id]
  async softDeleteGoodsUnitById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id

    try {
      //check if unit deleted
      const deletedUnit = await goodsUnitRepo.findOne({
        where: {
          idGoodsUnits: id,
          deletedAt: undefined
        }
      })

      //if unit hasn't deleted
      if (deletedUnit !== null) {
        goodsUnitRepo.softDelete({
          idGoodsUnits: id
        })
      } else {
        goodsUnitRepo.restore({
          idGoodsUnits: id
        })
      }
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy đơn vị tính'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}

export default new GoodsUnitController()
