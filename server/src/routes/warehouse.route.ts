import express from 'express'
import warehouseController from '~/controllers/warehouse.controller'

import { checkJwt, checkRole } from '~/middleware/authentication'

const warehouseRouter = express.Router()

warehouseRouter.post('/', [checkJwt, checkRole], warehouseController.createWarehouse)
warehouseRouter.get('/', [checkJwt, checkRole], warehouseController.getAllWarehouses)
warehouseRouter.get('/id/:id', [checkJwt, checkRole], warehouseController.getWarehouseById)
warehouseRouter.get('/province/:provinceCode', [checkJwt, checkRole], warehouseController.getWarehouseByProvinceCode)
warehouseRouter.get('/slots/:id', [checkJwt, checkRole], warehouseController.getWarehouseSlots)
warehouseRouter.patch('/:id', [checkJwt, checkRole], warehouseController.editWarehouseById)
warehouseRouter.delete('/:id', [checkJwt, checkRole], warehouseController.softDeleteWarehouseById)

export default warehouseRouter
