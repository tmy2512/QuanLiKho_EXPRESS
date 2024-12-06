import { validate } from 'class-validator'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { ExportOrderDetails } from '~/models/entities/ExportOrderDetails'
import { ExportOrders } from '~/models/entities/ExportOrders'
import { iExportOrderReqBody } from './types'

dotenv.config()

//use datasource
const exportOrderRepo = appDataSource.getRepository(ExportOrders)
const exportOrderDetailRepo = appDataSource.getRepository(ExportOrderDetails)

class ExportOrderController {
  //[GET /ExportOrder/:status]
  async getAllExportOrders(req: Request, res: Response, next: NextFunction) {
    try {
      //get all ExportOrder from DB
      const exportOrder = await exportOrderRepo.find({
        select: ['idExportOrders', 'orderDate', 'status', 'exportOrderDetails'],
        where: {
          status: 0
        },
        order: {
          orderDate: 'ASC'
        },
        relations: ['exportOrderDetails.idGoods2']
      })
      res.status(STATUS.SUCCESS).send(exportOrder)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Trạng thái đơn xuất không đúng'
      })
    }
  }
  //[GET /ExportOrder/:id]
  async getExportOrderById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id
    //get ExportOrder by id from DB
    try {
      const exportOrder = await exportOrderRepo.findOneOrFail({
        select: [
          'idExportOrders',
          'orderDate',
          'provinceCode',
          'districtCode',
          'wardCode',
          'address',
          'exportOrderDetails',
          'status'
        ],
        where: {
          idExportOrders: id
        },
        relations: ['exportOrderDetails.idGoods2']
      })
      res.status(STATUS.SUCCESS).send(exportOrder)
    } catch (error) {
      console.log(error)
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy đơn xuất kho'
      })
    }
  }

  //[POST /ExportOrder/create-ExportOrder]
  async createExportOrder(req: Request, res: Response, next: NextFunction) {
    //get params from request body
    const { provinceCode, districtCode, wardCode, address, exportOrderDetails }: iExportOrderReqBody = req.body

    let exportOrder = new ExportOrders()
    exportOrder.orderDate = new Date()
    exportOrder.provinceCode = provinceCode
    exportOrder.districtCode = districtCode
    exportOrder.wardCode = wardCode
    exportOrder.address = address
    exportOrder.status = 0

    //validate type of params
    const errors = await validate(exportOrder)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save ExportOrder
    try {
      exportOrder = await exportOrderRepo.save(exportOrder)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Lỗi không xác định'
      })
      return
    }

    //push order details
    try {
      const orderDetailObjects = exportOrderDetails.map((detail) => {
        const newOrderDetail = new ExportOrderDetails()
        newOrderDetail.idExportOrder = exportOrder.idExportOrders
        newOrderDetail.idGoods = detail.idGoods
        newOrderDetail.amount = detail.amount

        return newOrderDetail
      })

      //try to save order details
      exportOrderDetailRepo.save(orderDetailObjects)
    } catch (error) {
      console.log(error)

      res.status(STATUS.BAD_REQUEST).send('Chi tiết đơn xuất không hợp lệ')
      return
    }

    res.status(STATUS.CREATED).send(exportOrder)
  }

  //[DELETE /:id]
  async softDeleteExportOrderById(req: Request, res: Response, next: NextFunction) {
    const id: number = +req.params.id
    try {
      const updateResult0 = await exportOrderRepo.update(
        {
          idExportOrders: id,
          status: 0
        },
        {
          status: 1
        }
      )

      if (updateResult0.affected === 0) {
        res.status(STATUS.BAD_REQUEST).send({
          error: 'Không thể huỷ đơn xuất kho đang vận chuyển'
        })
        return
      }
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy đơn xuất kho'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}
export default new ExportOrderController()
