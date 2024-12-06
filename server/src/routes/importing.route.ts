import express from 'express'
import importOrderController from '~/controllers/importOrder.controller'
import importReceiptController from '~/controllers/importReceipt.controller'

import { checkJwt, checkRole } from '~/middleware/authentication'

const importingRouter = express.Router()

//IMPORT ORDER
importingRouter.post('/orders/', [checkJwt, checkRole], importOrderController.createImportOrder)
importingRouter.get('/orders/id/:id', [checkJwt], importOrderController.getImportOrderById)
importingRouter.get('/orders/status/:status', [checkJwt], importOrderController.getAllImportOrdersByStatus)
importingRouter.patch('/orders/:id', [checkJwt, checkRole], importOrderController.editImportOrderById)
importingRouter.delete('/orders/:id', [checkJwt], importOrderController.softDeleteImportOrderById)

//IMPORT RECEIPT
importingRouter.post('/receipts/', [checkJwt, checkRole], importReceiptController.createImportReceipt)
importingRouter.get('/receipts/id/:id', [checkJwt, checkRole], importReceiptController.getImportReceiptById)
importingRouter.get('/receipts/date', [checkJwt], importReceiptController.filterImportReceiptsByDate)
importingRouter.get(
  '/receipts/status/:status',
  [checkJwt, checkRole],
  importReceiptController.getAllImportReceiptsByStatus
)
importingRouter.patch('/receipts/:id', [checkJwt, checkRole], importReceiptController.editImportReceiptById)
importingRouter.delete('/receipts/:id', [checkJwt, checkRole], importReceiptController.softDeleteImportReceiptById)

export default importingRouter
