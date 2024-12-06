import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { appDataSource } from '~/constants/appDataSource'
import STATUS from '~/constants/statusCode'
import { Providers } from '~/models/entities/Providers'
import { Users } from '~/models/entities/Users'

//use datasource
const providerRepo = appDataSource.getRepository(Providers)

class ProviderController {
  //[POST /Providers]
  async createProvider(req: Request, res: Response, next: NextFunction) {
    const { name, address } = req.body

    let provider = new Providers()
    provider.name = name
    provider.address = address

    //validate type of params
    const errors = await validate(provider)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({ error: 'Dữ liệu không đúng định dạng' })
      return
    }

    //try to save, if fails, the username is already in use
    try {
      provider = await providerRepo.save(provider)
      res.status(STATUS.CREATED).send(provider)
    } catch (error) {
      res.status(STATUS.CONFLICT).send({
        error: 'Trùng tên nhà cung cấp'
      })
      return
    }
  }
  //[GET /Providers]
  async getAllProviders(req: Request, res: Response, next: NextFunction) {
    //get all Providers from DB
    const providers = await providerRepo.find({
      select: ['idProviders', 'name', 'address', 'deletedAt'],
      withDeleted: true
    })
    res.status(STATUS.SUCCESS).send(providers)
  }

  //[GET /Providers/:id]
  async getProviderById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id

    //get Provider by id from DB
    try {
      const provider = await providerRepo.findOneOrFail({
        where: {
          idProviders: id
        },
        withDeleted: true
      })

      //if ok
      res.status(STATUS.SUCCESS).send(provider)
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy nhà cung cấp'
      })
    }
  }

  //[PATCH /Providers/:id]
  async editProviderById(req: Request, res: Response, next: NextFunction) {
    //get id from query string
    const id = +req.params.id
    //get params from body request
    const { name, address } = req.body

    //validate type
    const provider = new Providers()
    provider.name = name
    provider.address = address
    const errors = await validate(provider)
    if (errors.length > 0) {
      res.status(STATUS.BAD_REQUEST).send({
        error: 'Dữ liệu không đúng định dạng'
      })
      return
    }

    try {
      providerRepo.update(
        {
          idProviders: id
        },
        {
          name,
          address
        }
      )
      //if ok
      res.status(STATUS.NO_CONTENT).send()
    } catch (error) {
      res.status(STATUS.BAD_REQUEST).send('Không thể cập nhật thông tin nhà cung cấp')
    }
  }

  //[DELETE /:id]
  async softDeleteProviderById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id

    try {
      //check if provider deleted
      const deletedProvider = await providerRepo.findOne({
        where: {
          idProviders: id,
          deletedAt: undefined
        }
      })

      //if provider hasn't deleted
      if (deletedProvider !== null) {
        providerRepo.softDelete({
          idProviders: id
        })
      } else {
        providerRepo.restore({
          idProviders: id
        })
      }
    } catch (error) {
      res.status(STATUS.NOT_FOUND).send({
        error: 'Không tìm thấy nhà cung cấp'
      })
      return
    }

    //if ok
    res.status(STATUS.NO_CONTENT).send()
  }
}

export default new ProviderController()
