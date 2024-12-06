import { validate } from 'class-validator'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import EXPORT_STATUS from '~/constants/ExportOrderStatusCode'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { TransportDetails } from '~/models/entities/TransportDetails'
import { TransportReceipts } from '~/models/entities/TransportReceipts'
import { Users } from '~/models/entities/Users'
import { Warehouses } from '~/models/entities/Warehouses'
import { iTransportReceipt } from './types'
import { ExportReceipts } from '~/models/entities/ExportReceipts'

dotenv.config()

//use datasource
const transportReceiptRepo = appDataSource.getRepository(TransportReceipts)
const transportDetailRepo = appDataSource.getRepository(TransportDetails)
const exportReceiptRepo = appDataSource.getRepository(ExportReceipts)
const warehouseRepo = appDataSource.getRepository(Warehouses)
const userRepository = appDataSource.getRepository(Users)

class TransportReceiptController {
  //[GET /TransportReceipt/:status]
  async getAllTransportReceiptsByStatus(req: Request, res: Response, next: NextFunction) {
    //get status from query string
    const status: number = +req.params.status
    try {
      //get all TransportReceipt from DB
      const transportReceipt = await transportReceiptRepo.find({
        select: {
          idTransportReceipts: true,
          transportFromDate: true,
          transportToDate: true,
          idWarehouseFrom2: {
            idWarehouse: true,
            name: true,
            address: true,
            provinceCode: true
          },
          idWarehouseTo2: {
            idWarehouse: true,
            name: true,
            address: true,
            provinceCode: true
          },
          status: true
        },
        where: { status: status },
        order: {
          transportFromDate: 'ASC'
        },
        relations: {
          idWarehouseFrom2: true,
          idWarehouseTo2: true
        }
      })
      res.status(STATUS.SUCCESS).send(transportReceipt)
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Trạng thái phiếu điều chuyển không đúng'
      })
    }
  }
  //[GET /TransportReceipt/:id]
  async getTransportReceiptById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id
    //get TransportReceipt by id from DB
    try {
      const transportReceipt = await transportReceiptRepo.findOneOrFail({
        select: {
          idUserSend2: {
            idUsers: true,
            username: true
          },
          idUserReceive2: {
            idUsers: true,
            username: true
          },
          idWarehouseFrom2: {
            idWarehouse: true,
            name: true,
            address: true,
            provinceCode: true
          },
          idWarehouseTo2: {
            idWarehouse: true,
            name: true,
            address: true,
            provinceCode: true
          },
          transportDetails: true
        },
        where: {
          idTransportReceipts: id
        },
        relations: {
          idUserSend2: true,
          idUserReceive2: true,
          idWarehouseFrom2: true,
          idWarehouseTo2: true,
          transportDetails: {
            idExportReceipt2: true
          }
        }
      })

      res.status(STATUS.SUCCESS).send(transportReceipt)
    } catch (error) {
      console.log(error)
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy phiếu điều chuyển kho'
      })
    }
  }

  //[POST /TransportReceipt/create-TransportReceipt]
  async createTransportReceipt(req: Request, res: Response, next: NextFunction) {
    //get params from request body
    const {
      idUserSend,
      // idUserReceive,
      transportFromDate,
      transportToDate,
      idWarehouseFrom,
      idWarehouseTo,
      plateNumber,
      transportDetails
    }: iTransportReceipt = req.body

    let transportReceipt = new TransportReceipts()
    transportReceipt.idWarehouseFrom = idWarehouseFrom
    transportReceipt.idWarehouseTo = idWarehouseTo
    transportReceipt.idUserSend = idUserSend
    // transportReceipt.idUserReceive = idUserReceive
    transportReceipt.transportFromDate = new Date(transportFromDate)
    transportReceipt.transportToDate = new Date(transportToDate)
    transportReceipt.plateNumber = plateNumber
    transportReceipt.status = EXPORT_STATUS.IN_PROCESS_ON_THE_WAY

    //validate type of params
    const errors = await validate(transportReceipt)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save TransportReceipt
    try {
      transportReceipt = await transportReceiptRepo.save(transportReceipt)
      const warehouseFrom = await warehouseRepo.findOneOrFail({
        select: ['idWarehouse', 'name', 'address'],
        where: {
          idWarehouse: transportReceipt.idWarehouseFrom
        }
      })
      let warehouseTo = new Warehouses()
      if (transportReceipt.idWarehouseTo) {
        warehouseTo = await warehouseRepo.findOneOrFail({
          select: ['idWarehouse', 'name', 'address'],
          where: {
            idWarehouse: transportReceipt.idWarehouseTo
          }
        })
      }

      const userSend = await userRepository.findOneOrFail({
        select: ['idUsers', 'username'],
        where: {
          idUsers: transportReceipt.idUserSend
        }
      })

      //push receipt details
      const transportDetailArray = transportDetails.map((detail) => {
        const transportDetail = new TransportDetails()
        transportDetail.idTransportReceipt = transportReceipt.idTransportReceipts
        transportDetail.idExportReceipt = detail.idExportReceipt

        return transportDetail
      })

      //try to save order details
      transportDetailRepo.save(transportDetailArray)

      //update status on the way in export receipt
      transportDetails.forEach(async (receipt) => {
        await exportReceiptRepo.update(
          {
            idExportReceipts: receipt.idExportReceipt
          },
          {
            status: EXPORT_STATUS.IN_PROCESS_ON_THE_WAY
          }
        )
      })

      //if ok
      res.status(STATUS.CREATED).send({
        ...transportReceipt,
        idWarehouseFrom2: {
          ...warehouseFrom
        },
        idUserSend2: {
          ...userSend
        },
        idWarehouseTo2: {
          ...warehouseTo
        }
      })
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Lỗi không xác định'
      })
    }
  }

  //[PATCH /:id]
  async editTransportReceiptById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id: number = +req.params.id
    //get params from body request
    const { idUserReceive, idWarehouseTo, transportToDate, plateNumber, status, idUpdated }: iTransportReceipt =
      req.body

    let transportReceipt = new TransportReceipts()
    transportReceipt.idWarehouseTo = idWarehouseTo
    // transportReceipt.idUserReceive = idUserReceive
    transportReceipt.transportToDate = new Date(transportToDate)
    transportReceipt.plateNumber = plateNumber
    transportReceipt.status = status
    //validate type of params
    const errors = await validate(transportReceipt)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //get TransportReceipt by id from DB
    try {
      transportReceipt = await transportReceiptRepo.findOneOrFail({
        where: {
          idTransportReceipts: id
        },
        relations: ['transportDetails']
      })
    } catch (error) {
      console.log(error)
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy phiếu điều chuyển kho'
      })
      return
    }

    try {
      //update by status
      switch (status) {
        case EXPORT_STATUS.IN_PROCESS_ON_THE_WAY: //UPDATE INFO
          {
            const updateResult = await transportReceiptRepo.update(
              {
                idTransportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_ON_THE_WAY
              },
              {
                idUserReceive,
                idWarehouseTo,
                transportToDate,
                plateNumber,
                status: EXPORT_STATUS.FINISHED
              }
            )
            if (updateResult.affected === 0) {
              return res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu điều chuyển kho đang vận chuyển'
              })
            }
          }
          transportReceipt = {
            ...transportReceipt,
            idUserReceive,
            idWarehouseTo,
            transportToDate: new Date(transportToDate),
            plateNumber,
            status: EXPORT_STATUS.FINISHED
          }
          break
        case EXPORT_STATUS.FINISHED:
          {
            const updateResult = await transportReceiptRepo.update(
              {
                idTransportReceipts: id,
                status: EXPORT_STATUS.IN_PROCESS_ON_THE_WAY
              },
              {
                status
              }
            )
            await exportReceiptRepo.update(
              {
                idExportReceipts: transportReceipt.transportDetails[0].idExportReceipt
              },
              {
                status
              }
            )
            if (updateResult.affected === 0) {
              res.status(STATUS.BAD_REQUEST).send({
                error: 'Không thể cập nhật phiếu điều chuyển kho đang vận chuyển'
              })
              return
            }
            transportReceipt = {
              ...transportReceipt,
              status
            }
          }
          break
        default:
          res.status(STATUS.BAD_REQUEST).send({
            error: 'Không thể cập nhật phiếu điều chuyển kho'
          })
          return
      }

      //update update_at, id_updated fields
      const updateDateResult = await transportReceiptRepo.update(
        {
          idTransportReceipts: id
        },
        {
          idUpdated: idUpdated,
          updatedAt: new Date()
        }
      )
      transportReceipt = {
        ...transportReceipt,
        idUpdated: idUpdated ? idUpdated : 0,
        updatedAt: new Date()
      }
      if (updateDateResult.affected === 0) {
        res.status(STATUS.BAD_REQUEST).send({
          error: 'Không thể cập nhật ngày & người chỉnh sửa phiếu điều chuyển kho'
        })
        return
      }
    } catch (error) {
      console.log(error)

      res.status(STATUS.BAD_REQUEST).send({
        error: 'Không thể cập nhật phiếu điều chuyển kho'
      })
      return
    }
    //if ok
    res.status(STATUS.SUCCESS).send(transportReceipt)
  }

  //[DELETE /:id]
  async softDeleteTransportReceiptById(req: Request, res: Response, next: NextFunction) {
    const id: number = +req.params.id
    const { idUpdated }: iTransportReceipt = req.body

    const updateResult = await transportReceiptRepo.update(
      {
        idTransportReceipts: id,
        status: EXPORT_STATUS.IN_PROCESS_ON_THE_WAY
      },
      {
        status: EXPORT_STATUS.FAILED,
        idUpdated,
        updatedAt: new Date()
      }
    )
    if (updateResult.affected === 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Không tìm thấy phiếu điều chuyển kho'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}
export default new TransportReceiptController()
