import { Express } from 'express'
import authRouter from './auth'
import goodsRouter from './goods.route'
import importingRouter from './importing.route'
import providerRouter from './provider.route'
import userRouter from './user.route'
import warehouseRouter from './warehouse.route'
import exportingRouter from './exporting.route'
import stocktakingRouter from './stocktaking.route'
import transportingRouter from './transporting.route'

function route(app: Express) {
  app.use('/users', userRouter)
  app.use('/auth', authRouter)
  app.use('/warehouses', warehouseRouter)
  app.use('/goods', goodsRouter)
  app.use('/providers', providerRouter)
  app.use('/import', importingRouter)
  app.use('/export', exportingRouter)
  app.use('/transport', transportingRouter)
  app.use('/stocktaking', stocktakingRouter)
}

export default route
