import express from 'express'
import exportOrderController from '~/controllers/exportOrder.controller'
import exportReceiptController from '~/controllers/exportReceipt.controller'

import { checkJwt, checkRole } from '~/middleware/authentication'

const exportingRouter = express.Router()

//EXPORT ORDER
exportingRouter.post('/orders/', [checkJwt], exportOrderController.createExportOrder)
exportingRouter.get('/orders/id/:id', [checkJwt], exportOrderController.getExportOrderById)
exportingRouter.get('/orders/', [checkJwt], exportOrderController.getAllExportOrders)
exportingRouter.delete('/orders/:id', [checkJwt], exportOrderController.softDeleteExportOrderById)

//EXPORT RECEIPT
exportingRouter.post('/receipts/', [checkJwt, checkRole], exportReceiptController.createExportReceipt)
exportingRouter.get('/receipts/id/:id', [checkJwt, checkRole], exportReceiptController.getExportReceiptById)
exportingRouter.get(
  '/receipts/status/:status',
  [checkJwt, checkRole],
  exportReceiptController.getAllExportReceiptsByStatus
)
exportingRouter.get('/receipts/date', [checkJwt], exportReceiptController.filterExportReceiptsByDate)
exportingRouter.patch('/receipts/:id', [checkJwt, checkRole], exportReceiptController.editExportReceiptById)
exportingRouter.delete('/receipts/:id', [checkJwt, checkRole], exportReceiptController.softDeleteExportReceiptById)

export default exportingRouter
