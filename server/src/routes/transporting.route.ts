import express from 'express'
import transportReceiptController from '~/controllers/transportReceipt.controller'

import { checkJwt, checkRole } from '~/middleware/authentication'

const transportingRouter = express.Router()

//TRANSPORT ORDER
transportingRouter.post('/', [checkJwt, checkRole], transportReceiptController.createTransportReceipt)
transportingRouter.get('/id/:id', [checkJwt, checkRole], transportReceiptController.getTransportReceiptById)
transportingRouter.get(
  '/status/:status',
  [checkJwt, checkRole],
  transportReceiptController.getAllTransportReceiptsByStatus
)
transportingRouter.patch('/:id', [checkJwt, checkRole], transportReceiptController.editTransportReceiptById)
transportingRouter.delete('/:id', [checkJwt, checkRole], transportReceiptController.softDeleteTransportReceiptById)

export default transportingRouter
