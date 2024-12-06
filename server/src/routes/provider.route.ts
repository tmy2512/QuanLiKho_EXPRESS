import express from 'express'
import providerController from '~/controllers/provider.controller'

import { checkJwt, checkRole } from '~/middleware/authentication'

const providerRouter = express.Router()

providerRouter.post('/', [checkJwt, checkRole], providerController.createProvider)
providerRouter.get('/', [checkJwt, checkRole], providerController.getAllProviders)
providerRouter.get('/:id', [checkJwt, checkRole], providerController.getProviderById)
providerRouter.patch('/:id', [checkJwt, checkRole], providerController.editProviderById)
providerRouter.delete('/:id', [checkJwt, checkRole], providerController.softDeleteProviderById)

export default providerRouter
