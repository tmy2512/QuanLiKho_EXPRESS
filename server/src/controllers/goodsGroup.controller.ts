import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { GoodsGroups } from '~/models/entities/GoodsGroups'

//use datasource
const goodsGroupRepo = appDataSource.getRepository(GoodsGroups)

class GoodsGroupController {
  //[POST /goodsGroups]
  async createGoodsGroup(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body

    let goodsGroup = new GoodsGroups()
    goodsGroup.name = name

    //validate type of params
    const errors = await validate(goodsGroup)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save, if fails, the username is already in use
    try {
      goodsGroup = await goodsGroupRepo.save(goodsGroup)
      res.status(STATUS.CREATED).send(goodsGroup)
    } catch (error) {
      res.status(STATUS.CONFLICT).send({
        error: 'Trùng tên nhóm hàng'
      })
      return
    }
  }
  //[GET /goodsGroups]
  async getAllGoodsGroups(req: Request, res: Response, next: NextFunction) {
    //get all goodsGroups from DB
    const goodsGroups = await goodsGroupRepo.find({
      select: ['idGoodsGroups', 'name'],
      withDeleted: true
    })
    res.status(STATUS.SUCCESS).send(goodsGroups)
  }

  //[GET /goodsGroups/:id]
  async getGoodsGroupById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id

    //get goodsGroup by id from DB
    try {
      const goodsGroup = await goodsGroupRepo.findOneOrFail({
        where: {
          idGoodsGroups: id
        },
        withDeleted: true
      })

      //if ok
      res.status(STATUS.SUCCESS).send(goodsGroup)
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy nhóm hàng'
      })
    }
  }

  //[GET /goodsGroups/:id]
  async editGoodsGroupById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id
    //get params from body request
    const { name } = req.body

    //validate type
    const goodsGroup = new GoodsGroups()
    goodsGroup.name = name
    const errors = await validate(goodsGroup)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Dữ liệu không đúng định dạng'
      })
      return
    }

    try {
      await goodsGroupRepo.update(
        {
          idGoodsGroups: id
        },
        {
          name
        }
      )
      //if ok
      res.status(STATUS.NO_CONTENT).send()
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send('Không thể cập nhật nhóm hàng')
    }
  }

  //[DELETE /:id]
  async softDeleteGoodsGroupById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id

    try {
      //check if group deleted
      const deletedGroup = await goodsGroupRepo.findOne({
        where: {
          idGoodsGroups: id,
        }
      })

      //if group hasn't deleted
      if (deletedGroup !== null) {
        goodsGroupRepo.softDelete({
          idGoodsGroups: id
        })
      } else {
        goodsGroupRepo.restore({
          idGoodsGroups: id
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

export default new GoodsGroupController()
