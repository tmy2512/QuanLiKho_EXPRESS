import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { GoodsGroups } from '~/models/entities/GoodsGroups'
import { GoodsTypes } from '~/models/entities/GoodsTypes'

//use datasource
const goodsTypeRepo = appDataSource.getRepository(GoodsTypes)
const goodsGroupRepo = appDataSource.getRepository(GoodsGroups)

class GoodsTypeController {
  //[POST /goodsTypes]
  async createGoodsType(req: Request, res: Response, next: NextFunction) {
    const { idGoodsGroup, name } = req.body

    let goodsType = new GoodsTypes()
    goodsType.idGoodsGroup = idGoodsGroup
    goodsType.name = name

    //validate type of params
    const errors = await validate(goodsType)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //validate goods group
    try {
      goodsGroupRepo.findOneByOrFail({
        idGoodsGroups: idGoodsGroup
      })
    } catch (error) {
      res.send(STATUS.BAD_REQUEST).send({
        error: 'Nhóm hàng không có hoặc có thể đã bị xoá'
      })
      return
    }

    //try to save, if fails, the username is already in use
    try {
      goodsType = await goodsTypeRepo.save(goodsType)
      res.status(STATUS.CREATED).send(goodsType)
    } catch (error) {
      res.status(STATUS.CONFLICT).send({
        error: 'Trùng tên nhóm hàng'
      })
      return
    }
  }

  //[GET /goodsType]
  async getAllGoodsType(req: Request, res: Response, next: NextFunction) {
    //get all goodsType from DB
    try {
      const goodsType = await goodsTypeRepo.find({
        select: ['idGoodsTypes', 'name', 'idGoodsGroup', 'idGoodsGroup2', 'deletedAt'],
        relations: ['idGoodsGroup2'],
        withDeleted: true
      })
      res.status(STATUS.SUCCESS).send(goodsType)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Không tìm thấy nhóm hàng'
      })
    }
  }

  //[GET /goodsType/:id]
  async getGoodsTypeById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id

    //get goodsType by id from DB
    try {
      const goodsType = await goodsTypeRepo.findOneOrFail({
        select: ['idGoodsTypes', 'name', 'idGoodsGroup', 'idGoodsGroup2', 'deletedAt'],
        where: {
          idGoodsTypes: id
        },
        relations: ['idGoodsGroup2'],
        withDeleted: true
      })

      //if ok
      res.status(STATUS.SUCCESS).send(goodsType)
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy nhóm hàng'
      })
    }
  }

  // //[GET /goodsType/:id]
  async editGoodsTypeById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id
    //get params from body request
    const { idGoodsGroup, name } = req.body

    //validate type
    const goodsType = new GoodsTypes()
    goodsType.idGoodsGroup = idGoodsGroup
    goodsType.name = name
    const errors = await validate(goodsType)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Dữ liệu không đúng định dạng'
      })
      return
    }

    try {
      await goodsTypeRepo.update(
        {
          idGoodsTypes: id
        },
        {
          idGoodsGroup,
          name
        }
      )
      //if ok
      res.status(STATUS.NO_CONTENT).send()
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send('Không thể cập nhật nhóm hàng')
    }
  }

  // //[DELETE /:id]
  async softDeleteGoodsTypeById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id

    try {
      //check if type deleted
      const deletedType = await goodsTypeRepo.findOne({
        where: {
          idGoodsTypes: id,
          deletedAt: undefined
        }
      })

      //if type hasn't deleted
      if (deletedType !== null) {
        goodsTypeRepo.softDelete({
          idGoodsTypes: id
        })
      } else {
        goodsTypeRepo.restore({
          idGoodsTypes: id
        })
      }
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy nhóm hàng'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}

export default new GoodsTypeController()
