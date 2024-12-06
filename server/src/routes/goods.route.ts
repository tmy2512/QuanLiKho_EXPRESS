import express from 'express'
import goodsController from '~/controllers/goods.controller'
import goodsGroupController from '~/controllers/goodsGroup.controller'
import goodsTypeController from '~/controllers/goodsType.controller'
import goodsUnitController from '~/controllers/goodsUnit.controller'
import { checkJwt, checkRole } from '~/middleware/authentication'

const goodsRouter = express.Router()

//goods group
goodsRouter.post('/groups', [checkJwt, checkRole], goodsGroupController.createGoodsGroup)
goodsRouter.get('/groups', [checkJwt, checkRole], goodsGroupController.getAllGoodsGroups)
goodsRouter.get('/groups/:id', [checkJwt, checkRole], goodsGroupController.getGoodsGroupById)
goodsRouter.patch('/groups/:id', [checkJwt, checkRole], goodsGroupController.editGoodsGroupById)
goodsRouter.delete('/groups/:id', [checkJwt, checkRole], goodsGroupController.softDeleteGoodsGroupById)

//goods type
goodsRouter.post('/types', [checkJwt, checkRole], goodsTypeController.createGoodsType)
goodsRouter.get('/types', [checkJwt, checkRole], goodsTypeController.getAllGoodsType)
goodsRouter.get('/types/:id', [checkJwt, checkRole], goodsTypeController.getGoodsTypeById)
goodsRouter.patch('/types/:id', [checkJwt, checkRole], goodsTypeController.editGoodsTypeById)
goodsRouter.delete('/types/:id', [checkJwt, checkRole], goodsTypeController.softDeleteGoodsTypeById)

//goods Unit
goodsRouter.post('/units', [checkJwt], goodsUnitController.createGoodsUnit)
goodsRouter.get('/units', [checkJwt], goodsUnitController.getAllGoodsUnits)
goodsRouter.get('/units/:id', [checkJwt], goodsUnitController.getGoodsUnitById)
goodsRouter.patch('/units/:id', [checkJwt], goodsUnitController.editGoodsUnitById)
goodsRouter.delete('/units/:id', [checkJwt], goodsUnitController.softDeleteGoodsUnitById)

//goods
goodsRouter.post('/', [checkJwt, checkRole], goodsController.createGoods)
goodsRouter.post('/modify', [checkJwt, checkRole], goodsController.modifyGoods)
goodsRouter.get('/', [checkJwt, checkRole], goodsController.getAllGoods)
goodsRouter.get('/search', [checkJwt, checkRole], goodsController.findGoods)
goodsRouter.get('/:id', [checkJwt, checkRole], goodsController.getGoodsById)
goodsRouter.patch('/:id', [checkJwt, checkRole], goodsController.editGoodsById)
goodsRouter.delete('/:id', [checkJwt, checkRole], goodsController.softDeleteGoodsById)

export default goodsRouter
