import { validate } from 'class-validator'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { ExportReceipts } from '~/models/entities/ExportReceipts'
import { Users } from '~/models/entities/Users'
import { iExportReceiptReqBody } from './types'
import EXPORT_STATUS from '~/constants/ExportOrderStatusCode'
import { ExportOrders } from '~/models/entities/ExportOrders'
import { And, LessThan, MoreThanOrEqual } from 'typeorm'

dotenv.config()

//use datasource
const exportReceiptRepo = appDataSource.getRepository(ExportReceipts)
const exportOrderRepo = appDataSource.getRepository(ExportOrders)
const userRepository = appDataSource.getRepository(Users)

class ExportReceiptController {
  //[GET /ExportReceipt/:status]
  async getAllExportReceiptsByStatus(req: Request, res: Response, next: NextFunction) {
    //get status from query string
    const status: number = +req.params.status
    try {
      //get all ExportReceipt from DB
      const exportReceipt = await exportReceiptRepo.find({
        select: ['idExportReceipts', 'idWarehouse2', 'exportDate', 'status', 'idExportOrder2', 'reasonFailed'],
        where: { status: status },
        order: {
          exportDate: 'DESC'
        },
        relations: ['idWarehouse2', 'idExportOrder2.exportOrderDetails.idGoods2']
      })
      res.status(STATUS.SUCCESS).send(exportReceipt)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Trạng thái phiếu xuất không đúng'
      })
    }
  }

  async filterExportReceiptsByDate(req: Request, res: Response, next: NextFunction) {
    //get query string
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string

    try {
      //get all ExportReceipt from DB
      const exportReceipt = await exportReceiptRepo.find({
        select: {
          idExportReceipts: true,
          status: true,
          exportDate: true,
          idWarehouse2: {
            idWarehouse: true,
            name: true,
            provinceCode: true
          },
          idExportOrder2: {
            idExportOrders: true,
            exportOrderDetails: {
              idExportOrderDetails: true,
              amount: true,
              idGoods2: {
                idGoods: true,
                amount: true,
                name: true,
                idUnit2: {
                  idGoodsUnits: true,
                  name: true
                }
              }
            }
          }
        },
        where: {
          status: And(MoreThanOrEqual(EXPORT_STATUS.IN_PROCESS_CREATED), LessThan(EXPORT_STATUS.FAILED)),
          exportDate: And(LessThan(new Date(endDate)), MoreThanOrEqual(new Date(startDate)))
        },
        order: {
          exportDate: 'ASC'
        },
        relations: ['idWarehouse2', 'idExportOrder2.exportOrderDetails.idGoods2.idUnit2']
      })
      res.status(STATUS.SUCCESS).send(exportReceipt)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Trạng thái phiếu xuất không đúng'
      })
    }
  }

  //[GET /ExportReceipt/:id]
  async getExportReceiptById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id
    //get ExportReceipt by id from DB
    try {
      const exportReceipt = await exportReceiptRepo.findOneOrFail({
        select: [
          'idExportReceipts',
          'idWarehouse',
          'idWarehouse2',
          'idExportOrder',
          'idExportOrder2',
          'idUserExport',
          'exportDate',
          'palletCode',
          'status',
          'idUpdated',
          'updatedAt'
        ],
        where: {
          idExportReceipts: id
        },
        relations: ['idWarehouse2', 'idExportOrder2.exportOrderDetails.idGoods2']
      })

      const createdManager = await userRepository.findOneOrFail({
        select: ['username'],
        where: {
          idUsers: exportReceipt.idUserExport
        }
      })
      //get user updated receipt
      let updatedManager = new Users()
      if (exportReceipt.idUpdated) {
        updatedManager = await userRepository.findOneOrFail({
          select: ['username'],
          where: {
            idUsers: exportReceipt.idUpdated
          }
        })
      }

      res.status(STATUS.SUCCESS).send({
        ...exportReceipt,
        usernameCreated: createdManager.username,
        usernameUpdated: updatedManager.username
      })
    } catch (error) {
      console.log(error)
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy phiếu xuất kho'
      })
    }
  }

  //[POST /ExportReceipt/create-ExportReceipt]
  async createExportReceipt(req: Request, res: Response, next: NextFunction) {
    //get params from request body
    const { idWarehouse, idExportOrder, idUserExport, exportDate, palletCode }: iExportReceiptReqBody = req.body

    let exportReceipt = new ExportReceipts()
    exportReceipt.idWarehouse = idWarehouse
    exportReceipt.idExportOrder = idExportOrder
    exportReceipt.idUserExport = idUserExport
    exportReceipt.exportDate = new Date(exportDate)
    exportReceipt.palletCode = palletCode
    exportReceipt.status = EXPORT_STATUS.IN_PROCESS_CREATED

    //validate type of params
    const errors = await validate(exportReceipt)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save ExportReceipt
    try {
      exportReceipt = await exportReceiptRepo.save(exportReceipt)
      const receiptWarehouse = await exportReceiptRepo.findOneOrFail({
        select: ['idWarehouse2'],
        where: {
          idExportReceipts: exportReceipt.idExportReceipts
        },
        relations: ['idWarehouse2']
      })
      const receiptOrder = await exportReceiptRepo.findOneOrFail({
        select: ['idExportOrder2'],
        where: {
          idExportReceipts: exportReceipt.idExportReceipts
        },
        relations: ['idExportOrder2']
      })
      exportOrderRepo.update(
        {
          idExportOrders: receiptOrder.idExportOrder2.idExportOrders
        },
        {
          status: 1
        }
      )
      exportReceipt = {
        ...exportReceipt,
        idWarehouse2: {
          ...receiptWarehouse.idWarehouse2
        },
        idExportOrder2: {
          ...receiptOrder.idExportOrder2
        }
      }
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Lỗi không xác định'
      })
      return
    }
    //if ok
    res.status(STATUS.CREATED).send(exportReceipt)
  }

  //[PATCH /:id]
  async editExportReceiptById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id
    //get params from body request
    const { idWarehouse, idExportOrder, palletCode, status, idUpdated }: iExportReceiptReqBody = req.body

    let exportReceipt: ExportReceipts
    //get ExportReceipt by id from DB
    try {
      exportReceipt = await exportReceiptRepo.findOneOrFail({
        where: {
          idExportReceipts: id
        },
        relations: ['idWarehouse2', 'idExportOrder2']
      })
    } catch (error) {
      console.log(error)
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy phiếu xuất kho'
      })
      return
    }

    try {
      //update by status
      switch (status) {
        case EXPORT_STATUS.IN_PROCESS_CREATED: //UPDATE INFO
          {
            const updateResult = await exportReceiptRepo.update(
              {
                idExportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_CREATED
              },
              {
                idWarehouse,
                idExportOrder,
                palletCode,
                idUpdated,
                status
              }
            )
            if (updateResult.affected === 0) {
              res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu xuất kho đang vận chuyển'
              })
              return
            }
          }
          break
        case EXPORT_STATUS.IN_PROCESS_PACKED:
          {
            const updateResult = await exportReceiptRepo.update(
              {
                idExportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_CREATED
              },
              {
                status
              }
            )
            if (updateResult.affected === 0) {
              res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu xuất kho đang vận chuyển'
              })
              return
            }
            exportReceipt = {
              ...exportReceipt,
              status: EXPORT_STATUS.IN_PROCESS_PACKED
            }
          }
          break
        case EXPORT_STATUS.IN_PROCESS_CLASSIFIED:
          {
            const updateResult = await exportReceiptRepo.update(
              {
                idExportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_PACKED
              },
              {
                status
              }
            )
            if (updateResult.affected === 0) {
              res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu xuất kho đang vận chuyển'
              })
              return
            }
            exportReceipt = {
              ...exportReceipt,
              status: EXPORT_STATUS.IN_PROCESS_CLASSIFIED
            }
          }
          break
        case EXPORT_STATUS.IN_PROCESS_ON_THE_WAY:
          {
            const updateResult = await exportReceiptRepo.update(
              {
                idExportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_CLASSIFIED
              },
              {
                status
              }
            )
            if (updateResult.affected === 0) {
              res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu xuất kho đang vận chuyển'
              })
              return
            }
            exportReceipt = {
              ...exportReceipt,
              status: EXPORT_STATUS.IN_PROCESS_ON_THE_WAY
            }
          }
          break
        case EXPORT_STATUS.FINISHED:
          {
            const updateResult = await exportReceiptRepo.update(
              {
                idExportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_ON_THE_WAY
              },
              {
                status
              }
            )
            if (updateResult.affected === 0) {
              res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu xuất kho đang vận chuyển'
              })
              return
            }
            exportReceipt = {
              ...exportReceipt,
              status: EXPORT_STATUS.FINISHED
            }
          }
          break
        default:
          res.status(STATUS.BAD_REQUEST).send({
            error: 'Không thể cập nhật phiếu xuất kho'
          })
          return
      }

      //update update_at, id_updated fields
      const updateDateResult = await exportReceiptRepo.update(
        {
          idExportReceipts: id
        },
        {
          idUpdated: idUpdated,
          updatedAt: new Date()
        }
      )
      if (updateDateResult.affected === 0) {
        res.status(STATUS.BAD_REQUEST).send({
          error: 'Không thể cập nhật ngày & người chỉnh sửa phiếu xuất kho'
        })
        return
      }
    } catch (error) {
      console.log(error)

      res.status(STATUS.BAD_REQUEST).send({
        error: 'Không thể cập nhật phiếu xuất kho'
      })
      return
    }
    //if ok
    res.status(STATUS.SUCCESS).send(exportReceipt)
  }

  //[DELETE /:id]
  async softDeleteExportReceiptById(req: Request, res: Response, next: NextFunction) {
    const id: number = +req.params.id
    const { reasonFailed }: iExportReceiptReqBody = req.body

    const updateResult = await exportReceiptRepo.update(
      {
        idExportReceipts: id,
        status: EXPORT_STATUS.IN_PROCESS_CREATED
      },
      {
        status: EXPORT_STATUS.FAILED,
        reasonFailed
      }
    )
    if (updateResult.affected === 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Không tìm thấy phiếu xuất kho'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}
export default new ExportReceiptController()
